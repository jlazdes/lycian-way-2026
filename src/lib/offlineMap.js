// Lightweight SVG corridor renderer — the map fallback that works with zero network
// and zero tile provider. Projects lon/lat linearly within the trip bounding box,
// which is fine at this geographic scale (a few tens of km). Uses the same real
// trail geometry (solid) + placeholder (dashed) + traveled/untraveled split as the
// live map, just rendered without a basemap.

import { statusColor, escapeHtml } from "./status.js";
import { getDisplaySegments, buildMasterTrail } from "./routeGeometry.js";
import { splitPolylineAtDistance } from "./geo.js";
import { getStoredProgressMeters } from "./progress.js";

function project(bbox, [lon, lat], width, height, pad) {
  const x = pad + ((lon - bbox.west) / (bbox.east - bbox.west)) * (width - 2 * pad);
  const y = pad + (1 - (lat - bbox.south) / (bbox.north - bbox.south)) * (height - 2 * pad);
  return [x, y];
}

function toSvgPoints(bbox, coords, width, height, pad) {
  return coords.map((c) => project(bbox, c, width, height, pad));
}

function polylineEl(points, color, { dashed = false, width: strokeWidth = 3 } = {}) {
  if (points.length < 2) return "";
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" ${dashed ? 'stroke-dasharray="6 5"' : ""} opacity="0.9"/>`;
}

export function renderOfflineMap(container, { config, places, routes, water, gpsPosition }) {
  const bbox = config.map.boundingBox;
  const width = 400, height = 640, pad = 30;
  const placeById = new Map(places.map((p) => [p.id, p]));
  const untraveledColor = config.routeProgress?.untraveled ?? "#AAAAAA";
  const traveledColor = config.routeProgress?.traveled ?? "#00FF80";

  let lines = "";
  for (const r of routes) {
    const { solid, dashed } = getDisplaySegments(r, placeById);
    if (dashed.length >= 2) lines += polylineEl(toSvgPoints(bbox, dashed, width, height, pad), untraveledColor, { dashed: true });
    if (solid.length >= 2) lines += polylineEl(toSvgPoints(bbox, solid, width, height, pad), untraveledColor);
  }

  const masterTrail = buildMasterTrail(routes, placeById);
  if (masterTrail.length >= 2) {
    const progress = getStoredProgressMeters();
    const { before } = splitPolylineAtDistance(masterTrail, progress);
    if (before.length >= 2) lines += polylineEl(toSvgPoints(bbox, before, width, height, pad), traveledColor);
  }

  const placeMarkers = places.map((p) => {
    const [x, y] = project(bbox, p.coordinates, width, height, pad);
    const color = statusColor(config, p.status);
    return `
      <circle cx="${x}" cy="${y}" r="5" fill="${color}" stroke="#0e1613" stroke-width="1.5"/>
      <text x="${x + 8}" y="${y + 4}" font-size="10" fill="#eef2ee">${escapeHtml(p.name)}</text>
    `;
  }).join("");

  const waterMarkers = (water?.waterPoints ?? []).map((w) => {
    const [x, y] = project(bbox, w.coordinates, width, height, pad);
    return `<circle cx="${x}" cy="${y}" r="4" fill="#00A3FF" stroke="#0e1613" stroke-width="1.2"/>`;
  }).join("");

  const gpsMarker = gpsPosition
    ? (() => {
        const [x, y] = project(bbox, [gpsPosition.lon, gpsPosition.lat], width, height, pad);
        return `<circle cx="${x}" cy="${y}" r="7" fill="${config.gps?.markerColor ?? '#1A73E8'}" opacity="0.9"><animate attributeName="r" values="7;13;7" dur="1.6s" repeatCount="indefinite"/></circle>`;
      })()
    : "";

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;background:#182420;">
      ${lines}
      ${waterMarkers}
      ${placeMarkers}
      ${gpsMarker}
    </svg>
  `;
}
