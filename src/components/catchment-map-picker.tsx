"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { LOCATIONS, catchmentHotspots } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

const CatchmentMap = dynamic(() => import("./dashboard/catchment-map").then((m) => m.CatchmentMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] w-full items-center justify-center rounded-lg border bg-muted/5 text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

export function CatchmentMapPicker() {
  const [slug, setSlug] = useState(LOCATIONS[0].slug);
  const [radius, setRadius] = useState(60);
  const location = useMemo(() => LOCATIONS.find((l) => l.slug === slug)!, [slug]);
  const hotspots = useMemo(() => catchmentHotspots(slug, radius, 18), [slug, radius]);
  const total = hotspots.reduce((s, h) => s + h.leads, 0);

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
        <label className="block">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Radius: {radius} mi
          </div>
          <input
            type="range"
            min={15}
            max={150}
            step={5}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-56"
          />
        </label>
        <div className="ml-auto text-right">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Total leads in area</div>
          <div className="text-2xl font-semibold">{formatNumber(total)}</div>
        </div>
      </div>

      <CatchmentMap location={location} hotspots={hotspots} />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Top ZIPs by lead volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {hotspots.map((h) => (
              <div key={h.zip} className="flex items-center justify-between border-b py-1.5 text-sm last:border-b-0">
                <span className="font-mono text-xs text-muted-foreground">{h.zip}</span>
                <span className="font-medium">{h.leads}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
