// Builds a GPX file from routes + POIs + water + hazards for use in a dedicated hiking app.

function waypoint(lon, lat, name, desc) {
  return `  <wpt lat="${lat}" lon="${lon}"><name>${escapeXml(name)}</name>${desc ? `<desc>${escapeXml(desc)}</desc>` : ""}</wpt>`;
}

function escapeXml(str) {
  return String(str ?? "").replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));
}

export function buildGpx({ places, routes, water, attractions, alerts }) {
  const wpts = [];
  for (const p of places) wpts.push(waypoint(p.coordinates[0], p.coordinates[1], p.name, "place"));
  for (const w of water?.waterPoints ?? []) wpts.push(waypoint(w.coordinates[0], w.coordinates[1], `Water: ${w.name}`, `${w.waterType} / ${w.status}`));

  const placeById = new Map(places.map((p) => [p.id, p]));
  const trks = routes.map((r) => {
    const coords = r.geometry?.coordinates?.length ? r.geometry.coordinates : [
      placeById.get(r.fromPlaceId)?.coordinates,
      placeById.get(r.toPlaceId)?.coordinates,
    ].filter(Boolean);
    const segPts = coords.map(([lon, lat]) => `      <trkpt lat="${lat}" lon="${lon}"></trkpt>`).join("\n");
    return `  <trk><name>${escapeXml(r.name)}</name><trkseg>\n${segPts}\n    </trkseg></trk>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Lycian Way 2026 Trip OS" xmlns="http://www.topografix.com/GPX/1/1">
${wpts.join("\n")}
${trks.join("\n")}
</gpx>`;
}

export function downloadGpx(xml, filename = "lycian-way-2026.gpx") {
  const blob = new Blob([xml], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
