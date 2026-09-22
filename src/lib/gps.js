// Browser geolocation wrapper. Never uploads or stores location remotely.
// The browser reports fixes as often as it likes; we throttle how often we
// notify subscribers to config.gps.updateIntervalSeconds (default 7s) so the
// map/UI doesn't jitter, per the "every 5-10 seconds" requirement.

let watchId = null;
let throttleTimer = null;
const listeners = new Set();
let lastPosition = null;
let lastError = null;
let pendingPosition = null;
let intervalMs = 7000;

export function configureGps({ updateIntervalSeconds } = {}) {
  if (updateIntervalSeconds) intervalMs = updateIntervalSeconds * 1000;
}

export function subscribeGps(listener) {
  listeners.add(listener);
  if (lastPosition || lastError) listener({ position: lastPosition, error: lastError });
  return () => listeners.delete(listener);
}

function notify() {
  for (const l of listeners) l({ position: lastPosition, error: lastError });
}

function flushPending() {
  if (pendingPosition) {
    lastPosition = pendingPosition;
    lastError = null;
    notify();
  }
  throttleTimer = null;
}

export function startGps() {
  if (watchId !== null) return;
  if (!("geolocation" in navigator)) {
    lastError = { code: "unsupported", message: "Geolocation not supported in this browser." };
    notify();
    return;
  }
  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      pendingPosition = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        heading: typeof pos.coords.heading === "number" && !Number.isNaN(pos.coords.heading) ? pos.coords.heading : null,
        timestamp: pos.timestamp,
      };
      if (!lastPosition) {
        // Show the very first fix immediately rather than waiting a full interval.
        flushPending();
      }
      if (throttleTimer === null) {
        throttleTimer = setTimeout(flushPending, intervalMs);
      }
    },
    (err) => {
      lastError = { code: err.code, message: err.message };
      notify();
    },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
  );
}

export function stopGps() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  if (throttleTimer !== null) {
    clearTimeout(throttleTimer);
    throttleTimer = null;
  }
}

export function getLastPosition() {
  return lastPosition;
}
