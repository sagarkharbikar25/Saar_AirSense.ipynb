# COPILOT_PLAN.md — AirSense Build Plan for VS Code Copilot

**Purpose:** This file is written to be pasted into VS Code Copilot Chat (Agent Mode) or referenced with `#file:COPILOT_PLAN.md`. It assumes the repo scaffold already exists (folders + empty files) and picks up from there — it does NOT re-create folders.

**Current state (verified):** `analysis/`, `data/raw/`, `data/processed/`, `report/`, `.env.example`, `.gitignore`, `PLAN.md`, `README.md` exist but are empty/stub. `dashboard/` does not exist yet.

**Rule for Copilot:** Work task-by-task, in order. Do not skip ahead to the dashboard before the notebook and required files are complete and working. After each task, run the "Verify" step before moving on.

---

## 0. Environment Setup (do this first, once)

### 0.1 VS Code Extensions
Install/confirm these are enabled:
- **GitHub Copilot** + **GitHub Copilot Chat**
- **Python** (Microsoft) + **Jupyter** (Microsoft)
- **ESLint** and **Prettier** (for the dashboard later)
- **Tailwind CSS IntelliSense** (for the dashboard later)

### 0.2 Python environment
```bash
cd analysis
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
pip install pandas numpy matplotlib seaborn scikit-learn jupyter kaggle
```
In VS Code: open `Sagar_AirSense.ipynb`, select this `venv` as the kernel (top-right kernel picker).

### 0.3 Kaggle API (for dataset download)
```bash
pip install kaggle
# place kaggle.json (from kaggle.com/settings -> API -> Create New Token) at:
# Windows: C:\Users\<you>\.kaggle\kaggle.json
# Mac/Linux: ~/.kaggle/kaggle.json
```

### 0.4 Copilot Agent Mode setup
Open Copilot Chat → switch mode to **Agent** (not Ask/Edit) so it can read/write files and run terminal commands directly. Point it at this file with `#file:COPILOT_PLAN.md` at the start of each session so it has full context without you re-explaining.

### 0.5 Node environment (for later, dashboard phase only — skip until Task 5)
Confirm Node 18+ installed: `node -v`. Do not scaffold the Next.js app yet — that's Task 5.

---

## 1. How to Drive Copilot Through This Plan

Paste tasks into Copilot Chat **one at a time**, in Agent Mode, using this pattern:

```
#file:COPILOT_PLAN.md
Execute Task <N> only. Do not start the next task. 
When done, show me exactly what changed and run the Verify step.
```

This keeps Copilot from sprawling into unrelated files or jumping ahead (the failure mode you already hit with the scaffolding-only run).

---

## 2. Task List

### Task 1 — Download & Load Real Dataset
**Goal:** Get actual AQI data into `data/raw/`, not placeholders.

**Instructions for Copilot:**
1. Download the "Air Quality Data in India" dataset (or equivalent CPCB dataset) from Kaggle using the `kaggle` CLI into `data/raw/`.
2. Record the exact dataset name, Kaggle URL, and file(s) downloaded in `data/DATA_SOURCE.md`.
3. In `analysis/Sagar_AirSense.ipynb`, add a first cell that loads the raw CSV(s) with pandas and prints `.shape`, `.head()`, `.info()`, and `.isnull().sum()`.

**Verify:**
- `data/raw/` contains actual CSV file(s), not empty
- `data/DATA_SOURCE.md` has a real, clickable Kaggle link
- Notebook cell runs without error and prints real row/column counts

---

### Task 2 — Data Cleaning & Preparation
**Goal:** Clean, standardized dataset ready for analysis.

**Instructions for Copilot:**
1. In the notebook, handle missing values in pollutant columns (PM2.5, PM10, NO2, SO2, CO, O3) — document the strategy used (drop, interpolate, or median-fill) in a markdown cell.
2. Standardize city names (fix casing/typos/duplicates) and parse dates into proper `datetime` type.
3. Derive new columns: `AQI_Category` (Good/Moderate/Poor/Severe from AQI value), `Month`, `Season`.
4. Save the cleaned dataset to `data/processed/aqi_clean.csv`.

**Verify:**
- `data/processed/aqi_clean.csv` exists and is non-empty
- Notebook has a markdown cell explaining the cleaning decisions made
- No nulls remain in key columns (or nulls are explicitly justified)

---

### Task 3 — Exploratory Analysis & KPIs
**Goal:** Produce the 5 core KPIs and supporting charts.

**Instructions for Copilot:**
Using `data/processed/aqi_clean.csv`, compute and chart:
1. Average AQI nationally and per city (bar chart, top/bottom 10 cities)
2. % of days in "Poor" or worse category, per city
3. Dominant pollutant per city (which of PM2.5/PM10/NO2/SO2/CO is highest most often)
4. Month-over-month AQI trend (line chart, national + top 3 worst cities)
5. City risk ranking — top 10 highest-risk cities by severity %

For each KPI, add a markdown cell directly below the chart with these five labeled lines: **Fact**, **Driver**, **Risk**, **Opportunity**, **Action** — written from what the chart actually shows, not placeholder text.

**Verify:**
- All 5 KPI sections have both a chart AND a Fact/Driver/Risk/Opportunity/Action markdown cell
- Charts render inline in the notebook, properly labeled (titles, axis labels)
- Numbers cited in the markdown match what the charts show

---

### Task 4 — Optional: Prediction Model
**Goal:** (Only if Tasks 1–3 are done with time to spare.) Forecast next-period AQI.

**Instructions for Copilot:**
1. Build a simple model (RandomForestRegressor or similar) predicting AQI from pollutant levels, city, and month.
2. Split data (train/test), report MAE/RMSE.
3. Add a markdown cell summarizing model performance and limitations honestly (don't overstate accuracy).

**Verify:**
- Model trains without error
- Metrics are printed and realistic (not suspiciously perfect)
- If this task is skipped due to time, note "Prediction model: not included — analysis-only submission" in the notebook's intro cell, and update `report/Sagar_ProjectReport.docx` Section 1.2/2.3 accordingly.

---

### Task 5 — Finalize Code Deliverables
**Goal:** Lock in the two required non-dashboard files.

**Instructions for Copilot:**
1. Clean up the notebook: remove dead cells, add a title markdown cell at the top with project name, author, and one-line summary.
2. Restart kernel and "Run All" top to bottom — confirm zero errors on a clean run.
3. Generate `analysis/requirements.txt` via `pip freeze > requirements.txt` (only from this project's venv, not global).

**Verify:**
- Fresh kernel restart + Run All completes with no errors
- `requirements.txt` is non-empty and matches what's actually imported in the notebook
- File is still correctly named `Sagar_AirSense.ipynb` (do not rename)

---

### Task 6 — Dashboard (React + Next.js + Supabase)
**Goal:** Interactive bonus dashboard — build only after Tasks 1–5 are done.

**Instructions for Copilot:**
1. Scaffold: `npx create-next-app@latest dashboard --typescript --tailwind --app`
2. Set up Supabase: create a project, create a table from `data/processed/aqi_clean.csv` (or a summarized version), add `lib/supabaseClient.ts` using env vars from `.env.example`.
3. Build 3 pages:
   - `/` — Overview: national KPI cards (reuse the 5 KPIs from Task 3)
   - `/city/[name]` — City drill-down: trend chart + pollutant breakdown
   - `/risk` — Risk & Action page: ranked table + the Fact/Driver/Risk/Opportunity/Action text from the notebook
4. Deploy to Vercel, capture the live URL.

**Verify:**
- `npm run dev` runs locally with no errors
- All 3 pages render real data from Supabase, not hardcoded mock data
- Deployed Vercel URL is live and loads correctly

---

### Task 7 — Report & README
**Goal:** Fill in the placeholders in the existing report template and README.

**Instructions for Copilot:**
1. Open `report/Sagar_ProjectReport.docx` (already has the correct structure/placeholders from earlier). Replace every `[bracketed placeholder]` with real content pulled from the notebook (Sections 1–3, 5–7).
2. Take screenshots of the 3 dashboard pages, insert them into Section 4.
3. Fill in `README.md`: project overview, tech stack, dataset link (must match `data/DATA_SOURCE.md`), setup/run instructions for the notebook, and the live dashboard link.

**Verify:**
- No `[bracketed placeholder]` text remains anywhere in the `.docx`
- README dataset link is clickable and correct
- README setup instructions actually work if followed fresh (test them)

---

### Task 8 — Final QA & Submission Prep
**Goal:** Everything compliant and ready to submit.

**Instructions for Copilot:**
1. Confirm exact required file names exist at the right paths:
   - `analysis/Sagar_AirSense.ipynb`
   - `analysis/requirements.txt`
   - `report/Sagar_ProjectReport.docx`
   - `README.md`
2. Confirm dataset used is NOT the e-commerce dataset from BharatCares' own masterclasses.
3. Commit and push everything to GitHub. Confirm the repo is public (or accessible to evaluators).
4. Print a final summary: repo link, live dashboard link, and a checklist confirming all 5 deliverables (4 files + dataset link) are present.

**Verify:**
- Fresh `git clone` of the repo in a clean folder has everything needed to run the notebook
- All file names match exactly (case-sensitive)

---

## 3. Guardrails for Copilot (paste once at session start)

```
Rules for this session:
1. Follow COPILOT_PLAN.md tasks in order — do not skip ahead.
2. Do not create additional folders or rename existing required files.
3. The code deliverable must stay ONE single notebook (Sagar_AirSense.ipynb) — 
   do not split analysis into multiple .py files.
4. Never fabricate chart numbers or KPI findings — compute them from the actual 
   loaded dataset.
5. After each task, run the Verify checklist before proceeding.
6. If blocked (e.g. Kaggle auth fails), stop and report the exact error instead 
   of silently working around it with fake/sample data.
```

---

## 4. Time Checkpoint

If you're already partway through your 30-hour budget from scaffolding, re-baseline:
- Task 1–3 (data + KPIs): ~6–8 hrs — this is the core, non-negotiable
- Task 4 (prediction model): optional, skip first if short on time
- Task 5 (finalize code): ~1 hr
- Task 6 (dashboard): ~6–8 hrs — cut scope here first if time is tight, not Tasks 1–3/5/7
- Task 7 (report + README): ~3–4 hrs
- Task 8 (QA + submit): ~1–2 hrs

**If time runs critically short:** Tasks 1, 2, 3, 5, 7 (minus dashboard screenshots), and 8 are the floor — that alone is a fully compliant, submittable project without the dashboard.