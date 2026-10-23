"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type L from "leaflet";
import type { Feature, FeatureCollection, Polygon } from "geojson";
import { Delaunay } from "d3-delaunay";
import type { Location, ZipHotspot } from "@/lib/types";

type ZipFeatureProps = { zip: string; leads: number };

function FitToPoints({ points }: { points: Array<{ lat: number; lon: number }> }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const lats = points.map((p) => p.lat);
    const lons = points.map((p) => p.lon);
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lons)],
        [Math.max(...lats), Math.max(...lons)],
      ],
      { padding: [40, 40] },
    );
  }, [points, map]);
  return null;
}

/** Build Voronoi polygons around each hotspot — approximates ZIP code catchments
 *  without needing a real ZCTA GeoJSON file bundled into the template. */
function buildZipPolygons(location: Location, hotspots: ZipHotspot[], paddingDeg = 1.2): FeatureCollection<Polygon, ZipFeatureProps> {
  if (hotspots.length === 0) return { type: "FeatureCollection", features: [] };

  const points: [number, number][] = hotspots.map((h) => [h.lon, h.lat]);
  const lats = points.map((p) => p[1]);
  const lons = points.map((p) => p[0]);
  const bounds: [number, number, number, number] = [
    Math.min(...lons) - paddingDeg,
    Math.min(...lats) - paddingDeg,
    Math.max(...lons) + paddingDeg,
    Math.max(...lats) + paddingDeg,
  ];

  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi(bounds);

  const features: Feature<Polygon, ZipFeatureProps>[] = [];
  hotspots.forEach((h, i) => {
    const poly = voronoi.cellPolygon(i);
    if (!poly) return;
    features.push({
      type: "Feature",
      properties: { zip: h.zip, leads: h.leads },
      geometry: {
        type: "Polygon",
        coordinates: [poly.map(([x, y]) => [x, y])],
      },
    });
  });

  return { type: "FeatureCollection", features };
}

export function CatchmentMap({
  location,
  hotspots,
}: {
  location: Location;
  hotspots: ZipHotspot[];
}) {
  const maxLeads = Math.max(1, ...hotspots.map((h) => h.leads));
  const allPoints = [{ lat: location.lat, lon: location.lon }, ...hotspots];

  const polygons = useMemo(() => buildZipPolygons(location, hotspots), [location, hotspots]);

  const styleFeature = (feature: Feature<Polygon, ZipFeatureProps> | undefined) => {
    if (!feature) return {};
    const leads = feature.properties.leads;
    const intensity = leads / maxLeads;
    return {
      color: "#1e40af",
      weight: 0.8,
      fillColor: "#2563eb",
      fillOpacity: 0.15 + 0.55 * intensity,
    };
  };

  const onEachFeature = (feature: Feature<Polygon, ZipFeatureProps>, layer: L.Layer) => {
    const { zip, leads } = feature.properties;
    (layer as unknown as { bindTooltip: (s: string, opts?: object) => void }).bindTooltip(
      `<div style="font-size:11px;line-height:1.4;font-family:system-ui">
        <strong>ZIP ${zip}</strong><br/>
        <span style="color:#1e40af">${leads} leads (90d)</span>
      </div>`,
      { sticky: true },
    );
  };

  const polygonKey = `${location.slug}-${hotspots.length}-${maxLeads}`;

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-lg border">
      <MapContainer center={[location.lat, location.lon]} zoom={9} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        {/* Esri Light Gray Canvas — clean neutral basemap for data overlays */}
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
        <GeoJSON
          key={polygonKey}
          data={polygons}
          style={styleFeature as unknown as L.PathOptions}
          onEachFeature={onEachFeature}
        />
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
        <FitToPoints points={allPoints} />
      </MapContainer>

      {/* Legend */}
      <div className="absolute right-3 top-3 z-[400] rounded border bg-white/95 p-3 shadow-md">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Leads per ZIP (90d)
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-3 w-3" style={{ background: "#2563eb", opacity: 0.15 }} />
          <span className="text-muted-foreground">Low</span>
          <span className="mx-1 h-3 w-6 rounded-sm" style={{ background: "linear-gradient(90deg, rgba(37,99,235,0.15), rgba(37,99,235,0.7))" }} />
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
