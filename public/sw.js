// Service worker: cache-first for same-origin GET requests, network fallback,
// with the index page as a navigation fallback when fully offline.
// Populated on demand by the "Save for offline" button (see src/lib/offline.js) —
// this file does not eagerly precache the whole app.

const CACHE_NAME = "lycian-2026-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    if (request.mode === "navigate") {
      const shell = await cache.match(`${self.registration.scope}index.html`);
      if (shell) return shell;
    }
    throw err;
  }
}
