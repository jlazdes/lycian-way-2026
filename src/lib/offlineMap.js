// Lightweight SVG corridor renderer — the map fallback that works with zero network
// and zero tile provider. Projects lon/lat linearly within the trip bounding box,
// which is fine at this geographic scale (a few tens of km). Fills its container
// edge-to-edge so it reads the same as the live map screen.

import { statusColor, escapeHtml } from "./status.js";

function project(bbox, [lon, lat], width, height, pad) {
  const x = pad + ((lon - bbox.west) / (bbox.east - bbox.west)) * (width - 2 * pad);
  const y = pad + (1 - (lat - bbox.south) / (bbox.north - bbox.south)) * (height - 2 * pad);
  return [x, y];
}

export function renderOfflineMap(container, { config, places, routes, water, gpsPosition }) {
  const bbox = config.map.boundingBox;
  const width = 400, height = 640, pad = 30;
  const placeById = new Map(places.map((p) => [p.id, p]));

  const routeLines = routes.map((r) => {
    const from = placeById.get(r.fromPlaceId);
    const to = placeById.get(r.toPlaceId);
    if (!from || !to) return "";
    const [x1, y1] = project(bbox, from.coordinates, width, height, pad);
    const [x2, y2] = project(bbox, to.coordinates, width, height, pad);
    const hasRealGeometry = r.geometry?.coordinates?.length > 0;
    const color = statusColor(config, r.status);
    const dash = hasRealGeometry ? "" : 'stroke-dasharray="6 5"';
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="3" ${dash} opacity="0.85"/>`;
  }).join("");

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
    return `<circle cx="${x}" cy="${y}" r="4" fill="#4fc3f7" stroke="#0e1613" stroke-width="1.2"/>`;
  }).join("");

  const gpsMarker = gpsPosition
    ? (() => {
        const [x, y] = project(bbox, [gpsPosition.lon, gpsPosition.lat], width, height, pad);
        return `<circle cx="${x}" cy="${y}" r="7" fill="#4fc3f7" opacity="0.9"><animate attributeName="r" values="7;13;7" dur="1.6s" repeatCount="indefinite"/></circle>`;
      })()
    : "";

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;background:#182420;">
      ${routeLines}
      ${waterMarkers}
      ${placeMarkers}
      ${gpsMarker}
    </svg>
  `;
}
