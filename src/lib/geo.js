// Small geometry helpers shared by the live map, offline map, and progress tracking.
// Coordinates are [lon, lat] (GeoJSON order) unless noted otherwise.

export function haversine([lon1, lat1], [lon2, lat2]) {
  const R = 6371000;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dphi = ((lat2 - lat1) * Math.PI) / 180;
  const dlmb = ((lon2 - lon1) * Math.PI) / 180;
  const h = Math.sin(dphi / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dlmb / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Cumulative distance (meters) at each point of a polyline, index 0 = 0.
export function cumulativeDistances(coords) {
  const out = [0];
  for (let i = 1; i < coords.length; i++) {
    out.push(out[i - 1] + haversine(coords[i - 1], coords[i]));
  }
  return out;
}

export function totalLength(coords) {
  const cum = cumulativeDistances(coords);
  return cum[cum.length - 1] ?? 0;
}

// Nearest point on a polyline to `point`. Returns { distanceAlong, distanceFrom, pointOnLine, segmentIndex }.
export function nearestPointOnPolyline(point, coords) {
  if (coords.length < 2) return null;
  const cum = cumulativeDistances(coords);
  let best = null;
  for (let i = 0; i < coords.length - 1; i++) {
    const a = coords[i], b = coords[i + 1];
    const { t, pt, dist } = projectOntoSegment(point, a, b);
    const along = cum[i] + t * (cum[i + 1] - cum[i]);
    if (!best || dist < best.distanceFrom) {
      best = { distanceAlong: along, distanceFrom: dist, pointOnLine: pt, segmentIndex: i };
    }
  }
  return best;
}

function projectOntoSegment(p, a, b) {
  // Equirectangular projection, fine at this geographic scale.
  const lat0 = ((a[1] + b[1]) / 2) * (Math.PI / 180);
  const proj = ([lon, lat]) => [lon * Math.cos(lat0) * 111320, lat * 111320];
  const [px, py] = proj(p);
  const [ax, ay] = proj(a);
  const [bx, by] = proj(b);
  const dx = bx - ax, dy = by - ay;
  let t = dx === 0 && dy === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  const dist = Math.hypot(px - cx, py - cy);
  const pt = [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
  return { t, pt, dist };
}

// Point at a given distance (meters) along a polyline.
export function pointAtDistance(coords, targetDist) {
  const cum = cumulativeDistances(coords);
  const total = cum[cum.length - 1];
  const d = Math.max(0, Math.min(total, targetDist));
  for (let i = 0; i < cum.length - 1; i++) {
    if (d >= cum[i] && d <= cum[i + 1]) {
      const segLen = cum[i + 1] - cum[i];
      const t = segLen === 0 ? 0 : (d - cum[i]) / segLen;
      const a = coords[i], b = coords[i + 1];
      return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
    }
  }
  return coords[coords.length - 1];
}

// Split a polyline into [beforeDist part, afterDist part] at a given cumulative distance.
export function splitPolylineAtDistance(coords, dist) {
  const cum = cumulativeDistances(coords);
  const total = cum[cum.length - 1];
  if (dist <= 0) return { before: [], after: coords };
  if (dist >= total) return { before: coords, after: [] };
  const cutPoint = pointAtDistance(coords, dist);
  let cutIndex = 0;
  for (let i = 0; i < cum.length - 1; i++) {
    if (dist >= cum[i] && dist <= cum[i + 1]) { cutIndex = i; break; }
  }
  const before = [...coords.slice(0, cutIndex + 1), cutPoint];
  const after = [cutPoint, ...coords.slice(cutIndex + 1)];
  return { before, after };
}
