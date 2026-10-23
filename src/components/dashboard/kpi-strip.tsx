import { MetricCard } from "./metric-card";

export function KpiStrip({
  totals,
}: {
  totals: {
    sessions: number;
    sessionsPrev: number;
    leads: number;
    leadsPrev: number;
    calls: number;
    callsPrev: number;
    spend: number;
    spendPrev: number;
  };
}) {
  const cpl = totals.leads ? totals.spend / totals.leads : 0;
  const cplPrev = totals.leadsPrev ? totals.spendPrev / totals.leadsPrev : 0;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <MetricCard label="Sessions" value={totals.sessions} previous={totals.sessionsPrev} />
      <MetricCard label="Leads" value={totals.leads} previous={totals.leadsPrev} />
      <MetricCard label="Calls" value={totals.calls} previous={totals.callsPrev} />
      <MetricCard label="Media Spend" value={totals.spend} previous={totals.spendPrev} format="currency" />
      <MetricCard label="Cost / Lead" value={cpl} previous={cplPrev} format="currency" invert />
    </div>
  );
}
