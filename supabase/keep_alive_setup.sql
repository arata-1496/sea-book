-- keep-alive 用テーブルと書き込み権限の準備
-- 実行方法: Supabase ダッシュボード → SQL Editor に貼り付けて Run
--
-- このSQLは1回だけ実行すればよい。
-- 以後、GitHub Actions が毎日この keep_alive テーブルの1行を更新（upsert）し、
-- DB への「書き込み活動」を確実に発生させてプロジェクトの自動停止を防ぐ。

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
