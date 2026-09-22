import { getConfig, getPlaces, getRoutes, getWater, getAttractions, getAlerts } from "../lib/data.js";
import { renderOfflineMap } from "../lib/offlineMap.js";
import { subscribeGps, startGps, getLastPosition } from "../lib/gps.js";
import { buildGpx, downloadGpx } from "../lib/gpx.js";

export async function renderMap(container) {
  const [config, places, routes, water, attractions, alerts] = await Promise.all([
    getConfig(), getPlaces(), getRoutes(), getWater(), getAttractions(), getAlerts(),
  ]);

  const liveTilesAvailable = navigator.onLine && Boolean(config.map.tileProvider.styleUrl);

  container.innerHTML = `
    <div class="map-screen">
      <div id="map-canvas-wrap"></div>
      <button class="map-fab" id="gpx-btn" title="Download GPX" aria-label="Download GPX">GPX</button>
      <div id="map-fallback-note" class="map-fallback-note" hidden>Offline corridor view — no live map tiles right now.</div>
    </div>
  `;

  const wrap = container.querySelector("#map-canvas-wrap");
  const fallbackNote = container.querySelector("#map-fallback-note");

  async function drawOffline() {
    fallbackNote.hidden = false;
    renderOfflineMap(wrap, { config, places, routes, water, gpsPosition: getLastPosition() });
  }

  if (liveTilesAvailable) {
    try {
      const { mountMapLibre } = await import("../lib/map.js");
      wrap.innerHTML = `<div id="maplibre-container" style="width:100%;height:100%;"></div>`;
      await mountMapLibre(wrap.querySelector("#maplibre-container"), { config, places, water });
    } catch (e) {
      console.warn("MapLibre failed to load, falling back to offline corridor view", e);
      await drawOffline();
    }
  } else {
    await drawOffline();
  }

  subscribeGps(() => { if (!liveTilesAvailable) drawOffline(); });
  startGps();

  container.querySelector("#gpx-btn").addEventListener("click", () => {
    const xml = buildGpx({ places, routes, water, attractions, alerts });
    downloadGpx(xml);
  });
}
