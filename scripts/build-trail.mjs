#!/usr/bin/env node
// Build-time trail pipeline. Run manually (needs network), commit the outputs:
//   node scripts/build-trail.mjs
//
// Input:  sources/lycian_08-181026.gpx — a third-party recording of the whole
//         Lycian Way (trekkingmania, 2024): one <trk> whose segments are glued
//         together out of order, no elevations, 82 waypoints.
// Output: data/trail.json  — our corridor only, cut per day, with DEM elevations
//         data/pois.json   — GPX waypoints within 3 km, OSM water within 1 km,
//                            OSM "buy water" places within 300 m of the trail
//         data/corridor.geojson — ±2 km buffer polygon used by the offline-map extract
//
// Nothing here runs in the browser; the app only reads the static JSON.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const GAP_M = 300;                 // neighbouring points further apart than this = a break
const WPT_CORRIDOR_M = 3000;       // GPX waypoints kept within this distance of our trail
const WATER_CORRIDOR_M = 1000;     // OSM springs/taps kept within this distance
const BUY_CORRIDOR_M = 300;        // OSM shops/cafés counted as "buy water" within this distance
const OFFLINE_BUFFER_M = 2000;     // offline map corridor half-width
const UA = "lycian-way-2026-trip-app/1.0 (https://jlazdes.github.io/lycian-way-2026/)";

// ---------- geometry ----------
function haversine([lon1, lat1], [lon2, lat2]) {
  const R = 6371000, r = Math.PI / 180;
  const h = Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lon2 - lon1) * r) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function cumulative(coords) {
  const out = [0];
  for (let i = 1; i < coords.length; i++) out.push(out[i - 1] + haversine(coords[i - 1], coords[i]));
  return out;
}
function nearestIndex(coords, p) {
  let best = 0, bestD = Infinity;
  coords.forEach((c, i) => { const d = haversine(c, p); if (d < bestD) { bestD = d; best = i; } });
  return { index: best, distance: bestD };
}
const round = (n, d = 5) => Math.round(n * 10 ** d) / 10 ** d;

// ---------- 1. parse + split the GPX at gaps ----------
const gpx = readFileSync(path.join(root, "sources/lycian_08-181026.gpx"), "utf8");
const pts = [...gpx.matchAll(/<trkpt lat="([-\d.]+)" lon="([-\d.]+)"/g)].map((m) => [+m[2], +m[1]]);
const segments = [[pts[0]]];
for (let i = 1; i < pts.length; i++) {
  if (haversine(pts[i - 1], pts[i]) > GAP_M) segments.push([]);
  segments.at(-1).push(pts[i]);
}
const wpts = [...gpx.matchAll(/<wpt lat="([-\d.]+)" lon="([-\d.]+)">\s*<name>([\s\S]*?)<\/name>/g)]
  .map((m) => ({ coordinates: [+m[2], +m[1]], name: m[3].trim() }));
const rawTotal = segments.reduce((s, seg) => s + cumulative(seg).at(-1), 0) +
  pts.slice(1).reduce((s, p, i) => s + (haversine(pts[i], p) > GAP_M ? haversine(pts[i], p) : 0), 0);
console.log(`GPX: ${pts.length} points, ${wpts.length} waypoints, ${segments.length} segments, raw length incl. jumps ${(rawTotal / 1000).toFixed(0)} km`);

// ---------- 2. pick our corridor: the segment passing both the Ovacık trailhead and Letoon ----------
const TRAILHEAD = [29.13937, 36.56343]; // official western start of the Lycian Way above Ölüdeniz/Ovacık
const LETOON = [29.28848, 36.33106];
let main = segments.find((s) => nearestIndex(s, TRAILHEAD).distance < 100 && nearestIndex(s, LETOON).distance < 200);
if (!main) throw new Error("Could not find the Ovacık→Xanthos segment in the GPX");
if (nearestIndex(main, TRAILHEAD).index > main.length / 2) main = [...main].reverse();
console.log(`Corridor segment: ${main.length} points, ${(cumulative(main).at(-1) / 1000).toFixed(2)} km`);

// ---------- 3. day cut points (nearest track vertex to each anchor) ----------
// Anchors: day start/finish as agreed in the itinerary. Kabak/Alınca/G-7 are
// village/camp points; the day-12 finish is the Likya Garden Life camp at the
// north-west end of Patara beach (the "our finish point" circle in the plan doc).
const DAY_CUTS = [
  { dayId: "day-2026-10-09", from: { name: "Ovacık (Lycian Way start)", at: TRAILHEAD }, to: { name: "Kabak", at: [29.12562, 36.46154] } },
  { dayId: "day-2026-10-10", from: { name: "Kabak", at: [29.12562, 36.46154] }, to: { name: "Alınca", at: [29.14362, 36.44622] } },
  { dayId: "day-2026-10-11", from: { name: "Alınca", at: [29.14362, 36.44622] }, to: { name: "Yediburunlar (G-7 camping)", at: [29.13692, 36.40154] } },
  { dayId: "day-2026-10-12", from: { name: "Yediburunlar (G-7 camping)", at: [29.13692, 36.40154] }, to: { name: "Patara beach, NW end (Likya Garden Life)", at: [29.22693, 36.33204] } },
  { dayId: "day-2026-10-13", from: { name: "Patara beach, NW end (Likya Garden Life)", at: [29.22693, 36.33204] }, to: { name: "Xanthos (Kınık)", at: main.at(-1) } },
];

// ---------- 4. elevations from Open-Meteo (Copernicus DEM 90 m) ----------
async function fetchJson(url, opts = {}, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { ...opts, headers: { "User-Agent": UA, ...(opts.headers ?? {}) } });
      if (r.ok) return await r.json();
      console.warn(`  ${r.status} from ${url.slice(0, 60)}…`);
    } catch (e) { console.warn(`  ${e.message}`); }
    await new Promise((res) => setTimeout(res, 2000 * (i + 1)));
  }
  throw new Error(`Failed: ${url.slice(0, 80)}`);
}
// Cached in sources/elevation-cache.json so re-runs don't hammer the APIs.
const cachePath = path.join(root, "sources/elevation-cache.json");
let elevCache = {};
try { elevCache = JSON.parse(readFileSync(cachePath, "utf8")); } catch {}
const key = (c) => `${c[1].toFixed(6)},${c[0].toFixed(6)}`;
const missing = main.filter((c) => elevCache[key(c)] == null);
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
let elevationSource = elevCache._source ?? null;
for (let i = 0; i < missing.length; i += 100) {
  const chunk = missing.slice(i, i + 100);
  let values = null;
  try {
    const r = await fetchJson(`https://api.opentopodata.org/v1/srtm30m?locations=${chunk.map((c) => `${c[1]},${c[0]}`).join("|")}`, {}, 3);
    if (r.status === "OK") { values = r.results.map((x) => x.elevation); elevationSource = "OpenTopoData SRTM 30 m"; }
  } catch (e) { console.warn("  OpenTopoData failed, falling back to Open-Meteo"); }
  if (!values) {
    const r = await fetchJson(`https://api.open-meteo.com/v1/elevation?latitude=${chunk.map((c) => c[1]).join(",")}&longitude=${chunk.map((c) => c[0]).join(",")}`);
    values = r.elevation; elevationSource = "Open-Meteo Elevation API (Copernicus DEM GLO-90)";
  }
  chunk.forEach((c, j) => { elevCache[key(c)] = values[j]; });
  elevCache._source = elevationSource;
  writeFileSync(cachePath, JSON.stringify(elevCache));
  console.log(`  elevations ${Math.min(i + 100, missing.length)}/${missing.length}`);
  await sleep(1200);
}
const elev = main.map((c) => elevCache[key(c)]);
const main3 = main.map((c, i) => [round(c[0], 6), round(c[1], 6), Math.round(elev[i])]);

// Ascent/descent: 3-point moving average + 8 m hysteresis so DEM noise (30 m
// cells on cliff-edge trail) doesn't inflate the totals.
function climb(coords3, threshold = 8) {
  const e = coords3.map((c) => c[2]);
  const s = e.map((_, i) => { const w = e.slice(Math.max(0, i - 1), i + 2); return w.reduce((a, b) => a + b, 0) / w.length; });
  let up = 0, down = 0, ref = s[0];
  for (const v of s) {
    if (v - ref >= threshold) { up += v - ref; ref = v; }
    else if (ref - v >= threshold) { down += ref - v; ref = v; }
  }
  return { ascentM: Math.round(up), descentM: Math.round(down) };
}

const masterCum = cumulative(main3);
const days = DAY_CUTS.map((d) => {
  const a = nearestIndex(main3, d.from.at).index;
  const b = nearestIndex(main3, d.to.at).index;
  const coords = main3.slice(a, b + 1);
  const cum = cumulative(coords);
  return {
    dayId: d.dayId,
    from: d.from.name,
    to: d.to.name,
    startKmOnTrail: round(masterCum[a] / 1000, 2),
    distanceKm: round(cum.at(-1) / 1000, 2),
    ...climb(coords),
    minEleM: Math.min(...coords.map((c) => c[2])),
    maxEleM: Math.max(...coords.map((c) => c[2])),
    coordinates: coords,
  };
});
for (const d of days) console.log(`${d.dayId}: ${d.distanceKm} km  +${d.ascentM}/-${d.descentM} m  (${d.from} → ${d.to})`);

// ---------- 5. GPX waypoints within 3 km, categorised ----------
function distToTrail(p) { return nearestIndex(main3, p).distance; }
function categorise(name) {
  const n = name.toLowerCase();
  if (/mogaz|aygaz|ipragaz/.test(n)) return "fuel";
  if (/автовокзал/.test(n)) return "transport";
  if (/старт\/финиш|развилка|тропа к/.test(n)) return "trail";
  if (/руин|ксанф|летоон|гробниц|крепост|амфитеатр|акведук|археолог/.test(n)) return "ruins";
  if (/пляж/.test(n)) return "beach";
  if (/село|город|есть всё|олюдениз/.test(n)) return "village";
  if (/кемпинг/.test(n)) return "camp";
  return "other";
}
const gpxWaypoints = wpts
  .map((w) => ({ ...w, distanceFromTrailM: Math.round(distToTrail(w.coordinates)) }))
  .filter((w) => w.distanceFromTrailM <= WPT_CORRIDOR_M)
  .map((w, i) => ({
    id: `gpx-wpt-${i + 1}`,
    name: w.name,
    category: categorise(w.name),
    coordinates: [round(w.coordinates[0], 6), round(w.coordinates[1], 6)],
    distanceFromTrailM: w.distanceFromTrailM,
    source: "trekkingmania_gpx_2024",
  }));
console.log(`GPX waypoints kept: ${gpxWaypoints.length}/${wpts.length}`);

// ---------- 6. OSM water + "buy water" places via Overpass ----------
const lons = main3.map((c) => c[0]), lats = main3.map((c) => c[1]);
const pad = 0.012;
const bbox = [Math.min(...lats) - pad, Math.min(...lons) - pad, Math.max(...lats) + pad, Math.max(...lons) + pad].map((n) => round(n, 4)).join(",");
const query = `[out:json][timeout:90];
(
  nwr["natural"="spring"](${bbox});
  nwr["amenity"="drinking_water"](${bbox});
  nwr["man_made"="water_tap"](${bbox});
  nwr["amenity"="fountain"]["drinking_water"="yes"](${bbox});
  nwr["shop"~"^(supermarket|convenience|general|kiosk|greengrocer|bakery)$"](${bbox});
  nwr["amenity"~"^(cafe|restaurant|fast_food)$"](${bbox});
);
out center tags;`;
const OVERPASS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];
let osm = null;
for (let attempt = 0; attempt < 3 && !osm; attempt++) {
  for (const ep of OVERPASS) {
    try {
      const r = await fetch(ep, { method: "POST", body: new URLSearchParams({ data: query }), headers: { "User-Agent": UA } });
      const t = await r.text();
      if (r.ok && t.trimStart().startsWith("{")) { osm = JSON.parse(t); console.log(`Overpass OK via ${ep}: ${osm.elements.length} elements`); break; }
      console.warn(`  Overpass ${ep}: ${r.status}`);
    } catch (e) { console.warn(`  Overpass ${ep}: ${e.message}`); }
  }
}
if (!osm) throw new Error("Overpass unavailable");
const osmDate = osm.osm3s?.timestamp_osm_base ?? new Date().toISOString();

const water = [];
const buy = [];
for (const e of osm.elements) {
  const t = e.tags ?? {};
  const lat = e.lat ?? e.center?.lat, lon = e.lon ?? e.center?.lon;
  if (lat == null) continue;
  const at = nearestIndex(main3, [lon, lat]);
  const isWater = t.natural === "spring" || t.amenity === "drinking_water" || t.man_made === "water_tap" || t.amenity === "fountain";
  const base = {
    coordinates: [round(lon, 6), round(lat, 6)],
    distanceFromTrailM: Math.round(at.distance),
    trailKm: round(masterCum[at.index] / 1000, 2),
    osm: `${e.type}/${e.id}`,
  };
  if (isWater && at.distance <= WATER_CORRIDOR_M) {
    if (t.drinking_water === "no") continue;
    water.push({
      id: `osm-water-${e.type}-${e.id}`,
      kind: "source",
      name: t.name ?? (t.natural === "spring" ? "Spring (OSM)" : t.man_made === "water_tap" ? "Water tap (OSM)" : "Drinking water (OSM)"),
      osmType: t.natural === "spring" ? "spring" : t.man_made === "water_tap" ? "water_tap" : "drinking_water",
      drinkingWater: t.drinking_water ?? null,
      ...base,
    });
  } else if (!isWater && at.distance <= BUY_CORRIDOR_M) {
    buy.push({
      id: `osm-buy-${e.type}-${e.id}`,
      kind: "buy",
      name: t.name ?? t["name:en"] ?? (t.shop ? `Shop (${t.shop})` : `${t.amenity}`),
      osmType: t.shop ? `shop=${t.shop}` : `amenity=${t.amenity}`,
      ...base,
    });
  }
}
// The spring from the plan doc (Kabak–Alınca climb). Kept even if OSM has no node there.
const DOC_SPRING = [29.1447, 36.4651];
const docSpringAt = nearestIndex(main3, DOC_SPRING);
water.push({
  id: "doc-spring-kabak-alinca",
  kind: "source",
  name: "Spring on the Kabak–Alınca climb",
  osmType: "spring",
  drinkingWater: null,
  coordinates: DOC_SPRING,
  distanceFromTrailM: Math.round(docSpringAt.distance),
  trailKm: round(masterCum[docSpringAt.index] / 1000, 2),
  source: "user_itinerary",
});
water.sort((a, b) => a.trailKm - b.trailKm);
buy.sort((a, b) => a.trailKm - b.trailKm);
console.log(`Water sources: ${water.length}, buy-water places: ${buy.length}`);

// ---------- 7. offline-map corridor polygon (±2 km squares along the trail + key towns) ----------
const squares = [];
let acc = 0;
const sample = [main3[0]];
for (let i = 1; i < main3.length; i++) {
  acc += haversine(main3[i - 1], main3[i]);
  if (acc > 700) { sample.push(main3[i]); acc = 0; }
}
sample.push(main3.at(-1));
const EXTRA = [
  [29.15313, 36.57402], // Carrington Suites, Ölüdeniz (night of 8 Oct)
  [29.31933, 36.27565], // Gelemiş (dolmuş)
  [29.63838, 36.20187], // Kaş (14–17 Oct)
];
for (const [lon, lat] of [...sample, ...EXTRA]) {
  const dx = OFFLINE_BUFFER_M / (111320 * Math.cos((lat * Math.PI) / 180));
  const dy = OFFLINE_BUFFER_M / 110540;
  squares.push([[[lon - dx, lat - dy], [lon + dx, lat - dy], [lon + dx, lat + dy], [lon - dx, lat + dy], [lon - dx, lat - dy]].map((c) => c.map((n) => round(n, 5)))]);
}

// ---------- write ----------
const generatedAt = new Date().toISOString().slice(0, 10);
writeFileSync(path.join(root, "data/trail.json"), JSON.stringify({
  _comment: "GENERATED by scripts/build-trail.mjs — do not hand-edit. Coordinates are [lon, lat, elevation_m]. Source track: trekkingmania 2024 GPX (cleaned: split at >300 m gaps, only the Ovacık→Xanthos corridor kept, cut per day). Elevations: see elevationSource (fetched once at build time, never at runtime). AllTrails figures in routes.json remain the headline numbers.",
  generatedAt,
  elevationSource,
  totalKm: round(masterCum.at(-1) / 1000, 2),
  days,
}));
writeFileSync(path.join(root, "data/pois.json"), JSON.stringify({
  _comment: "GENERATED by scripts/build-trail.mjs — do not hand-edit. trailKm = distance along our whole corridor from the Ovacık trailhead. Water 'source' = OSM natural=spring / amenity=drinking_water / man_made=water_tap within 1 km; 'buy' = OSM shops/cafés within 300 m. OSM data © OpenStreetMap contributors (ODbL).",
  generatedAt,
  osmTimestamp: osmDate,
  gpxWaypoints,
  water,
  buy,
}, null, 1));
writeFileSync(path.join(root, "data/corridor.geojson"), JSON.stringify({ type: "MultiPolygon", coordinates: squares }));
console.log("Wrote data/trail.json, data/pois.json, data/corridor.geojson");
