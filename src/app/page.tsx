import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { LocationsTable } from "@/components/dashboard/locations-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioTotals, portfolioTrend } from "@/lib/mock-data";

export default function OverviewPage() {
  const totals = portfolioTotals();
  const trend = portfolioTrend();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Portfolio overview</h1>
        <p className="text-sm text-muted-foreground">
          Rolling 90-day performance across all locations. All numbers are mock data for template purposes.
        </p>
      </div>

      <KpiStrip totals={totals} />

      <Card>
        <CardHeader>
          <CardTitle>Portfolio sessions · last 90 days</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={trend} label="Sessions" />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Locations</h2>
        <LocationsTable />
      </div>
    </div>
  );
}
