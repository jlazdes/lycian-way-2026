import { getConfig, getPlaces, getRoutes, getWater, getAttractions, getAlerts, getSourceById } from "../lib/data.js";
import { renderOfflineMap } from "../lib/offlineMap.js";
import { subscribeGps, startGps, getLastPosition, configureGps } from "../lib/gps.js";
import { buildGpx, downloadGpx } from "../lib/gpx.js";
import { statusBadgeHtml, statusLabel, escapeHtml } from "../lib/status.js";

export async function renderMap(container) {
  const [config, places, routes, water, attractions, alerts] = await Promise.all([
    getConfig(), getPlaces(), getRoutes(), getWater(), getAttractions(), getAlerts(),
  ]);
  configureGps(config.gps);

  const liveTilesAvailable = navigator.onLine && Boolean(config.map.tileProvider.styleUrl);
  const attractionByPlaceId = new Map(attractions.filter((a) => a.placeId).map((a) => [a.placeId, a]));

  container.innerHTML = `
    <div class="map-screen">
      <div id="map-canvas-wrap"></div>
      <div id="map-fallback-note" class="map-fallback-note" hidden>Offline corridor view — no live map tiles right now.</div>

      <button class="map-fab map-fab--demo" id="demo-btn">▶ Play Demo</button>
      <button class="map-fab map-fab--stop-demo" id="demo-stop-btn" hidden>✕ End Demo</button>
      <button class="map-fab map-fab--gpx" id="gpx-btn" title="Download GPX" aria-label="Download GPX">GPX</button>

      <div id="poi-panel" class="poi-panel" hidden>
        <button class="poi-panel__close" id="poi-close-btn" aria-label="Close">&times;</button>
        <div id="poi-panel-body"></div>
      </div>
    </div>
  `;

  const wrap = container.querySelector("#map-canvas-wrap");
  const fallbackNote = container.querySelector("#map-fallback-note");
  const demoBtn = container.querySelector("#demo-btn");
  const demoStopBtn = container.querySelector("#demo-stop-btn");
  const poiPanel = container.querySelector("#poi-panel");
  const poiPanelBody = container.querySelector("#poi-panel-body");
  const poiCloseBtn = container.querySelector("#poi-close-btn");

  async function renderPoiPanel({ kind, data }) {
    const isPlace = kind === "place";
    const attraction = isPlace ? attractionByPlaceId.get(data.id) : null;
    const name = data.name;
    const status = isPlace ? data.status : (data.status === "confirmed_available" ? "neutral" : data.status === "confirmed_unavailable" || data.status === "reported_dry" ? "red" : "orange");
    const confidence = data.confidence;
    const lastVerified = data.lastVerified;
    const notes = attraction?.shortDescription ?? data.notes ?? "";
    const [lon, lat] = data.coordinates;
    const sources = await Promise.all((data.sources ?? []).map((id) => getSourceById(id)));

    poiPanelBody.innerHTML = `
      <div class="pill-row">${statusBadgeHtml(config, status)}<span class="pill">${escapeHtml(statusLabel(config, status))}</span></div>
      <h3>${escapeHtml(name)}</h3>
      ${isPlace ? "" : `<p class="poi-panel__category">${escapeHtml(data.waterType ?? "water point")}</p>`}
      ${notes ? `<p>${escapeHtml(notes)}</p>` : ""}
      <p style="font-size:0.75rem;color:var(--text-dim);">Confidence: ${escapeHtml(confidence ?? "?")}${lastVerified ? ` &middot; last verified ${escapeHtml(lastVerified)}` : ""}</p>
      ${sources.length ? `<div class="section-title">Sources</div>${sources.filter(Boolean).map((s) => s.url
        ? `<p><a href="${s.url}" target="_blank" rel="noopener">${escapeHtml(s.title)}</a></p>`
        : `<p>${escapeHtml(s.title)}</p>`).join("")}` : ""}
      <div class="link-row">
        <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}">Open in Google Maps</a>
      </div>
    `;
    poiPanel.hidden = false;
  }

  function closePoiPanel() {
    poiPanel.hidden = true;
  }
  poiCloseBtn.addEventListener("click", closePoiPanel);

  async function drawOffline() {
    fallbackNote.hidden = false;
    renderOfflineMap(wrap, { config, places, routes, water, gpsPosition: getLastPosition() });
  }

  let mapApi = null;
  if (liveTilesAvailable) {
    try {
      const { mountMapLibre } = await import("../lib/map.js");
      wrap.innerHTML = `<div id="maplibre-container" style="width:100%;height:100%;"></div>`;
      mapApi = await mountMapLibre(wrap.querySelector("#maplibre-container"), { config, places, routes, water });
      mapApi.setOnPoiClick(renderPoiPanel);
    } catch (e) {
      console.warn("MapLibre failed to load, falling back to offline corridor view", e);
      await drawOffline();
    }
  } else {
    await drawOffline();
  }

  subscribeGps(({ position }) => {
    if (mapApi && position) mapApi.setGpsPosition(position);
    else if (!liveTilesAvailable) drawOffline();
  });
  startGps();

  container.querySelector("#gpx-btn").addEventListener("click", () => {
    const xml = buildGpx({ places, routes, water, attractions, alerts });
    downloadGpx(xml);
  });

  if (mapApi) {
    demoBtn.addEventListener("click", () => {
      closePoiPanel();
      demoBtn.hidden = true;
      demoStopBtn.hidden = false;
      mapApi.playDemo(() => {
        demoBtn.hidden = false;
        demoStopBtn.hidden = true;
      });
    });
    demoStopBtn.addEventListener("click", () => {
      mapApi.stopDemo();
      demoBtn.hidden = false;
      demoStopBtn.hidden = true;
    });
  } else {
    demoBtn.hidden = true;
  }
}
