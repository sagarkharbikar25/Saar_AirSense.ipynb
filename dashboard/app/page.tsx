import Link from "next/link";

import { TrendLine, PollutantBar, RiskBar } from "@/components/charts";
import {
  getCities,
  getMonthlyTrend,
  getPollutantSummary,
  getRiskRanking,
  getSummary,
} from "@/lib/data";

export default async function OverviewPage() {
  const [summary, risk, monthly, pollutants, cities] = await Promise.all([
    getSummary(),
    getRiskRanking(),
    getMonthlyTrend(),
    getPollutantSummary(),
    Promise.resolve(getCities()),
  ]);

  const topRisk = risk.slice(0, 10);

  const kpis = [
    { label: "National avg AQI", value: summary.national_avg_aqi, suffix: "" },
    { label: "Cities monitored", value: summary.total_cities, suffix: "" },
    { label: "City-days analysed", value: summary.total_days, suffix: "" },
    { label: "Days Poor or worse", value: summary.poor_or_worse_pct, suffix: "%" },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">National overview</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Key performance indicators computed from the cleaned city-day AQI
          dataset (2015–2020, {summary.total_cities} cities).
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="text-sm text-zinc-500">{kpi.label}</div>
            <div className="mt-2 text-3xl font-bold tracking-tight">
              {typeof kpi.value === "number" ? kpi.value.toLocaleString() : kpi.value}
              {kpi.suffix}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Month-over-month national AQI</h2>
        <div className="mt-4">
          <TrendLine data={monthly} />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Average pollutant levels</h2>
        <div className="mt-4">
          <PollutantBar data={pollutants} />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Top 10 highest-risk cities</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Ranked by the share of observed days rated &ldquo;Poor&rdquo; or worse
          (AQI ≥ 201).
        </p>
        <div className="mt-4">
          <RiskBar data={[ ...topRisk ].sort((a, b) => a.poor_or_worse_pct - b.poor_or_worse_pct)} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">City drill-down</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {cities.map((city) => (
            <Link
              key={city}
              href={`/city/${encodeURIComponent(city)}`}
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-300 dark:hover:text-zinc-50"
            >
              {city}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}