import { L, lang } from "./i18n.js";
// PWA + offline. Two caches:
//  - SHELL_CACHE: app shell, data, KB articles. Precached by the service worker
//    on install (list injected at build time), refreshable via "Save for offline".
//  - MAP_CACHE: the self-hosted corridor basemap (public/offline/*), only filled
//    when the user taps "Скачать карту маршрута". Kept across app updates.
// Keep these names in sync with public/sw.js.

export const CACHE_NAME = "lycian-2026-v2";
export const MAP_CACHE = "lycian-map-v1";

export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((e) => console.warn("SW registration failed", e));
  });
}

const DATA_FILES = [
  "config", "trip", "itinerary", "routes", "places", "water",
  "accommodation", "food", "fuel", "transport", "alerts", "attractions",
  "sources", "changelog", "trail", "pois",
];

const KNOWLEDGE_SLUGS = [
  "before-we-leave", "water", "food", "fuel", "sleep", "transport",
  "route-decisions", "safety", "ancient-lycia", "turkish-phrases", "hiker-reports",
];

function currentShellAssetUrls() {
  // Hashed bundle names are unknown ahead of time — read them from the live document.
  const urls = new Set();
  document.querySelectorAll("script[src]").forEach((el) => urls.add(el.src));
  document.querySelectorAll('link[rel="stylesheet"], link[rel="modulepreload"]').forEach((el) => urls.add(el.href));
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
    `${base}vendor/maplibre-gl-worker.mjs`,
    `${base}vendor/maplibre-gl-shared.mjs`,
    ...currentShellAssetUrls(),
    ...DATA_FILES.map((f) => `${base}data/${f}.json`),
    ...KNOWLEDGE_SLUGS.map((s) => `${base}content/knowledge/${s}.md`),
  ];
  // Lazily-loaded chunks (map screen) are listed by the service worker's precache;
  // ask it to (re)run that too.
  navigator.serviceWorker?.controller?.postMessage({ type: "precache" });
  const cache = await caches.open(CACHE_NAME);
  let done = 0;
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "reload" });
      if (res.ok) await cache.put(url, res);
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
  if (!(await caches.has(CACHE_NAME))) return false;
  const cache = await caches.open(CACHE_NAME);
  return Boolean(await cache.match(`${import.meta.env.BASE_URL}data/trail.json`));
}

// ---------- offline basemap ----------

function mapUrl(rel) {
  // Encode each path segment (font names contain spaces) the same way the
  // browser will when MapLibre requests them.
  return `${location.origin}${import.meta.env.BASE_URL}offline/${rel.split("/").map(encodeURIComponent).join("/")}`;
}

export async function getMapManifest() {
  const url = mapUrl("manifest.json");
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (res.ok) return await res.json();
  } catch {}
  if ("caches" in window) {
    const cached = await (await caches.open(MAP_CACHE)).match(url);
    if (cached) return cached.json();
  }
  return null;
}

export async function isMapDownloaded() {
  if (!("caches" in window) || !(await caches.has(MAP_CACHE))) return false;
  const cache = await caches.open(MAP_CACHE);
  const manifest = await cache.match(mapUrl("manifest.json"));
  if (!manifest) return false;
  const { files } = await manifest.json();
  for (const f of files) if (!(await cache.match(mapUrl(f.path)))) return false;
  return true;
}

// onProgress(bytesDone, bytesTotal)
export async function downloadMap(onProgress) {
  if (!("caches" in window)) throw new Error(L("This browser has no offline cache.", "Этот браузер не поддерживает офлайн-кэш."));
  const manifest = await getMapManifest();
  if (!manifest) throw new Error(L("Couldn't get the map file list — needs internet.", "Не удалось получить список файлов карты — нужен интернет."));
  const cache = await caches.open(MAP_CACHE);
  let done = 0;
  for (const f of manifest.files) {
    const url = mapUrl(f.path);
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok || !res.body) throw new Error(`${L("Download error", "Ошибка загрузки")} ${f.path}: ${res.status}`);
    const reader = res.body.getReader();
    const chunks = [];
    let fileBytes = 0;
    for (;;) {
      const { done: end, value } = await reader.read();
      if (end) break;
      chunks.push(value);
      fileBytes += value.length;
      onProgress?.(done + fileBytes, manifest.totalBytes);
    }
    done += f.bytes;
    await cache.put(url, new Response(new Blob(chunks), { headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/octet-stream" } }));
    onProgress?.(done, manifest.totalBytes);
  }
  await cache.put(mapUrl("manifest.json"), new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/json" } }));
  return manifest;
}

export async function deleteMap() {
  if ("caches" in window) await caches.delete(MAP_CACHE);
}

// The cached corridor archive as a File, for pmtiles' FileSource (no range requests needed).
export async function getCachedPmtilesFile() {
  if (!("caches" in window) || !(await caches.has(MAP_CACHE))) return null;
  const res = await (await caches.open(MAP_CACHE)).match(mapUrl("corridor.pmtiles"));
  if (!res) return null;
  return new File([await res.blob()], "corridor.pmtiles");
}

export function offlineAssetBase() {
  return `${location.origin}${import.meta.env.BASE_URL}offline/`;
}

export function formatBytes(n) {
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} ${L("KB", "КБ")}`;
  const mb = (n / 1024 / 1024).toFixed(1);
  return `${lang === "ru" ? mb.replace(".", ",") : mb} ${L("MB", "МБ")}`;
}
