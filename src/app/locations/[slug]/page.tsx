import Link from "next/link";
import { notFound } from "next/navigation";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { PpcBreakdown } from "@/components/dashboard/ppc-breakdown";
import { SeoRankingsTable } from "@/components/dashboard/seo-rankings-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { locationBySlug, metricsBySlug, LOCATIONS, channelBreakdown, keywordRankings } from "@/lib/mock-data";

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export default async function LocationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = locationBySlug(slug);
  const m = metricsBySlug(slug);
  if (!loc || !m) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/locations" className="text-xs text-muted-foreground hover:text-primary">
            ← All locations
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{loc.name}</h1>
          <p className="text-sm text-muted-foreground">
            {loc.city}, {loc.state} · {loc.region}
          </p>
        </div>
        <Badge>{loc.brand}</Badge>
      </div>

      <KpiStrip totals={{
        sessions: m.sessions, sessionsPrev: m.sessionsPrev,
        leads: m.leads, leadsPrev: m.leadsPrev,
        calls: m.calls, callsPrev: m.callsPrev,
        spend: m.spend, spendPrev: m.spendPrev,
      }} />

      <Card>
        <CardHeader>
          <CardTitle>Sessions · last 90 days</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={m.trend} label="Sessions" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paid media performance by channel</CardTitle>
        </CardHeader>
        <CardContent>
          <PpcBreakdown channels={channelBreakdown(slug)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keyword rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <SeoRankingsTable rankings={keywordRankings(slug)} />
        </CardContent>
      </Card>
    </div>
  );
}
