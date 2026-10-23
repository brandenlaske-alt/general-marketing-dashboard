#!/usr/bin/env node
// One-shot build script: reads per-state ZCTA GeoJSON from /tmp/zcta/,
// filters to ZIPs within a radius box of each template location, writes
// combined output to public/zctas.geojson.
//
// Source data: https://github.com/OpenDataDE/State-zip-code-GeoJSON
import fs from "node:fs";
import path from "node:path";

const LOCATIONS = [
  { state: "co", lat: 40.0150, lon: -105.2705, slug: "aurora-heights" },
  { state: "ca", lat: 37.8044, lon: -122.2712, slug: "bayview-commons" },
  { state: "or", lat: 45.5152, lon: -122.6784, slug: "cedar-ridge" },
  { state: "sc", lat: 32.7765, lon: -79.9311, slug: "driftwood-grove" },
  { state: "nc", lat: 35.9940, lon: -78.8986, slug: "elmwood-landing" },
  { state: "tx", lat: 30.2672, lon: -97.7431, slug: "fairview-terrace" },
  { state: "tn", lat: 36.1627, lon: -86.7816, slug: "greenbrier-park" },
  { state: "wa", lat: 47.6062, lon: -122.3321, slug: "harbor-pointe" },
];

const RADIUS_DEG = 0.5; // ~35 miles
const COORD_PRECISION = 3; // ~110m — plenty for ZIP display at this zoom
const KEEP_EVERY = 3;

function roundCoord(c) {
  if (!Array.isArray(c)) return c;
  if (typeof c[0] === "number" && typeof c[1] === "number") {
    return [Number(c[0].toFixed(COORD_PRECISION)), Number(c[1].toFixed(COORD_PRECISION))];
  }
  return c.map(roundCoord);
}

/** Keep only every Nth vertex in rings — crude but effective visual simplification. */
function thinRing(ring, keepEvery = 2) {
  if (ring.length <= 6) return ring;
  const out = [];
  for (let i = 0; i < ring.length - 1; i += keepEvery) out.push(ring[i]);
  out.push(ring[ring.length - 1]); // close ring
  return out;
}

function simplifyGeometry(geom) {
  if (!geom) return geom;
  const simplifyPoly = (coords) => coords.map((ring) => thinRing(ring, KEEP_EVERY).map((pt) => [Number(pt[0].toFixed(COORD_PRECISION)), Number(pt[1].toFixed(COORD_PRECISION))]));
  if (geom.type === "Polygon") {
    return { type: "Polygon", coordinates: simplifyPoly(geom.coordinates) };
  }
  if (geom.type === "MultiPolygon") {
    return { type: "MultiPolygon", coordinates: geom.coordinates.map(simplifyPoly) };
  }
  return { ...geom, coordinates: roundCoord(geom.coordinates) };
}

function featureInBox(feature, lat, lon, radius) {
  const geom = feature.geometry;
  if (!geom) return false;
  const walk = (coords) => {
    if (!Array.isArray(coords)) return false;
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      const [x, y] = coords;
      return Math.abs(y - lat) <= radius && Math.abs(x - lon) <= radius;
    }
    for (const c of coords) if (walk(c)) return true;
    return false;
  };
  return walk(geom.coordinates);
}

const seenZips = new Set();
const outFeatures = [];

for (const loc of LOCATIONS) {
  const file = `${process.env.TEMP || "/tmp"}/zcta/${loc.state}.json`;
  if (!fs.existsSync(file)) {
    console.warn(`skip ${loc.state}: ${file} missing`);
    continue;
  }
  console.log(`reading ${loc.state} (${(fs.statSync(file).size / 1024 / 1024).toFixed(1)} MB)...`);
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const feats = raw.features || [];
  let kept = 0;
  for (const f of feats) {
    const zip = f.properties?.ZCTA5CE10 || f.properties?.ZCTA5CE20 || f.properties?.zcta || f.properties?.zip;
    if (!zip || seenZips.has(zip)) continue;
    if (featureInBox(f, loc.lat, loc.lon, RADIUS_DEG)) {
      seenZips.add(zip);
      outFeatures.push({
        type: "Feature",
        properties: { zip: String(zip), state: loc.state.toUpperCase() },
        geometry: simplifyGeometry(f.geometry),
      });
      kept++;
    }
  }
  console.log(`  kept ${kept} ZIPs near ${loc.slug}`);
}

const out = { type: "FeatureCollection", features: outFeatures };
const outPath = path.join(process.cwd(), "public", "zctas.geojson");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out));
const size = fs.statSync(outPath).size;
console.log(`\nwrote ${outFeatures.length} features (${(size / 1024 / 1024).toFixed(2)} MB) to public/zctas.geojson`);
