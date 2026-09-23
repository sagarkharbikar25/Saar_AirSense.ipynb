"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MonthlyPoint, PollutantMean, RiskRow } from "@/lib/data";

export function TrendLine({ data }: { data: MonthlyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month_start" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="aqi" stroke="#2563eb" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PollutantBar({ data }: { data: PollutantMean[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="pollutant" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="mean_value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RiskBar({
  data,
  title,
}: {
  data: RiskRow[];
  title?: string;
}) {
  return (
    <div>
      {title ? <h3 className="mb-2 text-base font-semibold">{title}</h3> : null}
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="city"
            width={110}
            tick={{ fontSize: 12 }}
            orientation="left"
          />
          <Tooltip />
          <Bar dataKey="poor_or_worse_pct" fill="#dc2626" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}