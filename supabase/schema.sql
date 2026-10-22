-- ==============================================================================
-- NSBE UNILORIN MASTER DATABASE SCHEMA & STORAGE SETUP
-- ==============================================================================
-- Run this script in the Supabase SQL Editor.
-- It creates all tables, constraints, indexes, Row Level Security (RLS) policies,
-- and registers storage buckets for PDF uploads and media assets.
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 1. PUBLIC FORMS & STUDENT SUBMISSIONS
-- ==============================================================================

-- Join Requests (Membership Applications)
create table if not exists public.join_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  department text not null,
  level text not null check (level in ('100L', '200L', '300L', '400L', '500L')),
  phone text,
  interests text[] not null default '{}',
  consented_at timestamptz not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved')),
  created_at timestamptz not null default now()
);

create unique index if not exists join_requests_email_key on public.join_requests (lower(email));
create index if not exists idx_join_requests_status on public.join_requests (status);
alter table public.join_requests enable row level security;

-- Tutorial Interest (Academic Course Inquiries)
create table if not exists public.tutorial_interest (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  department text not null,
  level text not null check (level in ('100L', '200L', '300L', '400L', '500L')),
  subjects text not null check (char_length(subjects) between 3 and 500),
  phone text,
  consented_at timestamptz not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'resolved')),
  created_at timestamptz not null default now()
);

create unique index if not exists tutorial_interest_dedupe on public.tutorial_interest (lower(email), md5(lower(subjects)));
create index if not exists idx_tutorial_interest_status on public.tutorial_interest (status);
alter table public.tutorial_interest enable row level security;


-- ==============================================================================
-- 2. ACADEMIC HUB (PAST QUESTIONS & LECTURE MATERIALS)
-- ==============================================================================

create table if not exists public.academic_resources (
  id uuid primary key default gen_random_uuid(),
  code text not null, -- e.g. 'CPE 311'
  title text not null, -- e.g. 'Data Structures & Algorithms'
  department text not null, -- department slug (e.g. 'computer', 'mechanical')
  level text not null check (level in ('100L', '200L', '300L', '400L', '500L')),
  resource_type text not null check (resource_type in ('past-question', 'lecture-material', 'final-year-project')),
  session text not null default '2023/2024', -- e.g. '2023/2024 session'
  year integer not null default extract(year from now())::integer,
  format text not null default 'PDF',
  file_size text default '—',
  file_url text not null, -- Supabase Storage download link or cloud link
  notes text,
  available boolean not null default true,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_academic_resources_lookup on public.academic_resources (level, department, resource_type);
create index if not exists idx_academic_resources_code on public.academic_resources (lower(code));
alter table public.academic_resources enable row level security;

-- Public can read all published and available academic resources
create policy "Public can view published academic resources"
  on public.academic_resources
  for select
  using (status = 'published');


-- ==============================================================================
-- 3. CHAPTER EVENTS
-- ==============================================================================

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  date date not null,
  start_time text, -- e.g. '10:00 AM'
  end_time text,
  venue text,
  organizer text not null default 'NSBE Unilorin',
  image_url text,
  image_alt text,
  registration_url text,
  registration_deadline date,
  confirmed boolean not null default true,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_events_date on public.events (date);
alter table public.events enable row level security;

-- Public can read published events
create policy "Public can view published events"
  on public.events
  for select
  using (status = 'published');


-- ==============================================================================
-- 4. PROGRAMS & SCHOLARSHIPS
-- ==============================================================================

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text, -- 'Academic', 'Career', 'Technical'
  tone text not null default 'card' check (tone in ('card', 'brand', 'dark')),
  image_url text,
  cta_label text,
  cta_url text,
  visible boolean not null default true,
  order_index integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.programs enable row level security;

create policy "Public can view visible programs"
  on public.programs
  for select
  using (visible = true and status = 'published');

create table if not exists public.scholarships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  funder text not null,
  description text not null,
  amount text not null,
  deadline date not null,
  eligibility text not null,
  application_url text,
  created_at timestamptz not null default now()
);

alter table public.scholarships enable row level security;

create policy "Public can view scholarships"
  on public.scholarships
  for select
  using (true);


-- ==============================================================================
-- 5. LEADERSHIP & SPONSORS
-- ==============================================================================

create table if not exists public.leaders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  portrait_url text,
  term_start text,
  term_end text,
  visible boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.leaders enable row level security;

create policy "Public can view active leaders"
  on public.leaders
  for select
  using (visible = true);

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  website_url text,
  logo_url text not null,
  order_index integer not null default 0,
  confirmed boolean not null default true,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.sponsors enable row level security;

create policy "Public can view visible sponsors"
  on public.sponsors
  for select
  using (visible = true and confirmed = true);


-- ==============================================================================
-- 6. AUDIT LOGS
-- ==============================================================================

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  action text not null,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;


-- ==============================================================================
-- 7. SUPABASE STORAGE BUCKETS (FOR PAST QUESTIONS & FLIERS)
-- ==============================================================================

-- Create buckets for academic resources (PDFs) and media
insert into storage.buckets (id, name, public)
values 
  ('academic-resources', 'academic-resources', true),
  ('media', 'media', true)
on conflict (id) do update set public = true;

-- Policy: Anyone can download/read files in public buckets
create policy "Public can view files in academic-resources"
  on storage.objects for select
  using (bucket_id = 'academic-resources');

create policy "Public can view files in media"
  on storage.objects for select
  using (bucket_id = 'media');
