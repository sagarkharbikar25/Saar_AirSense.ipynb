# AirSense Dashboard

Interactive AQI and public-health dashboard for Indian cities, built with Next.js (App Router), TypeScript, Tailwind CSS, Recharts, and Supabase.

## Pages

- `/` — National overview: KPI cards (avg AQI, cities monitored, city-days, share of Poor-or-worse days) plus monthly trend, pollutant levels, top-risk chart, and links to every city.
- `/city/[name]` — City drill-down: average AQI, severity %, dominant pollutant, monthly AQI trend, and pollutant profile table.
- `/risk` — Risk & Action: ranked risk table with recommended actions and limitations.

## Data flow

- The analysis notebook (`analysis/Sagar_AirSense.ipynb`) exports cleaned tables to `data/processed/`.
- `lib/data.ts` loads real data. When `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are present it queries Supabase; otherwise it reads the JSON exports in `lib/data/` so the dashboard runs with zero configuration.

## Supabase setup (optional)

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Import the matching CSVs from `../data/processed/` into each table (Table Editor → Import data from CSV).
3. Create `.env.local` from the repo's `.env.example`.

## Run locally

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```powershell
npm run build
npm start
```