// Our cleaned trail (data/trail.json, generated at build time) as one continuous
// "master" polyline plus per-day slices. Everything that needs "km along the
// trail" — live position, water ahead, day cards, GPX export — goes through here.

import { cumulativeDistances, nearestPointOnPolyline } from "./geo.js";

// Returns { coords: [lon,lat][], ele: number[], cum: m[], days: [{...day, startM, endM}] }.
export function buildMaster(trail) {
  const coords = [];
  const ele = [];
  const days = [];
  for (const d of trail.days) {
    const pts = d.coordinates;
    const skipFirst = coords.length > 0; // day N's first point == day N-1's last point
    const startIdx = skipFirst ? coords.length - 1 : 0;
    for (let i = skipFirst ? 1 : 0; i < pts.length; i++) {
      coords.push([pts[i][0], pts[i][1]]);
      ele.push(pts[i][2]);
    }
    days.push({ ...d, startIdx, endIdx: coords.length - 1 });
  }
  const cum = cumulativeDistances(coords);
  for (const d of days) { d.startM = cum[d.startIdx]; d.endM = cum[d.endIdx]; }
  return { coords, ele, cum, days };
}

export function dayCoords(day) {
  return day.coordinates.map((c) => [c[0], c[1]]);
}

export function dayAt(master, alongM) {
  return master.days.find((d) => alongM >= d.startM - 1 && alongM <= d.endM + 1) ?? null;
}

// Snap a position to the master trail.
export function locate(master, [lon, lat]) {
  const n = nearestPointOnPolyline([lon, lat], master.coords);
  if (!n) return null;
  return { alongM: n.distanceAlong, offTrailM: n.distanceFrom, point: n.pointOnLine, day: dayAt(master, n.distanceAlong) };
}

// All water points (sources + buy) with an along-trail position in metres,
// sorted along the trail. Curated records come first so their names win.
export function waterAlongTrail(master, { pois, water, food }) {
  const out = [];
  const seen = [];
  const near = (c) => seen.some((s) => Math.abs(s[0] - c[0]) < 0.0008 && Math.abs(s[1] - c[1]) < 0.0008);
  const add = (rec) => {
    const loc = locate(master, rec.coordinates);
    if (!loc) return;
    out.push({ ...rec, alongM: loc.alongM, offTrailM: loc.offTrailM });
    seen.push(rec.coordinates);
  };
  for (const w of water?.waterPoints ?? []) {
    add({ id: w.id, kind: "source", name: w.name, coordinates: w.coordinates, osmType: w.waterType, notes: w.notes, curated: true });
  }
  for (const f of food ?? []) {
    if (f.coordinates) add({ id: f.id, kind: "buy", name: f.name, coordinates: f.coordinates, osmType: f.category, curated: true });
  }
  for (const w of pois?.water ?? []) if (!near(w.coordinates)) add(w);
  for (const b of pois?.buy ?? []) if (!near(b.coordinates)) add(b);
  return out.sort((a, b) => a.alongM - b.alongM);
}

export function nextWaterAhead(waterList, alongM, kind) {
  return waterList.find((w) => w.alongM > alongM + 20 && (!kind || w.kind === kind)) ?? null;
}

// Tobler's hiking function: walking speed (km/h) from slope; returns hours.
export function toblerHours(coords3) {
  let h = 0;
  for (let i = 1; i < coords3.length; i++) {
    const a = coords3[i - 1], b = coords3[i];
    const dx = cumulativeDistances([[a[0], a[1]], [b[0], b[1]]])[1];
    if (dx < 0.5) continue;
    const slope = (b[2] - a[2]) / dx;
    const kmh = 6 * Math.exp(-3.5 * Math.abs(slope + 0.05));
    h += dx / 1000 / kmh;
  }
  return h;
}

export function climbOf(coords3, threshold = 8) {
  const e = coords3.map((c) => c[2]);
  const s = e.map((_, i) => { const w = e.slice(Math.max(0, i - 1), i + 2); return w.reduce((x, y) => x + y, 0) / w.length; });
  let up = 0, down = 0, ref = s[0];
  for (const v of s) {
    if (v - ref >= threshold) { up += v - ref; ref = v; }
    else if (ref - v >= threshold) { down += ref - v; ref = v; }
  }
  return { ascentM: Math.round(up), descentM: Math.round(down) };
}

export function formatKm(m) {
  const km = m / 1000;
  return km < 10 ? km.toFixed(1).replace(".", ",") : String(Math.round(km));
}

// "850 м" under a kilometre, otherwise "3,4 км".
export function formatDist(m) {
  return m < 1000 ? `${Math.round(m / 10) * 10} м` : `${formatKm(m)} км`;
}

export function formatHours(h) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return hh ? `${hh} ч ${String(mm).padStart(2, "0")} мин` : `${mm} мин`;
}

// Elevation profile as an inline SVG string. coords3: [lon,lat,ele][].
// marks: [{ m: distance from start (m), label, color }]
export function profileSvg(coords3, { width = 320, height = 90, marks = [], color = "#4BD947" } = {}) {
  if (!coords3 || coords3.length < 2) return "";
  const cum = cumulativeDistances(coords3.map((c) => [c[0], c[1]]));
  const total = cum.at(-1) || 1;
  const eles = coords3.map((c) => c[2]);
  const min = Math.min(...eles), max = Math.max(...eles);
  const padT = 8, padB = 16, padL = 30;
  const span = Math.max(20, max - min);
  const x = (m) => padL + (m / total) * (width - padL - 4);
  const y = (e) => padT + (1 - (e - min) / span) * (height - padT - padB);
  const line = coords3.map((c, i) => `${i ? "L" : "M"}${x(cum[i]).toFixed(1)},${y(c[2]).toFixed(1)}`).join(" ");
  const area = `${line} L${x(total).toFixed(1)},${height - padB} L${padL},${height - padB} Z`;
  const markEls = marks.map((mk) => {
    const mx = x(Math.max(0, Math.min(total, mk.m)));
    return `<line x1="${mx}" x2="${mx}" y1="${padT}" y2="${height - padB}" stroke="${mk.color ?? "#00A3FF"}" stroke-width="1.5" stroke-dasharray="2 2"/>`;
  }).join("");
  const gid = `pg${Math.random().toString(36).slice(2, 8)}`;
  return `<svg class="profile-svg" viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Профиль высот">
    <defs><linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="0.45"/><stop offset="1" stop-color="#000" stop-opacity="0.1"/></linearGradient></defs>
    <path d="${area}" fill="url(#${gid})"/>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2"/>
    ${markEls}
    <text x="2" y="${padT + 8}" font-size="9" fill="currentColor">${Math.round(max)} м</text>
    <text x="2" y="${height - padB}" font-size="9" fill="currentColor">${Math.round(min)} м</text>
    <text x="${padL}" y="${height - 3}" font-size="9" fill="currentColor">0</text>
    <text x="${width - 4}" y="${height - 3}" font-size="9" fill="currentColor" text-anchor="end">${formatKm(total)} км</text>
  </svg>`;
}
