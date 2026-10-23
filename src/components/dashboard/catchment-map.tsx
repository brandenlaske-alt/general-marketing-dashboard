"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type L from "leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Location } from "@/lib/types";
import { catchmentCountsForZips } from "@/lib/mock-data";

type ZipProps = { zip: string; state: string };

/** Fit viewport to a bounding box around the location. */
function FitToLocation({ location, radiusDeg = 0.45 }: { location: Location; radiusDeg?: number }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(
      [
        [location.lat - radiusDeg, location.lon - radiusDeg],
        [location.lat + radiusDeg, location.lon + radiusDeg],
      ],
      { padding: [20, 20] },
    );
  }, [location, radiusDeg, map]);
  return null;
}

export function CatchmentMap({
  location,
  onLeadStats,
}: {
  location: Location;
  onLeadStats?: (stats: { totalLeads: number; topZips: Array<{ zip: string; leads: number }> }) => void;
}) {
  const [zctas, setZctas] = useState<FeatureCollection<Geometry, ZipProps> | null>(null);

  useEffect(() => {
    fetch("/zctas.geojson")
      .then((r) => r.json())
      .then((d: FeatureCollection<Geometry, ZipProps>) => setZctas(d))
      .catch(() => setZctas(null));
  }, []);

  // Filter ZCTAs to those within ~0.5deg of the current location
  const nearbyFeatures = useMemo(() => {
    if (!zctas) return [] as Feature<Geometry, ZipProps>[];
    const radius = 0.55;
    const walk = (coords: unknown, found: [number, number]): [number, number] | null => {
      if (!Array.isArray(coords)) return null;
      if (typeof coords[0] === "number" && typeof coords[1] === "number") {
        return coords as [number, number];
      }
      for (const c of coords) {
        const pt = walk(c, found);
        if (pt) return pt;
      }
      return null;
    };
    return zctas.features.filter((f) => {
      const geom = f.geometry as { coordinates?: unknown } | null;
      if (!geom || !("coordinates" in geom)) return false;
      const sample = walk(geom.coordinates, [0, 0]);
      if (!sample) return false;
      const [x, y] = sample;
      return Math.abs(y - location.lat) <= radius && Math.abs(x - location.lon) <= radius;
    });
  }, [zctas, location]);

  const leadCounts = useMemo(() => {
    const zips = nearbyFeatures.map((f) => f.properties.zip);
    return catchmentCountsForZips(location.slug, zips);
  }, [nearbyFeatures, location.slug]);

  const maxLeads = useMemo(() => Math.max(1, ...Array.from(leadCounts.values())), [leadCounts]);
  const totalLeads = useMemo(() => Array.from(leadCounts.values()).reduce((s, v) => s + v, 0), [leadCounts]);

  useEffect(() => {
    if (!onLeadStats) return;
    const topZips = Array.from(leadCounts.entries())
      .map(([zip, leads]) => ({ zip, leads }))
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 24);
    onLeadStats({ totalLeads, topZips });
  }, [leadCounts, totalLeads, onLeadStats]);

  const styleFeature = (feature: Feature<Geometry, ZipProps> | undefined) => {
    if (!feature) return {};
    const leads = leadCounts.get(feature.properties.zip) ?? 0;
    const intensity = leads / maxLeads;
    const fillOpacity = leads > 0 ? 0.15 + 0.55 * intensity : 0;
    return {
      color: "#9ca3af",
      weight: 0.4,
      fillColor: "#2563eb",
      fillOpacity,
    };
  };

  const onEachFeature = (feature: Feature<Geometry, ZipProps>, layer: L.Layer) => {
    const zip = feature.properties.zip;
    const leads = leadCounts.get(zip) ?? 0;
    (layer as unknown as { bindTooltip: (s: string, opts?: object) => void }).bindTooltip(
      `<div style="font-size:11px;line-height:1.4;font-family:system-ui">
        <strong>ZIP ${zip}</strong><br/>
        <span style="color:#1e40af">${leads} leads (90d)</span>
      </div>`,
      { sticky: true },
    );
  };

  const asFC: FeatureCollection<Geometry, ZipProps> = useMemo(
    () => ({ type: "FeatureCollection", features: nearbyFeatures }),
    [nearbyFeatures],
  );

  const geoJsonKey = `${location.slug}-${nearbyFeatures.length}`;

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-lg border">
      <MapContainer
        center={[location.lat, location.lon]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        {/* Esri Light Gray Canvas basemap — clean neutral surface for data overlays */}
        <TileLayer
          key="esri-light-base"
          attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
        />
        <TileLayer
          key="esri-light-labels"
          attribution=""
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
          opacity={0.9}
        />
        {nearbyFeatures.length > 0 && (
          <GeoJSON
            key={geoJsonKey}
            data={asFC}
            style={styleFeature as unknown as L.PathOptions}
            onEachFeature={onEachFeature}
          />
        )}
        <CircleMarker
          center={[location.lat, location.lon]}
          radius={7}
          pathOptions={{ color: "#065f46", fillColor: "#10b981", fillOpacity: 1, weight: 2 }}
        >
          <Popup>
            <strong>{location.name}</strong>
            <br />
            {location.city}, {location.state}
          </Popup>
        </CircleMarker>
        <FitToLocation location={location} />
      </MapContainer>

      {/* Loading state */}
      {!zctas && (
        <div className="absolute inset-0 z-[400] flex items-center justify-center bg-white/60 text-sm text-muted-foreground">
          Loading ZIP boundaries…
        </div>
      )}

      {/* Legend */}
      <div className="absolute right-3 top-3 z-[400] rounded border bg-white/95 p-3 shadow-md">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Leads per ZIP (90d)
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-3 w-3" style={{ background: "#2563eb", opacity: 0.15 }} />
          <span className="text-muted-foreground">Low</span>
          <span
            className="mx-1 h-3 w-6 rounded-sm"
            style={{
              background: "linear-gradient(90deg, rgba(37,99,235,0.15), rgba(37,99,235,0.7))",
            }}
          />
          <span className="text-muted-foreground">High</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px]">
          <span className="h-3 w-3 rounded-full border-2 border-emerald-800 bg-emerald-500" />
          <span className="text-muted-foreground">Location</span>
        </div>
      </div>
    </div>
  );
}
