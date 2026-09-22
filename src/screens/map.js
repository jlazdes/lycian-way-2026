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
    <div class="screen-pad">
      <div class="section-title">Map</div>
      ${!config.map.tileProvider.styleUrl ? `<p class="empty-state">No live tile provider configured yet — showing the offline corridor view. See data/config.json map.tileProvider.styleUrl.</p>` : ""}
      <div id="map-canvas-wrap"></div>
      <div class="link-row">
        <button class="btn" id="gpx-btn">Download GPX</button>
      </div>
    </div>
  `;

  const wrap = container.querySelector("#map-canvas-wrap");

  async function drawOffline() {
    renderOfflineMap(wrap, { config, places, routes, water, gpsPosition: getLastPosition() });
  }

  if (liveTilesAvailable) {
    try {
      const { mountMapLibre } = await import("../lib/map.js");
      wrap.innerHTML = `<div id="maplibre-container"></div>`;
      await mountMapLibre(wrap.querySelector("#maplibre-container"), { config, places });
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
