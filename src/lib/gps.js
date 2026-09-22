// Browser geolocation wrapper. Never uploads or stores location remotely.

let watchId = null;
const listeners = new Set();
let lastPosition = null;
let lastError = null;

export function subscribeGps(listener) {
  listeners.add(listener);
  if (lastPosition || lastError) listener({ position: lastPosition, error: lastError });
  return () => listeners.delete(listener);
}

function notify() {
  for (const l of listeners) l({ position: lastPosition, error: lastError });
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
      lastPosition = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      };
      lastError = null;
      notify();
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
}

export function getLastPosition() {
  return lastPosition;
}
