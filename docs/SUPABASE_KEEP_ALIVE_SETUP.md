# Supabase 自動停止（7日間非アクティブ）を防ぐ仕組み — セットアップ手順書

> このドキュメントは **Claude Code への指示書** です。
> 別のプロジェクト（リポジトリ）でこのファイルを読み込んだ Claude Code が、
> 同じ「Supabase Keep Alive」の仕組みをゼロから構築できるように書かれています。
> 上から順に実行してください。

---

## 0. 背景と目的

Supabase の無料プランは **7日間アクティビティがないとプロジェクトが自動的に一時停止（Pause）** される。
これを防ぐため、**GitHub Actions が毎日1回 Supabase の DB に軽い書き込み（upsert）を行い**、
プロジェクトを「アクティブ」と見なさせ続ける。

> ⚠️ **重要な教訓（実体験）**：
> 当初は「軽い **読み取り（GET）**」で ping していたが、**毎日 HTTP 200 で成功していたのに
> Supabase から『7日間活動不足で停止予定』のメールが届いた**。
> 読み取りだけでは「sufficient activity（十分な活動）」と見なされない可能性が高い。
> そのため本手順では **書き込み（DB への upsert）** を行う方式を採用している。これは実際に効果を確認済み。

---

## 1. 前提条件の確認

実行前に以下を確認すること。揃っていなければユーザーに尋ねる。

- [ ] 対象プロジェクトが **GitHub リポジトリ** にホストされている（GitHub Actions が使える）
- [ ] 対象プロジェクトが **Supabase** を使っている
- [ ] Supabase の以下2つの値が取得できる（Supabase ダッシュボード → Project Settings → API）
  - `Project URL`（例: `https://xxxxxxxxxxxx.supabase.co`）
  - `anon public` API キー

---

## 2. 【最重要】対象プロジェクトの URL が正しいか確認する

> ⚠️ **落とし穴その1（実体験）**：
> GitHub Secret の `SUPABASE_URL` が **古い／別のプロジェクト** を指していると、
> keep-alive は別プロジェクトに当たって HTTP 200 を返し続ける一方で、
> **本来守りたいプロジェクトは放置され、停止予告メールが届く**。
> （新しくプロジェクトを作り直した場合に起きやすい。）

### 手順

1. ユーザーに、守りたい Supabase プロジェクトの **Project URL**（ダッシュボード → Project Settings → API）を確認してもらう。
2. その URL に含まれるプロジェクトID（`https://<ここ>.supabase.co`）が、停止予告メールに書かれている Project ID と一致するか確認する。
3. **ステップ5で設定する Secret には、必ずこの正しい URL と anon キーを使う**こと。

---

## 3. keep-alive 用テーブルを Supabase に作成する（書き込み先）

書き込み方式には、書き込み専用のダミーテーブルが必要。
以下の SQL を **リポジトリに `supabase/keep_alive_setup.sql` として保存**し、
**ユーザーに Supabase ダッシュボード → SQL Editor で実行してもらう**（Claude Code は SQL を直接実行できない）。

```sql
-- keep-alive 用テーブルと書き込み権限の準備
-- 実行方法: Supabase ダッシュボード → SQL Editor に貼り付けて Run
-- このSQLは1回だけ実行すればよい。

-- 1) keep-alive 専用テーブル（1行だけ使う）
create table if not exists public.keep_alive (
  id integer primary key,
  last_ping timestamptz not null default now()
);

-- 2) 初期行を作成（id=1 を固定で使う）
insert into public.keep_alive (id, last_ping)
values (1, now())
on conflict (id) do update set last_ping = now();

-- 3) RLS を有効化
alter table public.keep_alive enable row level security;

-- 4) anon ロールに keep_alive への読み書きを許可（このテーブルだけ）
--    ※ keep_alive はダミー用途のテーブルなので公開しても実害なし
drop policy if exists "allow anon keep_alive" on public.keep_alive;
create policy "allow anon keep_alive"
  on public.keep_alive
  for all
  to anon
  using (true)
  with check (true);
```

> ✅ ユーザーが SQL を実行し終えたことを必ず確認してから次へ進む。
> （テーブルが無いまま動かすと HTTP 404 で失敗する。）

---

## 4. ワークフローファイルを作成する

`.github/workflows/keep-alive.yml` を以下の内容で作成する。**このまま使える**（テーブル名 `keep_alive` は固定）。

```yaml
name: Supabase Keep Alive

on:
  schedule:
    - cron: '0 0 * * *'  # 毎日午前0時(UTC)に実行
  workflow_dispatch:       # 手動実行もできるようにする

jobs:
  ping:
    runs-on: ubuntu-latest

    steps:
      - name: Write to Supabase (keep_alive)
        run: |
          NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

          # keep_alive テーブルの id=1 の行を upsert（書き込み）して DB 活動を発生させる
          HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
            --connect-timeout 10 \
            --max-time 30 \
            -X POST "${{ secrets.SUPABASE_URL }}/rest/v1/keep_alive?on_conflict=id" \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            -H "Prefer: resolution=merge-duplicates" \
            -d "{\"id\": 1, \"last_ping\": \"${NOW}\"}")

          echo "HTTP Status: $HTTP_STATUS"

          # 201 Created / 200 OK / 204 No Content はいずれも書き込み成功
          if [ "$HTTP_STATUS" = "201" ] || [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "204" ]; then
            echo "Success: wrote keep_alive row (Supabase is alive)"
          elif [ "$HTTP_STATUS" = "000" ]; then
            echo "ERROR: Could not connect to Supabase (project may be paused). Manual resume required."
            exit 1
          elif [ "$HTTP_STATUS" = "404" ]; then
            echo "ERROR: keep_alive table not found. Run supabase/keep_alive_setup.sql in the Supabase SQL Editor first."
            exit 1
          elif [ "$HTTP_STATUS" = "401" ] || [ "$HTTP_STATUS" = "403" ]; then
            echo "ERROR: Not authorized to write. Check RLS policy in supabase/keep_alive_setup.sql and the SUPABASE_ANON_KEY secret."
            exit 1
          else
            echo "ERROR: Unexpected HTTP status $HTTP_STATUS"
            exit 1
          fi
```

### このワークフローのポイント

- **読み取りではなく書き込み（upsert）** を行うので、確実に DB アクティビティが発生する。
- **HTTP ステータスコードをログに出力**し、失敗原因をすぐ切り分けられる：
  - `000` = 接続不可（プロジェクトが既に停止中）→ ping では復旧不可、手動 Resume が必要
  - `404` = `keep_alive` テーブルが無い → ステップ3の SQL を未実行
  - `401`/`403` = 書き込み権限なし → RLS ポリシー or anon キーを確認

---

## 5. GitHub Secrets を設定する

ワークフローは2つの Secret を参照する。これを設定しないと動かない。

リポジトリの **Settings → Secrets and variables → Actions → New repository secret** で、
以下2つを登録する（**ステップ2で確認した正しいプロジェクトの値**を使うこと）:

| Secret 名 | 値 |
|-----------|-----|
| `SUPABASE_URL`      | Supabase の Project URL（例: `https://xxxx.supabase.co`、末尾スラッシュなし） |
| `SUPABASE_ANON_KEY` | Supabase の `anon public` API キー |

> Claude Code は Secret の値そのものを設定できない（Webブラウザ操作が必要）。
> このステップは**ユーザーに依頼**し、設定完了の確認を取ること。
> ※ すでに古い値が入っている場合は、**Update で上書き**してもらう（別プロジェクトを指す事故を防ぐ）。

---

## 6. main ブランチへ反映する

> ⚠️ **落とし穴その2（実体験）**: feature ブランチにプッシュしただけでは、
> スケジュール実行（cron）は反映されない。
> **`schedule` トリガーは原則 default ブランチ（main）の内容で動く**。
> feature ブランチに修正をプッシュしたのに main が古いままで、
> 「直したはずなのに失敗し続ける」状態になった。

- ワークフローファイルと SQL は **main（default ブランチ）にマージ／プッシュ** すること。

---

## 7. 動作確認する

1. GitHub の **Actions タブ → "Supabase Keep Alive" → "Run workflow"** で手動実行する
   （`workflow_dispatch` を入れてあるので手動実行できる）。
2. 実行ログを開き、**`HTTP Status: 200`（または 201/204）** と
   **`Success: wrote keep_alive row`** が出れば成功。
3. `404` → SQL 未実行（ステップ3へ）。`401`/`403` → 権限（RLS/キー確認）。
   `000` → プロジェクト停止中（手動 Resume）。
4. Supabase ダッシュボードの Table Editor で `keep_alive` テーブルの `last_ping` が
   実行時刻に更新されていれば確実。

---

## 8. 重要な制約・既知の注意点（必読）

### (a) 一度停止したプロジェクトは ping では復旧できない

keep-alive は「**稼働中**のプロジェクトを止めさせない」仕組み。
プロジェクトが既に停止（Pause）すると、ドメインの **DNS 解決自体が失敗**し（HTTP `000`）、書き込みは届かない。
→ **停止したら、まず Supabase ダッシュボードで手動 Resume** してから keep-alive を効かせる。

### (b) 読み取りだけでは活動と見なされないことがある（本手順が書き込み方式の理由）

軽い GET 読み取りを毎日成功させていても、Supabase の停止判定では
「十分な活動」と見なされず停止予告が届いた実績がある。
→ **本手順のように書き込み（upsert）を行う**こと。

### (c) 無料プランは「アクティブなプロジェクト2つまで」

無料プランでアクティブにできるプロジェクトは **2つまで**。
3つ目を新規作成すると上限超過となり、既存プロジェクトが停止対象になることがある。
→ keep-alive を入れても、**プロジェクト数が上限を超えていると停止は防げない**。
   不要なプロジェクトは削除 or Pause して、アクティブ数を2以内に保つこと。

### (d) cron の実行時刻はずれることがある

GitHub Actions の `schedule` は混雑時に数分〜十数分遅延することがある（仕様）。
毎日確実に1回走れば 7日間制限には十分間に合うので、多少の遅延は問題ない。

---

## 9. 完了チェックリスト

- [ ] ステップ2で `SUPABASE_URL` が**正しいプロジェクト**を指すことを確認した
- [ ] ステップ3の SQL（`keep_alive` テーブル＋RLS）を Supabase で実行した（ユーザー確認済み）
- [ ] `.github/workflows/keep-alive.yml` を作成した（書き込み方式）
- [ ] `SUPABASE_URL` / `SUPABASE_ANON_KEY` の Secret を設定／上書きした（ユーザー確認済み）
- [ ] main ブランチへ反映した
- [ ] 手動実行して `HTTP Status: 200`（または 201/204）と書き込み成功を確認した
- [ ] アクティブな Supabase プロジェクト数が2以内であることを確認した

すべて満たせば、対象プロジェクトの「7日間非アクティブ停止」は防止される。
