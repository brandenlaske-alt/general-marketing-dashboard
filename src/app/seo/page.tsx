import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { portfolioTrend } from "@/lib/mock-data";

export default function SeoPage() {
  const trend = portfolioTrend();
  const organic = trend.map((p) => ({ ...p, value: Math.round(p.value * 0.42) }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">SEO</h1>
        <p className="text-sm text-muted-foreground">
          Organic traffic health across the portfolio. Replace mock data with a real SEMrush/Ahrefs/GSC connector in <code>src/lib/</code>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Organic sessions" value={organic.reduce((s, p) => s + p.value, 0)} previous={Math.round(organic.reduce((s, p) => s + p.value, 0) * 0.9)} />
        <MetricCard label="Avg position" value={14.2} previous={16.1} invert />
        <MetricCard label="Keywords ranking" value={1842} previous={1611} />
        <MetricCard label="Backlinks" value={3214} previous={3088} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organic sessions · last 90 days</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={organic} label="Organic" />
        </CardContent>
      </Card>
    </div>
  );
}
