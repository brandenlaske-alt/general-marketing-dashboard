"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { LOCATIONS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

const CatchmentMap = dynamic(() => import("./dashboard/catchment-map").then((m) => m.CatchmentMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[560px] w-full items-center justify-center rounded-lg border bg-muted/5 text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

export function CatchmentMapPicker() {
  const [slug, setSlug] = useState(LOCATIONS[0].slug);
  const [stats, setStats] = useState<{ totalLeads: number; topZips: Array<{ zip: string; leads: number }> }>({ totalLeads: 0, topZips: [] });
  const location = useMemo(() => LOCATIONS.find((l) => l.slug === slug)!, [slug]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <label className="block">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Location</div>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="rounded-md border bg-card px-3 py-2 text-sm"
          >
            {LOCATIONS.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.name} — {l.city}, {l.state}
              </option>
            ))}
          </select>
        </label>
        <div className="ml-auto text-right">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Total leads in area</div>
          <div className="text-2xl font-semibold">{formatNumber(stats.totalLeads)}</div>
        </div>
      </div>

      <CatchmentMap location={location} onLeadStats={setStats} />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Top ZIPs by lead volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.topZips.map((h) => (
              <div key={h.zip} className="flex items-center justify-between border-b py-1.5 text-sm last:border-b-0">
                <span className="font-mono text-xs text-muted-foreground">{h.zip}</span>
                <span className="font-medium">{h.leads}</span>
              </div>
            ))}
            {stats.topZips.length === 0 && (
              <div className="col-span-full py-4 text-center text-sm text-muted-foreground">Loading…</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
