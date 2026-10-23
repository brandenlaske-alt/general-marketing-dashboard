import type { Location, LocationMetrics, CallsByCategory, BudgetLine, ChannelPerformance, KeywordRanking, ZipHotspot } from "./types";

// Fictional locations — any resemblance to real places is coincidental.
export const LOCATIONS: Location[] = [
  { slug: "aurora-heights", name: "Aurora Heights", city: "Boulder", state: "CO", region: "Mountain West", brand: "Premium", lat: 40.0150, lon: -105.2705 },
  { slug: "bayview-commons", name: "Bayview Commons", city: "Oakland", state: "CA", region: "West Coast", brand: "Enterprise", lat: 37.8044, lon: -122.2712 },
  { slug: "cedar-ridge", name: "Cedar Ridge", city: "Portland", state: "OR", region: "West Coast", brand: "Standard", lat: 45.5152, lon: -122.6784 },
  { slug: "driftwood-grove", name: "Driftwood Grove", city: "Charleston", state: "SC", region: "Southeast", brand: "Premium", lat: 32.7765, lon: -79.9311 },
  { slug: "elmwood-landing", name: "Elmwood Landing", city: "Durham", state: "NC", region: "Southeast", brand: "Standard", lat: 35.9940, lon: -78.8986 },
  { slug: "fairview-terrace", name: "Fairview Terrace", city: "Austin", state: "TX", region: "South Central", brand: "Premium", lat: 30.2672, lon: -97.7431 },
  { slug: "greenbrier-park", name: "Greenbrier Park", city: "Nashville", state: "TN", region: "Southeast", brand: "Standard", lat: 36.1627, lon: -86.7816 },
  { slug: "harbor-pointe", name: "Harbor Pointe", city: "Seattle", state: "WA", region: "West Coast", brand: "Enterprise", lat: 47.6062, lon: -122.3321 },
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

// Per-location paid-media channel breakdown
const CHANNEL_WEIGHTS: Record<ChannelPerformance["channel"], { spend: number; cpl: number; ctr: number }> = {
  "Google Search":         { spend: 0.42, cpl: 42, ctr: 0.052 },
  "Meta":                  { spend: 0.22, cpl: 68, ctr: 0.018 },
  "YouTube / OTT":         { spend: 0.14, cpl: 110, ctr: 0.004 },
  "Programmatic Display":  { spend: 0.10, cpl: 140, ctr: 0.003 },
  "Microsoft":             { spend: 0.08, cpl: 58, ctr: 0.041 },
  "TikTok":                { spend: 0.04, cpl: 85, ctr: 0.012 },
};

export function channelBreakdown(slug: string): ChannelPerformance[] {
  const m = metricsBySlug(slug);
  if (!m) return [];
  const rand = seedRandom((slug.charCodeAt(0) + slug.length) * 11);
  return (Object.keys(CHANNEL_WEIGHTS) as ChannelPerformance["channel"][]).map((channel) => {
    const w = CHANNEL_WEIGHTS[channel];
    const jitter = 0.85 + rand() * 0.3;
    const spend = Math.round(m.spend * w.spend * jitter);
    const spendPrev = Math.round(spend * (0.85 + rand() * 0.25));
    const leads = Math.max(1, Math.round(spend / (w.cpl * (0.9 + rand() * 0.2))));
    const leadsPrev = Math.max(1, Math.round(spendPrev / (w.cpl * (0.9 + rand() * 0.25))));
    const clicks = Math.max(leads * 8, Math.round(spend / 2.1 / (0.85 + rand() * 0.3)));
    const impressions = Math.round(clicks / Math.max(0.0015, w.ctr * (0.85 + rand() * 0.3)));
    return { channel, spend, spendPrev, impressions, clicks, leads, leadsPrev };
  });
}

// Per-location SEO keyword rankings
const SEO_TEMPLATES: Array<{ pattern: string; intent: KeywordRanking["intent"]; volMult: number; posBase: number }> = [
  { pattern: "{{brand}} {{city}}",                   intent: "Brand",         volMult: 1.4, posBase: 2 },
  { pattern: "{{name}}",                             intent: "Brand",         volMult: 0.9, posBase: 1 },
  { pattern: "best {{brand}} services in {{city}}",  intent: "Local",         volMult: 1.1, posBase: 6 },
  { pattern: "{{city}} {{brand}} reviews",           intent: "Local",         volMult: 0.8, posBase: 8 },
  { pattern: "{{brand}} near me",                    intent: "Local",         volMult: 2.2, posBase: 12 },
  { pattern: "{{brand}} pricing {{state}}",          intent: "Commercial",    volMult: 0.7, posBase: 14 },
  { pattern: "how to choose a {{brand}}",            intent: "Informational", volMult: 0.6, posBase: 22 },
  { pattern: "{{brand}} checklist",                  intent: "Informational", volMult: 0.5, posBase: 18 },
  { pattern: "{{brand}} vs alternatives",            intent: "Commercial",    volMult: 0.6, posBase: 16 },
  { pattern: "cost of {{brand}} in {{city}}",        intent: "Commercial",    volMult: 0.9, posBase: 10 },
  { pattern: "{{brand}} tour {{city}}",              intent: "Local",         volMult: 0.4, posBase: 5 },
  { pattern: "what to expect from a {{brand}}",      intent: "Informational", volMult: 0.5, posBase: 24 },
];

export function keywordRankings(slug: string): KeywordRanking[] {
  const loc = locationBySlug(slug);
  if (!loc) return [];
  const rand = seedRandom((slug.length + 7) * 17);
  return SEO_TEMPLATES.map((t) => {
    const keyword = t.pattern
      .replace("{{brand}}", "boutique service")
      .replace("{{city}}", loc.city.toLowerCase())
      .replace("{{state}}", loc.state.toLowerCase())
      .replace("{{name}}", loc.name.toLowerCase());
    const position = Math.max(1, Math.round(t.posBase + (rand() - 0.5) * 6));
    const positionPrev = Math.max(1, Math.round(position + (rand() - 0.4) * 8));
    const volume = Math.round((80 + rand() * 2200) * t.volMult);
    return { keyword, intent: t.intent, position, positionPrev, volume, url: `/${loc.slug}` };
  });
}

// Catchment ZIP hotspots around a location
export function catchmentHotspots(slug: string, radiusMi = 60, count = 18): ZipHotspot[] {
  const loc = locationBySlug(slug);
  if (!loc) return [];
  const rand = seedRandom(slug.length * 31 + 7);
  const miDeg = 1 / 69; // ~1 degree lat ≈ 69mi
  const out: ZipHotspot[] = [];
  for (let i = 0; i < count; i++) {
    const r = radiusMi * Math.sqrt(rand()); // uniform area
    const theta = rand() * Math.PI * 2;
    const lat = loc.lat + Math.cos(theta) * r * miDeg;
    const lon = loc.lon + Math.sin(theta) * r * miDeg / Math.cos((loc.lat * Math.PI) / 180);
    const leads = Math.max(1, Math.round((count - i) * (0.6 + rand() * 0.8)));
    out.push({
      zip: String(10000 + Math.floor(rand() * 89999)),
      lat, lon, leads,
    });
  }
  return out.sort((a, b) => b.leads - a.leads);
}
