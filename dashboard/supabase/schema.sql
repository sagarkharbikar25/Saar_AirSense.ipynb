-- AirSense Supabase schema
-- Run this in the Supabase SQL editor, then load data from ../data/processed/*.csv
-- into each table (Supabase Dashboard > Table Editor > Import data from CSV).

create table if not exists public.city_risk (
  city text primary key,
  average_aqi double precision,
  observed_days integer,
  poor_or_worse_days integer,
  poor_or_worse_pct double precision,
  dominant_pollutant text
);

create table if not exists public.monthly_trend (
  month_start date primary key,
  aqi double precision
);

create table if not exists public.pollutant_summary (
  pollutant text primary key,
  mean_value double precision
);

create table if not exists public.city_monthly_trend (
  city text,
  month_start text,
  aqi double precision,
  primary key (city, month_start)
);

create table if not exists public.city_pollutants (
  city text primary key,
  pm2_5 double precision,
  pm10 double precision,
  no2 double precision,
  so2 double precision,
  co double precision,
  o3 double precision
);

create table if not exists public.summary (
  id int generated always as identity primary key,
  national_avg_aqi double precision,
  total_cities integer,
  total_days integer,
  poor_or_worse_pct double precision,
  worst_city text,
  worst_city_pct double precision
);

alter table public.city_risk enable row level security;
alter table public.monthly_trend enable row level security;
alter table public.pollutant_summary enable row level security;
alter table public.city_monthly_trend enable row level security;
alter table public.city_pollutants enable row level security;
alter table public.summary enable row level security;

create policy "public read city_risk" on public.city_risk for select using (true);
create policy "public read monthly_trend" on public.monthly_trend for select using (true);
create policy "public read pollutant_summary" on public.pollutant_summary for select using (true);
create policy "public read city_monthly_trend" on public.city_monthly_trend for select using (true);
create policy "public read city_pollutants" on public.city_pollutants for select using (true);
create policy "public read summary" on public.summary for select using (true);