import Link from "next/link";
import { notFound } from "next/navigation";

import { TrendLine } from "@/components/charts";
import { getCities, getCityMonthly, getCityPollutants, getRiskRanking } from "@/lib/data";

export const dynamicParams = true;

export default async function CityPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const city = decodeURIComponent(name);
  const cities = getCities();

  const [monthly, pollutants, risk] = await Promise.all([
    getCityMonthly(city),
    getCityPollutants(),
    getRiskRanking(),
  ]);

  const cityPollutants = pollutants.find(
    (p) => p.city.toLowerCase() === city.toLowerCase()
  );
  const cityRisk = risk.find((r) => r.city.toLowerCase() === city.toLowerCase());

  if (!cities.some((c) => c.toLowerCase() === city.toLowerCase())) {
    notFound();
  }

  const pollutantRows = cityPollutants
    ? [
        { label: "PM2.5", value: cityPollutants.pm2_5 },
        { label: "PM10", value: cityPollutants.pm10 },
        { label: "NO2", value: cityPollutants.no2 },
        { label: "SO2", value: cityPollutants.so2 },
        { label: "CO", value: cityPollutants.co },
        { label: "O3", value: cityPollutants.o3 },
      ].sort((a, b) => b.value - a.value)
    : [];

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-zinc-500">
          <Link href="/" className="hover:underline">
            Overview
          </Link>{" "}
          /{" "}
          <Link href="/" className="hover:underline">
            Cities
          </Link>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{city}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Monthly average AQI and pollutant profile for {city}.
        </p>
      </section>

      {cityRisk ? (
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm text-zinc-500">Average AQI</div>
            <div className="mt-2 text-3xl font-bold">{cityRisk.average_aqi.toFixed(1)}</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm text-zinc-500">Days Poor or worse</div>
            <div className="mt-2 text-3xl font-bold">{cityRisk.poor_or_worse_pct}%</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm text-zinc-500">Dominant pollutant</div>
            <div className="mt-2 text-xl font-bold uppercase">{cityRisk.dominant_pollutant}</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm text-zinc-500">Observed days</div>
            <div className="mt-2 text-3xl font-bold">
              {cityRisk.observed_days.toLocaleString()}
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Monthly AQI trend</h2>
        <div className="mt-4">
          <TrendLine data={monthly} />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Pollutant profile</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Average measured pollutant concentrations in {city}.
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-100 text-left dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-2 font-medium">Pollutant</th>
                <th className="px-4 py-2 font-medium">Average</th>
              </tr>
            </thead>
            <tbody>
              {pollutantRows.map((row) => (
                <tr
                  key={row.label}
                  className="border-t border-zinc-200 dark:border-zinc-800"
                >
                  <td className="px-4 py-2 font-medium uppercase">{row.label}</td>
                  <td className="px-4 py-2">{row.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}