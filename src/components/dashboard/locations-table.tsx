import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DeltaPill } from "./delta-pill";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { LOCATIONS, LOCATION_METRICS } from "@/lib/mock-data";

export function LocationsTable() {
  const rows = LOCATIONS.map((loc) => {
    const m = LOCATION_METRICS.find((x) => x.slug === loc.slug);
    return { loc, m };
  });

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/5">
          <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Brand</th>
            <th className="px-4 py-3 text-right font-medium">Sessions</th>
            <th className="px-4 py-3 text-right font-medium">Leads</th>
            <th className="px-4 py-3 text-right font-medium">Calls</th>
            <th className="px-4 py-3 text-right font-medium">Spend</th>
            <th className="px-4 py-3 text-right font-medium">CPL</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ loc, m }) => {
            if (!m) return null;
            const cpl = m.leads ? m.spend / m.leads : 0;
            const cplPrev = m.leadsPrev ? m.spendPrev / m.leadsPrev : 0;
            return (
              <tr key={loc.slug} className="border-t transition-colors hover:bg-muted/5">
                <td className="px-4 py-3">
                  <Link href={`/locations/${loc.slug}`} className="font-medium hover:text-primary">
                    {loc.name}
                  </Link>
                  <div className="text-[11px] text-muted-foreground">
                    {loc.city}, {loc.state}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="muted">{loc.brand}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div>{formatNumber(m.sessions)}</div>
                  <DeltaPill current={m.sessions} previous={m.sessionsPrev} className="mt-0.5" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div>{formatNumber(m.leads)}</div>
                  <DeltaPill current={m.leads} previous={m.leadsPrev} className="mt-0.5" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div>{formatNumber(m.calls)}</div>
                  <DeltaPill current={m.calls} previous={m.callsPrev} className="mt-0.5" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div>{formatCurrency(m.spend)}</div>
                  <DeltaPill current={m.spend} previous={m.spendPrev} className="mt-0.5" invert />
                </td>
                <td className="px-4 py-3 text-right">
                  <div>{formatCurrency(cpl)}</div>
                  <DeltaPill current={cpl} previous={cplPrev} className="mt-0.5" invert />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
