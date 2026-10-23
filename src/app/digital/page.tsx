import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { portfolioTotals, portfolioTrend } from "@/lib/mock-data";

export default function DigitalPage() {
  const totals = portfolioTotals();
  const ctr = 0.038;
  const ctrPrev = 0.034;
  const roas = 3.6;
  const roasPrev = 3.1;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Digital performance</h1>
        <p className="text-sm text-muted-foreground">
          Blended paid-media view — swap in real connectors (Google Ads, Meta, programmatic) via the <code>src/lib/</code> layer.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Media Spend" value={totals.spend} previous={totals.spendPrev} format="currency" />
        <MetricCard label="Clicks" value={Math.round(totals.sessions * 1.4)} previous={Math.round(totals.sessionsPrev * 1.35)} />
        <MetricCard label="CTR" value={ctr} previous={ctrPrev} format="percent" />
        <MetricCard label="ROAS" value={roas} previous={roasPrev} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio sessions · last 90 days</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={portfolioTrend()} label="Sessions" />
        </CardContent>
      </Card>
    </div>
  );
}
