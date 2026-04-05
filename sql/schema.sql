create table if not exists sources (
  id text primary key,
  name text not null,
  trust_score numeric not null default 0.50,
  failure_rate numeric not null default 0.00,
  duplicate_noise numeric not null default 0.00,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists listings (
  id text primary key,
  canonical_key text not null,
  canonical_url text not null,

  title text,
  neighborhood text,
  market text,
  lat double precision,
  lng double precision,

  entire_place boolean,
  furnished_status text not null,
  kitchen boolean,

  bedrooms double precision,
  bathrooms double precision,

  pet_policy text not null,

  monthly_rent integer,
  cleaning_fee integer,
  service_fee integer,
  broker_fee integer,
  deposit integer,

  min_stay_days integer,
  available_from date,
  available_to date,

  verification_status text not null,
  last_verified_at timestamptz,
  duplicate_cluster_id text,

  score double precision,
  confidence double precision,

  risks jsonb not null default '[]'::jsonb,
  source_ids jsonb not null default '[]'::jsonb,
  source_urls jsonb not null default '[]'::jsonb,
  raw_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists shortlist (
  id text primary key,
  listing_id text not null references listings(id) on delete cascade,
  state text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
