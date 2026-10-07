// Lightweight SVG corridor renderer — last-resort fallback when MapLibre can't
// start at all (e.g. no WebGL). Projects lon/lat linearly within the trail's
// bounds, which is fine at this scale. The normal offline path is MapLibre with
// the cached corridor basemap (see lib/map.js).

import { statusColor, escapeHtml } from "./status.js";
import { splitPolylineAtDistance } from "./geo.js";
import { getStoredProgressMeters } from "./progress.js";

function boundsOf(coords) {
  const b = { west: 180, south: 90, east: -180, north: -90 };
  for (const [lon, lat] of coords) {
    b.west = Math.min(b.west, lon); b.east = Math.max(b.east, lon);
    b.south = Math.min(b.south, lat); b.north = Math.max(b.north, lat);
  }
  return b;
}

function project(bbox, [lon, lat], width, height, pad) {
  return [
    pad + ((lon - bbox.west) / (bbox.east - bbox.west)) * (width - 2 * pad),
    pad + (1 - (lat - bbox.south) / (bbox.north - bbox.south)) * (height - 2 * pad),
  ];
}

function polylineEl(points, color, strokeWidth = 3) {
  if (points.length < 2) return "";
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;
}

export function renderOfflineMap(container, { config, places, master, waterList, gpsPosition }) {
  const width = 400, height = 640, pad = 30;
  const bbox = boundsOf(master.coords);
  const P = (c) => project(bbox, c, width, height, pad);
  const untraveledColor = config.routeProgress?.untraveled ?? "#AAAAAA";
  const traveledColor = config.routeProgress?.traveled ?? "#00FF80";

  let lines = polylineEl(master.coords.map(P), untraveledColor);
  const { before } = splitPolylineAtDistance(master.coords, getStoredProgressMeters());
  if (before.length >= 2) lines += polylineEl(before.map(P), traveledColor);

  const inBox = ([lon, lat]) => lon >= bbox.west - 0.02 && lon <= bbox.east + 0.02 && lat >= bbox.south - 0.02 && lat <= bbox.north + 0.02;
  const placeMarkers = places.filter((p) => inBox(p.coordinates)).map((p) => {
    const [x, y] = P(p.coordinates);
    return `<circle cx="${x}" cy="${y}" r="5" fill="${statusColor(config, p.status)}" stroke="#0e1613" stroke-width="1.5"/>
      <text x="${x + 8}" y="${y + 4}" font-size="10" fill="#eef2ee">${escapeHtml(p.name)}</text>`;
  }).join("");
  const waterMarkers = waterList.filter((w) => w.kind === "source").map((w) => {
    const [x, y] = P(w.coordinates);
    return `<circle cx="${x}" cy="${y}" r="3.5" fill="#00A3FF" stroke="#0e1613" stroke-width="1"/>`;
  }).join("");
  const gps = gpsPosition && inBox([gpsPosition.lon, gpsPosition.lat]) ? (() => {
    const [x, y] = P([gpsPosition.lon, gpsPosition.lat]);
    return `<circle cx="${x}" cy="${y}" r="7" fill="${config.gps?.markerColor ?? "#1A73E8"}" opacity="0.9"/>`;
  })() : "";

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;background:#182420;">
      ${lines}${waterMarkers}${placeMarkers}${gps}
    </svg>
  `;
}
