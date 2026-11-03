-- Run in Supabase SQL Editor (a separate, researcher-owned project).
-- Anonymous participants can INSERT only. Never store personal names in payload.
create table if not exists public.comet_submissions (
  session_id uuid primary key,
  experiment_version text not null,
  lang text not null check (lang in ('ja','zh')),
  complete boolean not null,
  payload jsonb not null,
  received_at timestamptz not null default now()
);
alter table public.comet_submissions enable row level security;
revoke all on table public.comet_submissions from anon, authenticated;
grant insert on table public.comet_submissions to anon;
-- Existing policy is replaced so reapplying this script is safe.
drop policy if exists "anonymous_insert_comet" on public.comet_submissions;
create policy "anonymous_insert_comet" on public.comet_submissions
for insert to anon with check (
 complete = true
 and jsonb_typeof(payload) = 'object'
 and payload->>'session_id' = session_id::text
 and jsonb_array_length(coalesce(payload->'records','[]'::jsonb)) <= 300
);
-- Researcher accesses data via authenticated Supabase SQL editor, not a browser public key.
-- Example export query:
-- select session_id, lang, received_at, payload from public.comet_submissions order by received_at desc;
