import { supabase } from "./supabaseClient";

import summaryJson from "./data/summary.json";
import riskJson from "./data/city_risk_ranking.json";
import monthlyJson from "./data/monthly_aqi_trend.json";
import pollutantJson from "./data/pollutant_summary.json";
import cityMonthlyJson from "./data/city_monthly_trend.json";
import cityPollutantsJson from "./data/city_pollutants.json";
import citiesJson from "./data/cities.json";

export type RiskRow = {
  city: string;
  average_aqi: number;
  observed_days: number;
  poor_or_worse_days: number;
  poor_or_worse_pct: number;
  dominant_pollutant: string;
};

export type MonthlyPoint = {
  month_start: string;
  aqi: number;
};

export type PollutantMean = {
  pollutant: string;
  mean_value: number;
};

export type CityMonthly = {
  city: string;
  month_start: string;
  aqi: number;
};

export type CityPollutants = {
  city: string;
  pm2_5: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
};

export type Summary = {
  national_avg_aqi: number;
  total_cities: number;
  total_days: number;
  poor_or_worse_pct: number;
  worst_city: string;
  worst_city_pct: number;
};

async function selectAll<T>(table: string, order: string): Promise<T[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(order, { ascending: false });
  if (error) {
    console.warn(`Supabase query on ${table} failed, falling back to local data.`, error.message);
    return null;
  }
  return data as T[];
}

export async function getSummary(): Promise<Summary> {
  const remote = supabase ? await selectAll<Summary>("summary", "national_avg_aqi") : null;
  if (remote && remote.length) return remote[0];
  return summaryJson as Summary;
}

export async function getRiskRanking(): Promise<RiskRow[]> {
  const remote = supabase ? await selectAll<RiskRow>("city_risk", "poor_or_worse_pct") : null;
  return (remote && remote.length ? remote : riskJson) as RiskRow[];
}

export async function getMonthlyTrend(): Promise<MonthlyPoint[]> {
  const remote = supabase ? await selectAll<MonthlyPoint>("monthly_trend", "month_start") : null;
  return (remote && remote.length ? remote : monthlyJson) as MonthlyPoint[];
}

export async function getPollutantSummary(): Promise<PollutantMean[]> {
  const remote = supabase
    ? await selectAll<PollutantMean>("pollutant_summary", "mean_value")
    : null;
  return (remote && remote.length ? remote : pollutantJson) as PollutantMean[];
}

export async function getCityMonthly(city: string): Promise<CityMonthly[]> {
  const remote = supabase ? await selectAll<CityMonthly>("city_monthly_trend", "month_start") : null;
  const points = (remote && remote.length ? remote : cityMonthlyJson) as CityMonthly[];
  return points.filter((p) => p.city.toLowerCase() === city.toLowerCase());
}

export async function getCityPollutants(): Promise<CityPollutants[]> {
  const remote = supabase ? await selectAll<CityPollutants>("city_pollutants", "city") : null;
  return (remote && remote.length ? remote : cityPollutantsJson) as CityPollutants[];
}

export function getCities(): string[] {
  return (citiesJson as string[]).slice().sort();
}