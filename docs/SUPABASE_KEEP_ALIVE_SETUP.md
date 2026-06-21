# Supabase 自動停止（7日間非アクティブ）を防ぐ仕組み — セットアップ手順書

> このドキュメントは **Claude Code への指示書** です。
> 別のプロジェクト（リポジトリ）でこのファイルを読み込んだ Claude Code が、
> 同じ「Supabase Keep Alive」の仕組みをゼロから構築できるように書かれています。
> 上から順に実行してください。

---

## 0. 背景と目的

Supabase の無料プランは **7日間アクセスがないとプロジェクトが自動的に一時停止（Pause）** される。
これを防ぐため、**GitHub Actions が毎日1回 Supabase の REST API に軽いリクエスト（ping）を送り**、
プロジェクトを「アクティブ」と見なさせ続ける。

この仕組みは別プロジェクト（sea-book）で実際に構築・運用して動作確認済み。
本手順は、その際に**実際にハマった落とし穴も含めて**まとめたもの。

---

## 1. 前提条件の確認

実行前に以下を確認すること。揃っていなければユーザーに尋ねる。

- [ ] 対象プロジェクトが **GitHub リポジトリ** にホストされている（GitHub Actions が使える）
- [ ] 対象プロジェクトが **Supabase** を使っている
- [ ] Supabase の以下2つの値が取得できる（Supabase ダッシュボード → Project Settings → API）
  - `Project URL`（例: `https://xxxxxxxxxxxx.supabase.co`）
  - `anon public` API キー

---

## 2. 【最重要】クエリ対象のテーブル名・カラム名を特定する

> ⚠️ ここが**最大の落とし穴**。存在しないテーブル名・カラム名を指定すると
> Supabase は **HTTP 400** を返し、ping が毎回失敗する。
> 実際に sea-book では `select=id` と書いたが、正しい主キーは `animal_id` で、
> これが原因で全実行が失敗していた。

### 手順

1. リポジトリ内のソースコードから、実在するテーブルとカラムを特定する。
   以下を grep する（プロジェクトの言語に合わせて拡張子は調整）:

   ```
   supabase.from(
   .from(
   .select(
   ```

2. 見つかった `from("テーブル名").select("カラム名")` の組み合わせから、
   **確実に存在する「テーブル名」と「カラム名」を1つ選ぶ**。
   主キー（id 系のカラム）が最も安全。

3. 確証が持てない場合は、Supabase ダッシュボードの **Table Editor** で
   テーブル名と列名を直接確認するようユーザーに依頼する。

### このステップで確定させる変数

| 変数 | 説明 | sea-book での実例 |
|------|------|-------------------|
| `<TABLE>`  | 存在するテーブル名 | `animals` |
| `<COLUMN>` | そのテーブルに存在するカラム名 | `animal_id` |

以降の `<TABLE>` `<COLUMN>` を、確定した実際の名前に置き換えること。

---

## 3. ワークフローファイルを作成する

`.github/workflows/keep-alive.yml` を以下の内容で作成する。
`<TABLE>` と `<COLUMN>` は **ステップ2で確定した実際の名前に置換** すること。

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
      - name: Ping Supabase
        run: |
          HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
            --connect-timeout 10 \
            --max-time 30 \
            -X GET "${{ secrets.SUPABASE_URL }}/rest/v1/<TABLE>?select=<COLUMN>&limit=1" \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json")

          echo "HTTP Status: $HTTP_STATUS"

          if [ "$HTTP_STATUS" = "200" ]; then
            echo "Success: Supabase is alive"
          elif [ "$HTTP_STATUS" = "000" ]; then
            echo "ERROR: Could not connect to Supabase (project may be paused). Manual resume required."
            exit 1
          else
            echo "ERROR: Unexpected HTTP status $HTTP_STATUS"
            exit 1
          fi
```

### このワークフローのポイント

- **HTTP ステータスコードをログに出力**するので、失敗時に原因（400 / 000 など）がすぐ分かる。
- `--connect-timeout` / `--max-time` でハングを防止。
- `000`（接続不可）= **プロジェクトが既に停止中**。この状態は ping では復旧不可（後述の注意点参照）。

---

## 4. GitHub Secrets を設定する

ワークフローは2つの Secret を参照する。これを設定しないと動かない。

リポジトリの **Settings → Secrets and variables → Actions → New repository secret** で、
以下2つを登録する:

| Secret 名 | 値 |
|-----------|-----|
| `SUPABASE_URL`      | Supabase の Project URL（例: `https://xxxx.supabase.co`、末尾スラッシュなし） |
| `SUPABASE_ANON_KEY` | Supabase の `anon public` API キー |

> Claude Code は Secret の値そのものを設定できない（Webブラウザ操作が必要）。
> このステップは**ユーザーに依頼**し、設定完了の確認を取ること。
> ※ GitHub CLI (`gh secret set`) が使える環境なら自動設定も可能。

---

## 5. main ブランチへ反映する

> ⚠️ **落とし穴その2**: feature ブランチにプッシュしただけでは、
> スケジュール実行（cron）は反映されない。
> **`schedule` トリガーは原則 default ブランチ（main）の内容で動く**。
> sea-book では feature ブランチに修正をプッシュしたのに main が古いままで、
> 「直したはずなのに失敗し続ける」状態になった。

- ワークフローファイルは **main（default ブランチ）にマージ／プッシュ** すること。
- 変更をコミットし、main へ反映する。

---

## 6. 動作確認する

1. GitHub の **Actions タブ → "Supabase Keep Alive" → "Run workflow"** で手動実行する
   （`workflow_dispatch` を入れてあるので手動実行できる）。
   - GitHub CLI が使えるなら: `gh workflow run keep-alive.yml`
2. 実行ログを開き、**`HTTP Status: 200` と `Success: Supabase is alive`** が出れば成功。
3. `HTTP Status: 400` が出た場合 → **テーブル名／カラム名が間違っている**。ステップ2に戻る。
4. `HTTP Status: 000` が出た場合 → **プロジェクトが停止している**。下記「重要な制約」を参照。

---

## 7. 重要な制約・既知の注意点（必読）

### (a) 一度停止したプロジェクトは ping では復旧できない

keep-alive は「**稼働中**のプロジェクトを止めさせない」仕組み。
プロジェクトが既に停止（Pause）すると、ドメインの **DNS 解決自体が失敗**し
（`curl: (6) Could not resolve host` / HTTP `000`）、ping は届かない。
→ **停止したら、まず Supabase ダッシュボードで手動 Resume** してから keep-alive を効かせる。

### (b) 無料プランは「アクティブなプロジェクト2つまで」

無料プランでアクティブにできるプロジェクトは **2つまで**。
3つ目を新規作成すると上限超過となり、既存プロジェクトが停止対象になることがある。
実際 sea-book では、別の新規プロジェクト作成が引き金で既存プロジェクトが停止した。
→ keep-alive を入れても、**プロジェクト数が上限を超えていると停止は防げない**。
   不要なプロジェクトは削除 or Pause して、アクティブ数を2以内に保つこと。

### (c) cron の実行時刻はずれることがある

GitHub Actions の `schedule` は混雑時に数分〜十数分遅延することがある（仕様）。
毎日確実に1回走れば 7日間制限には十分間に合うので、多少の遅延は問題ない。

---

## 8. 完了チェックリスト

- [ ] ステップ2で実在する `<TABLE>` / `<COLUMN>` を特定した
- [ ] `.github/workflows/keep-alive.yml` を作成した（`<TABLE>`/`<COLUMN>` 置換済み）
- [ ] `SUPABASE_URL` / `SUPABASE_ANON_KEY` の Secret を設定した（ユーザー確認済み）
- [ ] main ブランチへ反映した
- [ ] 手動実行して `HTTP Status: 200` を確認した
- [ ] アクティブな Supabase プロジェクト数が2以内であることを確認した

すべて満たせば、対象プロジェクトの「7日間非アクティブ停止」は防止される。
