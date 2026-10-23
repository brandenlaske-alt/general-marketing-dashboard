export type Location = {
  slug: string;
  name: string;
  city: string;
  state: string;
  region: string;
  brand: "Standard" | "Premium" | "Enterprise";
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
