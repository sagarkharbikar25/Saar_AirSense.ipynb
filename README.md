# AirSense

AirSense is an AQI and public-health business intelligence project for Indian cities. It turns station-level air-quality observations into decision-ready KPIs, trends, risk rankings, recommended actions, and an interactive dashboard.

## Project question

Which Indian cities face the greatest AQI risk, when does that risk peak, which pollutants are associated with it, and what practical public-health or policy actions should follow?

## Key findings

- **National average AQI is 166 (Moderate)** across 24,850 city-days and 26 cities.
- **Worst risk:** Ahmedabad (81.9% of days Poor or worse), Delhi (65.1%), Patna (53.5%), Gurugram (51.8%), Lucknow (49.4%).
- **Dominant pollutants:** PM10 (and PM2.5 in Patna/Lucknow) drive AQI.
- **Seasonality:** AQI peaks every winter (Oct–Feb); a sharp step-down appears in early 2020.
- **Prediction model:** RandomForestRegressor — MAE 20.9, RMSE 41.0.

## Tech stack

Python (pandas, NumPy, Matplotlib, Seaborn, scikit-learn, Jupyter) for analysis; Next.js (App Router), TypeScript, Tailwind CSS, Recharts, and Supabase for the dashboard.

## Repository structure

```
analysis/
  Sagar_AirSense.ipynb      # cleaning, EDA, KPIs, prediction model, exports
  requirements.txt
data/
  DATA_SOURCE.md            # dataset link and acquisition notes
  raw/city_day.csv          # source dataset (download from Kaggle)
  processed/                # cleaned data + KPI tables (generated)
dashboard/                  # Next.js dashboard (overview, city, risk pages)
report/
  Sagar_ProjectReport.docx  # full project report
```

## Dataset

- **Name:** Air Quality Data in India
- **Source:** [Kaggle — Air Quality Data in India](https://www.kaggle.com/datasets/rohanrao/air-quality-data-in-india)
- **Expected file:** `city_day.csv`

Download the dataset from Kaggle and place `city_day.csv` in `data/raw/` before running the notebook.

## Run the analysis notebook

```powershell
cd analysis
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
python -m pip install -r requirements.txt
jupyter notebook Sagar_AirSense.ipynb
```

The notebook reads `data/raw/city_day.csv`, cleans the data, computes the five KPIs, trains the prediction model, and writes cleaned tables to `data/processed/`.

## Run the dashboard

```powershell
cd dashboard
npm install
npm run dev
```

Open http://localhost:3000. The dashboard renders real analysis data. It reads from Supabase when the credentials below are configured; otherwise it falls back to the exported JSON tables in `dashboard/lib/data/` (generated from the notebook).

### Optional: connect Supabase

1. Create a Supabase project and paste `dashboard/supabase/schema.sql` in the SQL editor.
2. Import columns from `data/processed/*.csv` into the matching tables (Table Editor → Import data from CSV).
3. Create `dashboard/.env.local` from `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Never commit or send the Supabase service-role key. The anon key is browser-safe.

## Report

The full report with methodology, KPI narratives, model summary, limitations, and recommendations is at `report/Sagar_ProjectReport.docx`.

## Limitations

The analysis describes associations in monitoring data and does not establish causality. Missing observations were median-filled, city coverage varies, and AQI conventions changed across the 2015–2020 window. Findings are decision inputs, not a substitute for official public-health guidance.