-- Run in the Supabase SQL editor.
-- RLS is ON and there are NO public policies, so the browser (anon key) can neither read nor write.
-- Only the server routes, using the service role key, insert rows.

create table if not exists public.join_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  department text not null,
  level text not null check (level in ('100L','200L','300L','400L','500L')),
  phone text,
  interests text[] not null default '{}',
  consented_at timestamptz not null,
  created_at timestamptz not null default now()
);
create unique index if not exists join_requests_email_key on public.join_requests (lower(email));
alter table public.join_requests enable row level security;

create table if not exists public.tutorial_interest (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  department text not null,
  level text not null check (level in ('100L','200L','300L','400L','500L')),
  subjects text not null check (char_length(subjects) between 3 and 500),
  phone text,
  consented_at timestamptz not null,
  created_at timestamptz not null default now()
);
-- The same email may register different subjects, but not the exact same request twice
create unique index if not exists tutorial_interest_dedupe on public.tutorial_interest (lower(email), md5(lower(subjects)));
alter table public.tutorial_interest enable row level security;

-- When you build the admin dashboard, let only executives read rows, for example:
-- create policy "executives read join_requests" on public.join_requests
--   for select to authenticated using (exists (select 1 from public.executives e where e.user_id = auth.uid()));
-- (repeat for tutorial_interest; create the executives table first)
