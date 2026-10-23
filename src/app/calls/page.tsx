import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { CallsCategoryChart } from "@/components/dashboard/calls-category-chart";
import { portfolioTotals, CALLS_BY_CATEGORY } from "@/lib/mock-data";

export default function CallsPage() {
  const totals = portfolioTotals();
  const answered = Math.round(totals.calls * 0.78);
  const answeredPrev = Math.round(totals.callsPrev * 0.75);
  const avgDuration = 184;
  const avgDurationPrev = 171;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Call tracking</h1>
        <p className="text-sm text-muted-foreground">
          Inbound call volume and category mix — plug a real call-tracking provider into <code>src/lib/</code>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total calls" value={totals.calls} previous={totals.callsPrev} />
        <MetricCard label="Answered" value={answered} previous={answeredPrev} />
        <MetricCard label="Answer rate" value={answered / Math.max(1, totals.calls)} previous={answeredPrev / Math.max(1, totals.callsPrev)} format="percent" />
        <MetricCard label="Avg duration (s)" value={avgDuration} previous={avgDurationPrev} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calls by category · last 30 days</CardTitle>
        </CardHeader>
        <CardContent>
          <CallsCategoryChart data={CALLS_BY_CATEGORY} />
        </CardContent>
      </Card>
    </div>
  );
}
