// PWA install + "Save for offline" trigger.
// Bump CACHE_NAME (here and in sw.js) after a structural change to the data/app shell.

export const CACHE_NAME = "lycian-2026-v1";

export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((e) => console.warn("SW registration failed", e));
  });
}

const DATA_FILES = [
  "config", "trip", "itinerary", "routes", "places", "water",
  "accommodation", "food", "fuel", "transport", "alerts", "attractions",
  "sources", "changelog",
];

const KNOWLEDGE_SLUGS = [
  "before-we-leave", "water", "food", "fuel", "sleep", "transport",
  "route-decisions", "safety", "ancient-lycia", "turkish-phrases", "hiker-reports",
];

function currentShellAssetUrls() {
  // The built JS/CSS bundle filenames are content-hashed and unknown ahead of time,
  // so read them from the live document rather than guessing — this also covers
  // dev-mode's many unbundled module files, which never get a chance to be cached
  // by the service worker's runtime handler until a second online reload otherwise.
  const urls = new Set();
  document.querySelectorAll("script[src]").forEach((el) => urls.add(el.src));
  document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => urls.add(el.href));
  document.querySelectorAll('link[rel="icon"], link[rel="manifest"]').forEach((el) => urls.add(el.href));
  return [...urls].filter((u) => u.startsWith(location.origin));
}

export async function saveForOffline(onProgress) {
  if (!("caches" in window)) throw new Error("Cache API not supported in this browser.");
  const base = import.meta.env.BASE_URL;
  const urls = [
    location.origin + base,
    `${base}index.html`,
    `${base}manifest.webmanifest`,
    ...currentShellAssetUrls(),
    ...DATA_FILES.map((f) => `${base}data/${f}.json`),
    ...KNOWLEDGE_SLUGS.map((s) => `${base}content/knowledge/${s}.md`),
  ];
  const cache = await caches.open(CACHE_NAME);
  let done = 0;
  for (const url of urls) {
    try {
      await cache.add(url);
    } catch (e) {
      console.warn(`Could not cache ${url}`, e);
    }
    done += 1;
    onProgress?.(done, urls.length);
  }
  return { cached: done, total: urls.length };
}

export async function isSavedForOffline() {
  if (!("caches" in window)) return false;
  const has = await caches.has(CACHE_NAME);
  if (!has) return false;
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  return keys.length > 0;
}
