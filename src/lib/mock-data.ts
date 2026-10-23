import type { Location, LocationMetrics, CallsByCategory, BudgetLine } from "./types";

// Fictional locations — any resemblance to real places is coincidental.
export const LOCATIONS: Location[] = [
  { slug: "aurora-heights", name: "Aurora Heights", city: "Boulder", state: "CO", region: "Mountain West", brand: "Premium" },
  { slug: "bayview-commons", name: "Bayview Commons", city: "Oakland", state: "CA", region: "West Coast", brand: "Enterprise" },
  { slug: "cedar-ridge", name: "Cedar Ridge", city: "Portland", state: "OR", region: "West Coast", brand: "Standard" },
  { slug: "driftwood-grove", name: "Driftwood Grove", city: "Charleston", state: "SC", region: "Southeast", brand: "Premium" },
  { slug: "elmwood-landing", name: "Elmwood Landing", city: "Durham", state: "NC", region: "Southeast", brand: "Standard" },
  { slug: "fairview-terrace", name: "Fairview Terrace", city: "Austin", state: "TX", region: "South Central", brand: "Premium" },
  { slug: "greenbrier-park", name: "Greenbrier Park", city: "Nashville", state: "TN", region: "Southeast", brand: "Standard" },
  { slug: "harbor-pointe", name: "Harbor Pointe", city: "Seattle", state: "WA", region: "West Coast", brand: "Enterprise" },
];

function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function trendline(seed: number, days = 90, base = 1000, drift = 0.4) {
  const rand = seedRandom(seed);
  const points = [];
  let v = base;
  const start = new Date();
  start.setDate(start.getDate() - days);
  for (let i = 0; i < days; i++) {
    v += (rand() - 0.5) * base * drift * 0.1;
    v = Math.max(base * 0.2, v);
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    points.push({ date: d.toISOString().slice(0, 10), value: Math.round(v) });
  }
  return points;
}

export const LOCATION_METRICS: LocationMetrics[] = LOCATIONS.map((loc, i) => {
  const seed = i * 7 + 13;
  const rand = seedRandom(seed);
  const sessions = Math.round(1500 + rand() * 6500);
  const leads = Math.round(sessions * (0.012 + rand() * 0.018));
  const calls = Math.round(leads * (0.3 + rand() * 0.5));
  const spend = Math.round(1800 + rand() * 7200);
  return {
    slug: loc.slug,
    sessions,
    sessionsPrev: Math.round(sessions * (0.82 + rand() * 0.3)),
    leads,
    leadsPrev: Math.round(leads * (0.75 + rand() * 0.4)),
    calls,
    callsPrev: Math.round(calls * (0.8 + rand() * 0.35)),
    spend,
    spendPrev: Math.round(spend * (0.85 + rand() * 0.25)),
    trend: trendline(seed, 90, sessions / 90, 0.3),
  };
});

export function portfolioTotals() {
  return LOCATION_METRICS.reduce(
    (acc, m) => {
      acc.sessions += m.sessions;
      acc.sessionsPrev += m.sessionsPrev;
      acc.leads += m.leads;
      acc.leadsPrev += m.leadsPrev;
      acc.calls += m.calls;
      acc.callsPrev += m.callsPrev;
      acc.spend += m.spend;
      acc.spendPrev += m.spendPrev;
      return acc;
    },
    { sessions: 0, sessionsPrev: 0, leads: 0, leadsPrev: 0, calls: 0, callsPrev: 0, spend: 0, spendPrev: 0 },
  );
}

export function portfolioTrend() {
  if (LOCATION_METRICS.length === 0) return [];
  const len = LOCATION_METRICS[0].trend.length;
  const out = [];
  for (let i = 0; i < len; i++) {
    const total = LOCATION_METRICS.reduce((sum, m) => sum + m.trend[i].value, 0);
    out.push({ date: LOCATION_METRICS[0].trend[i].date, value: total });
  }
  return out;
}

export const CALLS_BY_CATEGORY: CallsByCategory[] = [
  { category: "Inquiry — General", count: 142 },
  { category: "Inquiry — Pricing", count: 118 },
  { category: "Tour / Appointment", count: 87 },
  { category: "Returning Customer", count: 64 },
  { category: "Support", count: 41 },
  { category: "Vendor / Other", count: 23 },
];

export const BUDGET_LINES: BudgetLine[] = [
  { id: "paid-search", channel: "Paid Search", monthlyBudget: 24000, mtdSpend: 14820 },
  { id: "paid-social", channel: "Paid Social", monthlyBudget: 12000, mtdSpend: 8140 },
  { id: "display", channel: "Display / Retargeting", monthlyBudget: 6000, mtdSpend: 2960 },
  { id: "programmatic", channel: "Programmatic Video", monthlyBudget: 8000, mtdSpend: 4210 },
  { id: "local-seo", channel: "Local SEO (retainer)", monthlyBudget: 4500, mtdSpend: 4500 },
  { id: "content", channel: "Content Production", monthlyBudget: 3000, mtdSpend: 1240 },
];

export function locationBySlug(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}

export function metricsBySlug(slug: string): LocationMetrics | undefined {
  return LOCATION_METRICS.find((m) => m.slug === slug);
}
