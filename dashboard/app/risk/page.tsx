import Link from "next/link";

import { RiskBar } from "@/components/charts";
import { getRiskRanking, getSummary } from "@/lib/data";

export default async function RiskPage() {
  const [risk, summary] = await Promise.all([getRiskRanking(), getSummary()]);
  const topRisk = risk.slice(0, 10);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Risk &amp; action</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Cities ranked by the share of observed AQI days rated &ldquo;Poor&rdquo;
          or worse, with recommended actions. Worst city:{" "}
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {summary.worst_city}
          </span>{" "}
          ({summary.worst_city_pct}%).
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <RiskBar
          data={[...topRisk].sort((a, b) => a.poor_or_worse_pct - b.poor_or_worse_pct)}
        />
      </section>

      <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100 text-left dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Avg AQI</th>
              <th className="px-4 py-3 font-medium">Poor-or-worse</th>
              <th className="px-4 py-3 font-medium">Dominant pollutant</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {topRisk.map((row, i) => (
              <tr
                key={row.city}
                className="border-t border-zinc-200 dark:border-zinc-800"
              >
                <td className="px-4 py-3 text-zinc-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{row.city}</td>
                <td className="px-4 py-3">{row.average_aqi.toFixed(1)}</td>
                <td className="px-4 py-3">
                  {row.poor_or_worse_pct}% ({row.poor_or_worse_days}/
                  {row.observed_days} days)
                </td>
                <td className="px-4 py-3 uppercase">{row.dominant_pollutant}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/city/${encodeURIComponent(row.city)}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">Recommended actions</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              Prioritise the top-ranked cities first — they face the most frequent
              exposure, not isolated spikes.
            </li>
            <li>
              Match interventions to each city&rsquo;s dominant pollutant, since the
              driver (e.g. dust vs vehicle emissions) differs by city.
            </li>
            <li>
              Schedule pre-season advisories ahead of the highest-AQI months shown
              in the monthly trend.
            </li>
            <li>
              Use the risk ranking to allocate monitoring and mitigation resources
              transparently.
            </li>
          </ul>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">Limitations</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            This analysis describes associations in monitoring data and does not
            establish causality. City coverage and station aggregation differ across
            cities, and missing observations were median-filled. These rankings are
            decision inputs, not a substitute for official public-health guidance.
          </p>
        </div>
      </section>
    </div>
  );
}