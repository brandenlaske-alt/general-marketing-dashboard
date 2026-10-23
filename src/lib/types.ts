export type Location = {
  slug: string;
  name: string;
  city: string;
  state: string;
  region: string;
  brand: "Standard" | "Premium" | "Enterprise";
  lat: number;
  lon: number;
};

export type ChannelPerformance = {
  channel: "Google Search" | "Meta" | "YouTube / OTT" | "Programmatic Display" | "Microsoft" | "TikTok";
  spend: number;
  spendPrev: number;
  impressions: number;
  clicks: number;
  leads: number;
  leadsPrev: number;
};

export type KeywordRanking = {
  keyword: string;
  intent: "Brand" | "Local" | "Commercial" | "Informational";
  position: number;
  positionPrev: number;
  volume: number;
  url: string;
};

export type ZipHotspot = {
  zip: string;
  lat: number;
  lon: number;
  leads: number;
  city?: string;
};

export type MetricPoint = {
  date: string;
  value: number;
};

export type LocationMetrics = {
  slug: string;
  sessions: number;
  sessionsPrev: number;
  leads: number;
  leadsPrev: number;
  calls: number;
  callsPrev: number;
  spend: number;
  spendPrev: number;
  trend: MetricPoint[];
};

export type CallsByCategory = {
  category: string;
  count: number;
};

export type BudgetLine = {
  id: string;
  channel: string;
  monthlyBudget: number;
  mtdSpend: number;
};
