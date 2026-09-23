import {
  getConfig, getPlaces, getRoutes, getWater, getAttractions, getAlerts, getSourceById,
  getFood, getFuel, getAccommodation, getTransport, getItinerary,
} from "../lib/data.js";
import { renderOfflineMap } from "../lib/offlineMap.js";
import { subscribeGps, startGps, getLastPosition, configureGps } from "../lib/gps.js";
import { buildGpx, downloadGpx } from "../lib/gpx.js";
import { statusBadgeHtml, escapeHtml } from "../lib/status.js";
import { getChecklist, addItem, toggleItem, clearCompleted } from "../lib/checklist.js";

const KIND_LABEL = {
  place: "Waypoint", water: "Water", food: "Food / resupply", sleep: "Sleep",
  transport: "Transport", attraction: "Place to see", hazard: "Watch out",
};

function todaysDay(days, config) {
  const today = new Date().toISOString().slice(0, 10);
  const start = config.trip.startDate, end = config.trip.endDate;
  if (today < start) return days[0];
  if (today > end) return days[days.length - 1];
  return days.find((d) => d.date === today) ?? days[0];
}

function waterVisualStatus(waterStatus) {
  if (waterStatus === "confirmed_available") return "neutral";
  if (waterStatus === "confirmed_unavailable" || waterStatus === "reported_dry") return "red";
  return "orange";
}

export async function renderMap(container) {
  const [config, places, routes, water, attractions, alerts, food, fuel, accommodation, transport, days] = await Promise.all([
    getConfig(), getPlaces(), getRoutes(), getWater(), getAttractions(), getAlerts(),
    getFood(), getFuel(), getAccommodation(), getTransport(), getItinerary(),
  ]);
  configureGps(config.gps);

  const liveTilesAvailable = navigator.onLine && Boolean(config.map.tileProvider.styleUrl);
  const today = todaysDay(days, config);
  const corridorAlerts = alerts.filter((a) => !a.affects?.routeIds?.length); // no single point -> banner, not a pin

  container.innerHTML = `
    <div class="map-screen">
      <div id="map-canvas-wrap"></div>
      <div id="map-fallback-note" class="map-fallback-note" hidden>Offline corridor view — no live map tiles right now.</div>

      <div class="today-widget" id="today-widget">
        <button class="today-widget__header" id="today-widget-toggle">
          <span>${escapeHtml(today.date)} &middot; Tasks</span>
          <span class="today-widget__chevron" id="today-widget-chevron">&#8964;</span>
        </button>
        <div class="today-widget__body" id="today-widget-body">
          ${corridorAlerts.length ? `
            <div class="today-widget__alerts">
              ${corridorAlerts.map((a) => `<div>${statusBadgeHtml(config, a.status)} ${escapeHtml(a.title)}</div>`).join("")}
            </div>
          ` : ""}
          <div class="today-widget__list" id="today-tasks-list"></div>
          <button class="today-widget__add" id="today-add-btn">+ Add item</button>
          <div class="today-widget__completed-header" id="today-completed-header" hidden>
            <span>Completed</span>
            <button id="today-clear-btn" title="Clear completed" aria-label="Clear completed">🗑</button>
          </div>
          <div class="today-widget__list today-widget__list--completed" id="today-completed-list"></div>
          <a href="#/itinerary/${today.id}" class="today-widget__full-day">Full day view &rarr;</a>
        </div>
      </div>

      <button class="map-fab map-fab--demo" id="demo-btn">▶ Play Demo</button>
      <button class="map-fab map-fab--stop-demo" id="demo-stop-btn" hidden>✕ End Demo</button>
      <button class="map-fab map-fab--gpx" id="gpx-btn" title="Download GPX" aria-label="Download GPX">GPX</button>

      <div id="poi-panel" class="poi-panel" hidden>
        <button class="poi-panel__close" id="poi-close-btn" aria-label="Close">&times;</button>
        <div id="poi-panel-body"></div>
      </div>
    </div>
  `;

  // --- Today checklist widget ---
  const tasksList = container.querySelector("#today-tasks-list");
  const completedList = container.querySelector("#today-completed-list");
  const completedHeader = container.querySelector("#today-completed-header");

  function renderChecklist() {
    const items = getChecklist(today);
    const open = items.filter((i) => !i.done);
    const done = items.filter((i) => i.done);
    tasksList.innerHTML = open.map((i) => `
      <label class="today-widget__item">
        <input type="checkbox" data-id="${i.id}" />
        <span>${escapeHtml(i.text)}</span>
      </label>
    `).join("") || `<p class="empty-state" style="padding:6px 0;">Nothing left — nice.</p>`;
    completedHeader.hidden = done.length === 0;
    completedList.innerHTML = done.map((i) => `
      <label class="today-widget__item today-widget__item--done">
        <input type="checkbox" data-id="${i.id}" checked />
        <span>${escapeHtml(i.text)}</span>
      </label>
    `).join("");
    container.querySelectorAll("#today-tasks-list input, #today-completed-list input").forEach((cb) => {
      cb.addEventListener("change", () => { toggleItem(today, cb.dataset.id); renderChecklist(); });
    });
  }
  renderChecklist();

  container.querySelector("#today-add-btn").addEventListener("click", () => {
    const text = prompt("Add a task");
    if (text && text.trim()) { addItem(today, text.trim()); renderChecklist(); }
  });
  container.querySelector("#today-clear-btn").addEventListener("click", () => {
    clearCompleted(today);
    renderChecklist();
  });
  const widgetToggle = container.querySelector("#today-widget-toggle");
  const widgetBody = container.querySelector("#today-widget-body");
  const widgetChevron = container.querySelector("#today-widget-chevron");
  widgetToggle.addEventListener("click", () => {
    const collapsed = widgetBody.hidden = !widgetBody.hidden;
    widgetChevron.style.transform = collapsed ? "rotate(-90deg)" : "rotate(0deg)";
  });

  // --- Map + POI panel ---
  const wrap = container.querySelector("#map-canvas-wrap");
  const fallbackNote = container.querySelector("#map-fallback-note");
  const demoBtn = container.querySelector("#demo-btn");
  const demoStopBtn = container.querySelector("#demo-stop-btn");
  const poiPanel = container.querySelector("#poi-panel");
  const poiPanelBody = container.querySelector("#poi-panel-body");
  const poiCloseBtn = container.querySelector("#poi-close-btn");

  async function renderPoiPanel({ kind, data }) {
    const name = data.name;
    let status = data.status;
    if (kind === "water") status = waterVisualStatus(data.status);
    const confidence = data.confidence;
    const lastVerified = data.lastVerified;
    const coords = data.coordinates ?? null;
    const sources = await Promise.all((data.sources ?? []).map((id) => getSourceById(id)));

    let bodyExtra = "";
    if (kind === "water") {
      bodyExtra = `<p class="poi-panel__category">${escapeHtml(data.waterType)} &middot; treatment: ${escapeHtml(data.treatment)}</p>`;
    } else if (kind === "food") {
      bodyExtra = `<p class="poi-panel__category">${data.isFuel ? "fuel" : escapeHtml(data.category ?? "food")}</p>`;
    } else if (kind === "sleep") {
      bodyExtra = `<p class="poi-panel__category">${escapeHtml(data.type ?? "camp")}</p><p>${escapeHtml(data.priceInfo ?? "")}</p>`;
    } else if (kind === "transport") {
      bodyExtra = `<p class="poi-panel__category">${escapeHtml(data.mode ?? "transport")}</p>${data.date ? `<p>${escapeHtml(data.date)}</p>` : ""}`;
    } else if (kind === "attraction") {
      const learnMore = data.category === "ruins" ? `<a href="#/knowledge/ancient-lycia">More on Ancient Lycia &rarr;</a>` : "";
      bodyExtra = `<p class="poi-panel__category">${escapeHtml(data.category)}</p><p>${escapeHtml(data.shortDescription ?? "")}</p>${learnMore ? `<p>${learnMore}</p>` : ""}`;
    } else if (kind === "hazard") {
      bodyExtra = `<p><a href="#/knowledge/route-decisions">More on this open question &rarr;</a> &middot; <a href="#/knowledge/safety">Safety notes &rarr;</a></p>`;
    }

    poiPanelBody.innerHTML = `
      <div class="pill-row">${statusBadgeHtml(config, status)}<span class="pill">${escapeHtml(KIND_LABEL[kind] ?? kind)}</span></div>
      <h3>${escapeHtml(name)}</h3>
      ${bodyExtra}
      ${data.notes ? `<p>${escapeHtml(data.notes)}</p>` : ""}
      <p style="font-size:0.75rem;color:var(--text-dim);">Confidence: ${escapeHtml(confidence ?? "?")}${lastVerified ? ` &middot; last verified ${escapeHtml(lastVerified)}` : ""}</p>
      ${sources.length ? `<div class="section-title">Sources</div>${sources.filter(Boolean).map((s) => s.url
        ? `<p><a href="${s.url}" target="_blank" rel="noopener">${escapeHtml(s.title)}</a></p>`
        : `<p>${escapeHtml(s.title)}</p>`).join("")}` : ""}
      ${coords ? `<div class="link-row"><a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${coords[1]},${coords[0]}">Open in Google Maps</a></div>` : ""}
    `;
    poiPanel.hidden = false;
  }

  function closePoiPanel() { poiPanel.hidden = true; }
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
      mapApi = await mountMapLibre(wrap.querySelector("#maplibre-container"), {
        config, places, routes, water, food, fuel, accommodation, transport, attractions,
      });
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
      mapApi.playDemo(() => { demoBtn.hidden = false; demoStopBtn.hidden = true; });
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
