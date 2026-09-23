// Builds every marker shown on the map from the underlying data files, grouped
// by category. Food/sleep/transport/attraction records don't carry their own
// coordinates — they're anchored to the place they're linked to (placeId) and
// spread apart with a small offset so they don't stack exactly on top of each
// other or the place marker itself.

const CATEGORY_META = {
  place: { icon: "", color: null }, // color comes from status
  water: { icon: "💧", color: "#00A3FF" },
  food: { icon: "🍴", color: "#FF8800" },
  sleep: { icon: "⛺", color: "#7fb3a3" },
  transport: { icon: "🚌", color: "#8888FF" },
  attraction: { icon: "📍", color: "#FFEE00" },
  hazard: { icon: "⚠️", color: "#FF0000" },
};
const ATTRACTION_ICONS = { ruins: "🏛️", beach: "🏖️", viewpoint: "👁️", viewpoint_beach: "🏖️" };

function offsetCoord([lon, lat], index, count) {
  if (count <= 1) return [lon, lat];
  const radiusDeg = 0.00035; // ~35-40m, enough to separate pins visually at trail-browsing zoom
  const angle = (index / count) * 2 * Math.PI;
  return [lon + radiusDeg * Math.cos(angle), lat + radiusDeg * Math.sin(angle) * 0.7];
}

// Assigns a spread-out coordinate to each item anchored at the same placeId.
function spreadByPlace(items, placeById, getPlaceId) {
  const groups = new Map();
  for (const item of items) {
    const pid = getPlaceId(item);
    if (!groups.has(pid)) groups.set(pid, []);
    groups.get(pid).push(item);
  }
  const out = [];
  for (const [pid, group] of groups) {
    const place = placeById.get(pid);
    if (!place) continue;
    group.forEach((item, i) => {
      out.push({ item, coordinates: offsetCoord(place.coordinates, i, group.length) });
    });
  }
  return out;
}

export function buildMarkerGroups({ places, water, food, fuel, accommodation, transport, attractions, routes }) {
  const placeById = new Map(places.map((p) => [p.id, p]));
  const markers = [];

  for (const p of places) {
    markers.push({ id: p.id, kind: "place", coordinates: p.coordinates, icon: CATEGORY_META.place.icon, color: null, data: p });
  }

  for (const w of water?.waterPoints ?? []) {
    markers.push({ id: w.id, kind: "water", coordinates: w.coordinates, icon: CATEGORY_META.water.icon, color: CATEGORY_META.water.color, data: w });
  }

  for (const { item, coordinates } of spreadByPlace(food, placeById, (f) => f.placeId)) {
    markers.push({ id: item.id, kind: "food", coordinates, icon: CATEGORY_META.food.icon, color: CATEGORY_META.food.color, data: item });
  }

  for (const seller of fuel?.sellers ?? []) {
    if (!seller.placeId) continue;
    markers.push({ id: seller.id, kind: "food", coordinates: placeById.get(seller.placeId)?.coordinates, icon: "⛽", color: CATEGORY_META.food.color, data: { ...seller, isFuel: true } });
  }

  for (const { item, coordinates } of spreadByPlace(accommodation, placeById, (a) => a.placeId)) {
    markers.push({ id: item.id, kind: "sleep", coordinates, icon: CATEGORY_META.sleep.icon, color: CATEGORY_META.sleep.color, data: item });
  }

  // Only legs we can meaningfully anchor to a real place get a marker.
  const transportAnchors = {
    "transport-ajet-tbs-esb-dlm": "place-dalaman-airport",
    "transport-dolmus-adakoy-gelemis-kabak": "place-patara",
  };
  for (const t of transport ?? []) {
    const pid = transportAnchors[t.id];
    if (!pid || !placeById.get(pid)) continue;
    markers.push({ id: t.id, kind: "transport", coordinates: placeById.get(pid).coordinates, icon: CATEGORY_META.transport.icon, color: CATEGORY_META.transport.color, data: t });
  }

  const attractionsWithPlace = (attractions ?? []).filter((a) => a.placeId);
  for (const { item, coordinates } of spreadByPlace(attractionsWithPlace, placeById, (a) => a.placeId)) {
    const icon = ATTRACTION_ICONS[item.category] ?? CATEGORY_META.attraction.icon;
    markers.push({ id: item.id, kind: "attraction", coordinates, icon, color: CATEGORY_META.attraction.color, data: item });
  }

  // Hazards: route variants and low-confidence route notes that name a real conflict,
  // anchored at the nearest named place. Kept separate from the general (no single
  // location) fire-season alert, which is shown as a banner instead of a pin.
  for (const r of routes ?? []) {
    for (const variant of r.variants ?? []) {
      const anchor = placeById.get(r.fromPlaceId) ?? placeById.get(r.toPlaceId);
      if (!anchor) continue;
      markers.push({
        id: variant.id, kind: "hazard",
        coordinates: offsetCoord(anchor.coordinates, 1, 3),
        icon: CATEGORY_META.hazard.icon, color: CATEGORY_META.hazard.color,
        data: { name: variant.name, notes: variant.notes, status: variant.status, confidence: variant.confidence, sources: variant.sources },
      });
    }
  }
  const belPlace = placeById.get("place-bel");
  if (belPlace) {
    markers.push({
      id: "hazard-bel-patara-gap", kind: "hazard",
      coordinates: offsetCoord(belPlace.coordinates, 2, 3),
      icon: CATEGORY_META.hazard.icon, color: CATEGORY_META.hazard.color,
      data: {
        name: "Bel → Patara: real trail distance unresolved",
        notes: "Real OSM trail geometry could only be reconstructed as far as Bel. The continuation to Patara could not be reliably traced — open question about this day's actual structure/endpoint.",
        status: "orange", confidence: "low", sources: ["osm_lycian_way_relation", "user_itinerary"],
      },
    });
  }

  return markers;
}

export { CATEGORY_META };
