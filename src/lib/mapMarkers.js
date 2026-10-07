import { L, gpxName } from "./i18n.js";
// Builds every marker shown on the map from the data files. Records with their
// own `coordinates` are placed exactly; older records without coordinates are
// anchored to their placeId and spread apart slightly so they don't stack.
//
// `group` drives visibility: "water" markers stay visible in "Только вода" mode;
// `generated` markers (OSM/GPX-derived) only appear from zoom 12 to keep the
// overview readable.

const CATEGORY_META = {
  place: { icon: "", color: null }, // color comes from status
  source: { icon: "💧", color: "#00A3FF" },
  buy: { icon: "🛒", color: "#2EC4B6" },
  food: { icon: "🍴", color: "#FF8800" },
  sleep: { icon: "⛺", color: "#7fb3a3" },
  hotel: { icon: "🏨", color: "#7fb3a3" },
  fuel: { icon: "⛽", color: "#FF8800" },
  transport: { icon: "🚌", color: "#8888FF" },
  flight: { icon: "✈️", color: "#8888FF" },
  attraction: { icon: "📍", color: "#FFEE00" },
  hazard: { icon: "⚠️", color: "#FF0000" },
  village: { icon: "🏘️", color: "#C9B79C" },
  trail: { icon: "🥾", color: "#C9B79C" },
  beach: { icon: "🏖️", color: "#FFEE00" },
  camp: { icon: "⛺", color: "#7fb3a3" },
};
const ATTRACTION_ICONS = { ruins: "🏛️", beach: "🏖️", viewpoint: "👁️", viewpoint_beach: "🏖️" };
const GPX_CATEGORY_LABEL = {
  village: L("Village / shop (GPX)", "Село / магазин (GPX)"), trail: L("Trail / junction (GPX)", "Тропа / развилка (GPX)"), ruins: L("Ruins (GPX)", "Руины (GPX)"),
  beach: L("Beach (GPX)", "Пляж (GPX)"), camp: L("Camping (GPX)", "Кемпинг (GPX)"), fuel: L("Gas (GPX)", "Газ (GPX)"), transport: L("Bus station (GPX)", "Автовокзал (GPX)"), other: L("Point (GPX)", "Точка (GPX)"),
};

function offsetCoord([lon, lat], index, count) {
  if (count <= 1) return [lon, lat];
  const radiusDeg = 0.00035;
  const angle = (index / count) * 2 * Math.PI;
  return [lon + radiusDeg * Math.cos(angle), lat + radiusDeg * Math.sin(angle) * 0.7];
}

function spreadByPlace(items, placeById) {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.placeId)) groups.set(item.placeId, []);
    groups.get(item.placeId).push(item);
  }
  const out = [];
  for (const [pid, group] of groups) {
    const place = placeById.get(pid);
    if (!place) continue;
    group.forEach((item, i) => out.push({ item, coordinates: offsetCoord(place.coordinates, i, group.length) }));
  }
  return out;
}

function placed(items, placeById) {
  const exact = items.filter((i) => i.coordinates).map((item) => ({ item, coordinates: item.coordinates }));
  const anchored = spreadByPlace(items.filter((i) => !i.coordinates && i.placeId), placeById);
  return [...exact, ...anchored];
}

const close = (a, b, deg = 0.0012) => Math.abs(a[0] - b[0]) < deg && Math.abs(a[1] - b[1]) < deg;

export function buildMarkerGroups({ places, food, fuel, accommodation, transport, attractions, routes, waterList, pois }) {
  const placeById = new Map(places.map((p) => [p.id, p]));
  const markers = [];
  const push = (m) => markers.push({ group: "other", generated: false, ...m });

  // Key places only (start/finish points etc.); hotel/camp places are shown via their records.
  const shownAsRecord = new Set(["place-carrington-suites", "place-g7-yediburunlar", "place-spring-kabak-alinca"]);
  for (const p of places) {
    if (shownAsRecord.has(p.id)) continue;
    push({ id: p.id, kind: "place", coordinates: p.coordinates, data: p });
  }

  // Water: sources and "buy" points (OSM-generated ones only; curated cafés are food markers below).
  for (const w of waterList) {
    if (w.curated && w.kind === "buy") continue;
    const meta = CATEGORY_META[w.kind];
    push({ id: w.id, kind: w.kind, group: "water", generated: !w.curated, coordinates: w.coordinates, icon: meta.icon, color: meta.color, data: w });
  }

  for (const { item, coordinates } of placed(food, placeById)) {
    push({ id: item.id, kind: "food", group: "water", coordinates, icon: CATEGORY_META.food.icon, color: CATEGORY_META.food.color, data: item });
  }
  for (const seller of fuel?.sellers ?? []) {
    const coordinates = seller.coordinates ?? placeById.get(seller.placeId)?.coordinates;
    if (coordinates) push({ id: seller.id, kind: "fuel", coordinates, icon: CATEGORY_META.fuel.icon, color: CATEGORY_META.fuel.color, data: seller });
  }
  for (const { item, coordinates } of placed(accommodation, placeById)) {
    const meta = item.type === "hotel" ? CATEGORY_META.hotel : CATEGORY_META.sleep;
    push({ id: item.id, kind: "sleep", coordinates, icon: meta.icon, color: item.status === "red" ? "#FF0000" : meta.color, data: item });
  }

  const transportAnchors = {
    "transport-ajet-tbs-esb-dlm": ["place-dalaman-airport", "flight"],
    "transport-dolmus-xanthos-kas": ["place-xanthos", "transport"],
  };
  for (const t of transport ?? []) {
    const [pid, kind] = transportAnchors[t.id] ?? [];
    const place = placeById.get(pid);
    if (!place) continue;
    push({ id: t.id, kind: "transport", coordinates: offsetCoord(place.coordinates, 1, 4), icon: CATEGORY_META[kind].icon, color: CATEGORY_META[kind].color, data: t });
  }

  const attractionsWithPlace = (attractions ?? []).filter((a) => a.placeId);
  for (const { item, coordinates } of spreadByPlace(attractionsWithPlace, placeById)) {
    const icon = ATTRACTION_ICONS[item.category] ?? CATEGORY_META.attraction.icon;
    push({ id: item.id, kind: "attraction", coordinates, icon, color: CATEGORY_META.attraction.color, data: item });
  }

  for (const r of routes ?? []) {
    for (const variant of r.variants ?? []) {
      const anchor = placeById.get(r.fromPlaceId) ?? placeById.get(r.toPlaceId);
      if (!anchor) continue;
      push({
        id: variant.id, kind: "hazard",
        coordinates: offsetCoord(anchor.coordinates, 1, 3),
        icon: CATEGORY_META.hazard.icon, color: CATEGORY_META.hazard.color,
        data: { name: variant.name, notes: variant.notes, status: variant.status, confidence: variant.confidence, sources: variant.sources },
      });
    }
  }

  // GPX waypoints (±3 km of the trail), unless something curated already sits there.
  const curatedSpots = markers.map((m) => m.coordinates);
  for (const w of pois?.gpxWaypoints ?? []) {
    if (curatedSpots.some((c) => close(c, w.coordinates))) continue;
    const meta = w.category === "ruins" ? { icon: "🏛️", color: CATEGORY_META.attraction.color } : (CATEGORY_META[w.category] ?? CATEGORY_META.trail);
    push({
      id: w.id, kind: "gpx", generated: true, group: w.category === "village" ? "water" : "other",
      coordinates: w.coordinates, icon: meta.icon, color: meta.color,
      data: { ...w, name: gpxName(w.name), categoryLabel: GPX_CATEGORY_LABEL[w.category] ?? GPX_CATEGORY_LABEL.other },
    });
  }

  return markers;
}

export { CATEGORY_META };
