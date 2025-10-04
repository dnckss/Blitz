-- Run this in Supabase SQL editor

create table if not exists war_events_normalized (
  id bigserial primary key,
  occurred_at timestamptz not null,
  lat double precision not null,
  lon double precision not null,
  country text,
  headline text,
  source_url text,
  severity smallint default 0,
  topics text[] default '{}'
);

create index if not exists idx_events_time on war_events_normalized (occurred_at desc);
create index if not exists idx_events_geo on war_events_normalized using gist (ll_to_earth(lat, lon));

create table if not exists commodity_prices (
  id bigserial primary key,
  symbol text not null,
  ts timestamptz not null,
  open numeric,
  high numeric,
  low numeric,
  close numeric,
  provider text,
  quality_flag text
);
create index if not exists idx_prices_symbol_ts on commodity_prices (symbol, ts desc);

create table if not exists ai_summaries (
  id bigserial primary key,
  period_start timestamptz,
  period_end timestamptz,
  summary jsonb,
  sources jsonb
);

-- Community
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  display_name text,
  created_at timestamptz default now()
);

create table if not exists posts (
  id bigserial primary key,
  user_id uuid references profiles(id) on delete set null,
  title text not null,
  body text not null,
  tags text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists comments (
  id bigserial primary key,
  post_id bigint references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  body text not null,
  created_at timestamptz default now()
);
