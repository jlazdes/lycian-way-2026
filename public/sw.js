// Service worker.
// - On install: precaches the whole app shell + data + KB (PRECACHE is injected
//   into dist/sw.js at build time by the plugin in vite.config.js), so the app
//   works offline after the first online visit.
// - Navigations: network first (3 s), cached index.html as fallback.
// - /data/ and /content/: stale-while-revalidate, so fixes reach phones next load.
// - Everything else same-origin: cache first.
// - /offline/ (corridor basemap): served from MAP_CACHE, filled only by the
//   "Скачать карту маршрута" button. Missing glyph ranges get an empty 200 so
//   MapLibre doesn't error on characters we didn't ship.
// Cross-origin requests (online map tiles, satellite) are never cached here.
// Keep cache names in sync with src/lib/offline.js.

const CACHE_NAME = "lycian-2026-v2";
const MAP_CACHE = "lycian-map-v1";
const PRECACHE = /*__PRECACHE__*/[];

const scoped = (p) => new URL(p, self.registration.scope).href;

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(PRECACHE.map(async (p) => {
    try {
      const res = await fetch(scoped(p), { cache: "reload" });
      if (res.ok) await cache.put(scoped(p), res);
    } catch (e) {
      // Offline during install — the page-level "Save for offline" can retry.
    }
  }));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME && n !== MAP_CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "precache") event.waitUntil(precache());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.headers.has("range")) return;

  if (request.mode === "navigate") { event.respondWith(navigation(request)); return; }
  if (url.pathname.includes("/offline/")) { event.respondWith(offlineMapAsset(request, url)); return; }
  if (url.pathname.includes("/data/") || url.pathname.includes("/content/")) { event.respondWith(staleWhileRevalidate(request)); return; }
  event.respondWith(cacheFirst(request));
});

async function navigation(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const res = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
    ]);
    if (res.ok) cache.put(scoped("index.html"), res.clone());
    return res;
  } catch {
    return (await cache.match(scoped("index.html"), { ignoreVary: true })) ?? (await cache.match(scoped("./"), { ignoreVary: true })) ?? Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch: true, ignoreVary: true });
  const network = fetch(request).then((res) => {
    if (res.ok) cache.put(request, res.clone());
    return res;
  }).catch(() => null);
  return cached ?? (await network) ?? Response.error();
}

async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreSearch: true, ignoreVary: true });
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok) (await caches.open(CACHE_NAME)).put(request, res.clone());
    return res;
  } catch (err) {
    return Response.error();
  }
}

async function offlineMapAsset(request, url) {
  const cached = await (await caches.open(MAP_CACHE)).match(request, { ignoreSearch: true, ignoreVary: true });
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok || !url.pathname.endsWith(".pbf")) return res;
  } catch {}
  if (url.pathname.endsWith(".pbf")) return new Response(new ArrayBuffer(0), { headers: { "Content-Type": "application/x-protobuf" } });
  return Response.error();
}
