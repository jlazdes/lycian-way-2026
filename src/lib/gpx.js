import { L } from "./i18n.js";
// GPX export for maps.me / Organic Maps: one <trk> per walking day (cleaned
// track with elevations) + our water and lodging points as <wpt>.

function escapeXml(str) {
  return String(str ?? "").replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));
}

function waypoint([lon, lat], name, desc, sym) {
  return `  <wpt lat="${lat}" lon="${lon}"><name>${escapeXml(name)}</name>${desc ? `<desc>${escapeXml(desc)}</desc>` : ""}${sym ? `<sym>${sym}</sym>` : ""}</wpt>`;
}

export function buildGpx({ trail, itinerary, routes, waterList, accommodation }) {
  const dayById = new Map(itinerary.map((d) => [d.id, d]));
  const routeByDay = new Map(routes.map((r) => [r.dayId, r]));

  const wpts = [];
  for (const w of waterList) {
    const label = w.kind === "source" ? L("Water: spring/tap", "Вода: источник") : L("Water: buy", "Вода: купить");
    const desc = w.kind === "source" ? L("May be dry in October — not your only source", "В октябре может быть сухим — не рассчитывать как на единственный") : (w.osmType ?? "");
    wpts.push(waypoint(w.coordinates, `${label} — ${w.name}`, desc, w.kind === "source" ? "Drinking Water" : "Shopping Center"));
  }
  for (const a of accommodation) {
    if (!a.coordinates || a.status === "red") continue;
    const desc = [a.priceInfo, a.address, a.phone, a.checkIn && `Check-in ${a.checkIn}`].filter(Boolean).join(" · ");
    wpts.push(waypoint(a.coordinates, `${L("Sleep", "Ночёвка")}: ${a.name}`, desc, a.type === "hotel" ? "Lodging" : "Campground"));
  }

  const trks = trail.days.map((d) => {
    const day = dayById.get(d.dayId);
    const route = routeByDay.get(d.dayId);
    const name = `${day?.date ?? d.dayId} ${route?.name ?? `${d.from} → ${d.to}`}`;
    const pts = d.coordinates.map(([lon, lat, ele]) => `      <trkpt lat="${lat}" lon="${lon}"><ele>${ele}</ele></trkpt>`).join("\n");
    return `  <trk><name>${escapeXml(name)}</name><desc>${escapeXml(`${d.distanceKm} km, +${d.ascentM}/-${d.descentM} m (track)`)}</desc><trkseg>\n${pts}\n    </trkseg></trk>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Lycian Way 2026" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>Lycian Way 2026 — Ovacık → Xanthos</name><desc>Cleaned track (source: trekkingmania 2024 GPX), water and lodging points. Map data © OpenStreetMap contributors.</desc></metadata>
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
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
