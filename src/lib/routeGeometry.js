// Builds the display geometry for routes: real OSM-derived coordinates where we
// have them (solid line), plus a dashed straight-line placeholder for whatever
// tail isn't covered yet (e.g. the unresolved Bel→Patara stretch) — never silently
// pretending a placeholder is real geometry.

import { haversine } from "./geo.js";

// Order matters: this is itinerary day order, used to build one continuous
// "master trail" for live GPS progress tracking and the demo animation.
const ROUTE_ORDER = [
  "route-ovacik-faralya-kabak",
  "route-kabak-alinca",
  "route-alinca-yediburunlar",
  "route-yediburunlar-bel-patara",
];

function pointsRoughlyEqual(a, b, toleranceMeters = 150) {
  if (!a || !b) return false;
  return haversine(a, b) < toleranceMeters;
}

// Returns { solid: [lon,lat][], dashed: [lon,lat][] } for one route.
export function getDisplaySegments(route, placeById) {
  const real = route.geometry?.coordinates ?? [];
  const toPlace = placeById.get(route.toPlaceId);
  const fromPlace = placeById.get(route.fromPlaceId);

  if (real.length === 0) {
    // No real geometry at all — whole leg is a dashed straight-line placeholder.
    const pts = [fromPlace?.coordinates, toPlace?.coordinates].filter(Boolean);
    return { solid: [], dashed: pts };
  }

  const lastReal = real[real.length - 1];
  if (toPlace && !pointsRoughlyEqual(lastReal, toPlace.coordinates)) {
    return { solid: real, dashed: [lastReal, toPlace.coordinates] };
  }
  return { solid: real, dashed: [] };
}

// Concatenates the solid portions of every route in itinerary order into one
// master trail for progress tracking. Returns { coords, routeBreaks } where
// routeBreaks[i] is the cumulative point-count at the end of routes[i].
export function buildMasterTrail(routes, placeById) {
  const byId = new Map(routes.map((r) => [r.id, r]));
  let coords = [];
  for (const id of ROUTE_ORDER) {
    const route = byId.get(id);
    if (!route) continue;
    const { solid } = getDisplaySegments(route, placeById);
    if (solid.length === 0) continue;
    if (coords.length && pointsRoughlyEqual(coords[coords.length - 1], solid[0], 5)) {
      coords = coords.concat(solid.slice(1));
    } else {
      coords = coords.concat(solid);
    }
  }
  return coords;
}
