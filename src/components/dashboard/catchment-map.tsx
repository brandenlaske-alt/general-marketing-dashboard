"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Location, ZipHotspot } from "@/lib/types";

// Fix Leaflet default marker icon paths for Next.js bundling
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

export function CatchmentMap({
  location,
  hotspots,
}: {
  location: Location;
  hotspots: ZipHotspot[];
}) {
  const maxLeads = Math.max(1, ...hotspots.map((h) => h.leads));
  const allPoints = [{ lat: location.lat, lon: location.lon }, ...hotspots];

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-lg border">
      <MapContainer center={[location.lat, location.lon]} zoom={9} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToPoints points={allPoints} />
        <Marker position={[location.lat, location.lon]}>
          <Popup>
            <strong>{location.name}</strong>
            <br />
            {location.city}, {location.state}
          </Popup>
        </Marker>
        {hotspots.map((h) => {
          const radius = 6 + (h.leads / maxLeads) * 20;
          return (
            <CircleMarker
              key={h.zip}
              center={[h.lat, h.lon]}
              radius={radius}
              pathOptions={{
                color: "#2563eb",
                weight: 1.5,
                fillColor: "#2563eb",
                fillOpacity: 0.35,
              }}
            >
              <Popup>
                <strong>ZIP {h.zip}</strong>
                <br />
                {h.leads} leads (last 90 days)
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
