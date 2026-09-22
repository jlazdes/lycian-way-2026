// Tracks how far along the master trail the live GPS has gotten, persisted per
// device via localStorage. Only ever moves forward — GPS jitter or standing
// still shouldn't make the green "traveled" portion flicker backward.

import { nearestPointOnPolyline } from "./geo.js";

const STORAGE_KEY = "lycian-2026-trail-progress-m";
const SNAP_TOLERANCE_M = 300; // ignore GPS fixes that aren't plausibly on/near the trail

export function getStoredProgressMeters() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? Number(v) : 0;
  } catch {
    return 0;
  }
}

function setStoredProgressMeters(m) {
  try {
    localStorage.setItem(STORAGE_KEY, String(m));
  } catch {
    // localStorage unavailable (private mode, etc.) — progress just won't persist.
  }
}

// Call with a GPS fix [lon, lat] and the master trail coords. Returns the
// (possibly unchanged) current progress in meters.
export function updateProgress(position, masterTrailCoords) {
  if (!position || masterTrailCoords.length < 2) return getStoredProgressMeters();
  const nearest = nearestPointOnPolyline(position, masterTrailCoords);
  if (!nearest || nearest.distanceFrom > SNAP_TOLERANCE_M) return getStoredProgressMeters();
  const current = getStoredProgressMeters();
  if (nearest.distanceAlong > current) {
    setStoredProgressMeters(nearest.distanceAlong);
    return nearest.distanceAlong;
  }
  return current;
}

export function resetProgress() {
  setStoredProgressMeters(0);
}
