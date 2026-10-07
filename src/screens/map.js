import {
  getConfig, getPlaces, getRoutes, getWater, getAttractions, getAlerts, getSourceById,
  getFood, getFuel, getAccommodation, getTransport, getItinerary, getTrail, getPois,
} from "../lib/data.js";
import { renderOfflineMap } from "../lib/offlineMap.js";
import { subscribeGps, startGps, stopGps, getLastPosition, configureGps } from "../lib/gps.js";
import { buildGpx, downloadGpx } from "../lib/gpx.js";
import { statusBadgeHtml, escapeHtml } from "../lib/status.js";
import { getChecklist, addItem, toggleItem, clearCompleted } from "../lib/checklist.js";
import { buildMaster, locate, waterAlongTrail, nextWaterAhead, formatKm, formatDist, climbOf, toblerHours, formatHours, profileSvg } from "../lib/trail.js";
import { pointAtDistance } from "../lib/geo.js";

const KIND_LABEL = {
  place: "Waypoint", source: "Вода: источник", buy: "Вода: купить", food: "Food / resupply", sleep: "Sleep",
  transport: "Transport", attraction: "Place to see", hazard: "Watch out", fuel: "Gas", gpx: "Точка из GPX",
};
const GPS_PREF_KEY = "lycian-2026-gps-on";
const OFF_TRAIL_M = 100;
const FAR_AWAY_M = 5000;

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

function readPref() {
  try { return localStorage.getItem(GPS_PREF_KEY) === "1"; } catch { return false; }
}
function writePref(on) {
  try { localStorage.setItem(GPS_PREF_KEY, on ? "1" : "0"); } catch {}
}

const GEO_HELP = `
  <p><strong>Доступ к геолокации запрещён.</strong> Как включить:</p>
  <p><strong>iPhone (Safari или иконка на главном экране):</strong> Настройки → Конфиденциальность и безопасность → Службы геолокации → включить; ниже «Сайты Safari» → «При использовании». Затем в Safari: «аА» в адресной строке → Настройки веб-сайта → Геопозиция → Разрешить. Перезагрузите страницу.</p>
  <p><strong>Android (Chrome):</strong> опустите шторку и включите «Местоположение». В Chrome: ⋮ → Настройки → Настройки сайтов → Геоданные → разрешить для jlazdes.github.io (или значок замка слева от адреса → Разрешения → Геоданные). Перезагрузите страницу.</p>
  <p style="color:var(--text-dim);font-size:0.75rem;">GPS работает и без интернета — нужен только доступ к геолокации.</p>
`;

export async function renderMap(container) {
  const [config, places, routes, water, attractions, alerts, food, fuel, accommodation, transport, days, trail, pois] = await Promise.all([
    getConfig(), getPlaces(), getRoutes(), getWater(), getAttractions(), getAlerts(),
    getFood(), getFuel(), getAccommodation(), getTransport(), getItinerary(), getTrail(), getPois(),
  ]);
  configureGps(config.gps);

  const master = buildMaster(trail);
  const waterList = waterAlongTrail(master, { pois, water, food });
  const placeById = new Map(places.map((p) => [p.id, p]));
  const routeByDay = new Map(routes.map((r) => [r.dayId, r]));
  const dayById = new Map(days.map((d) => [d.id, d]));
  const transportLines = [];
  if (placeById.get("place-xanthos") && placeById.get("place-kas")) {
    transportLines.push({ id: "transport-dolmus-xanthos-kas", coordinates: [placeById.get("place-xanthos").coordinates, placeById.get("place-kas").coordinates] });
  }

  const today = todaysDay(days, config);
  const corridorAlerts = alerts.filter((a) => !a.affects?.routeIds?.length); // no single point -> banner, not a pin

  container.innerHTML = `
    <div class="map-screen">
      <div id="map-canvas-wrap"></div>
      <div id="map-fallback-note" class="map-fallback-note" hidden></div>
      <div id="offtrail-banner" class="offtrail-banner" hidden></div>

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

      <button class="map-round-btn" id="locate-btn" title="Где я" aria-label="Где я" aria-pressed="false">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 3h-2.07A7 7 0 0 0 13 5.07V3h-2v2.07A7 7 0 0 0 5.07 11H3v2h2.07A7 7 0 0 0 11 18.93V21h2v-2.07A7 7 0 0 0 18.93 13H21v-2Zm-9 6a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/></svg>
      </button>

      <button class="map-round-btn map-round-btn--layers" id="layers-btn" title="Слои карты" aria-label="Слои карты" aria-expanded="false">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="m12 3 10 5.5-10 5.5L2 8.5 12 3Zm-7.6 9.3L12 16.5l7.6-4.2 2.4 1.3-10 5.5-10-5.5 2.4-1.3Z"/></svg>
      </button>
      <div class="layers-menu" id="layers-menu" hidden>
        <button data-layer="map" aria-pressed="true">Карта</button>
        <button data-layer="topo">Топо <span class="layers-menu__note">нужен интернет</span></button>
        <button data-layer="satellite">Спутник <span class="layers-menu__note">нужен интернет</span></button>
      </div>
      <button class="map-round-btn map-round-btn--measure" id="measure-btn" title="Измерить по тропе" aria-label="Измерить по тропе" aria-pressed="false">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3 17.3 17.3 3 21 6.7 6.7 21 3 17.3Zm3.7 1.3 1-1-1.6-1.6.9-.9 1.6 1.6 1.2-1.2-1-1 .9-.9 1 1 1.2-1.2-1.6-1.6.9-.9 1.6 1.6 1.2-1.2-1-1 .9-.9 1 1 1.2-1.2-1.6-1.6.9-.9 1.6 1.6 1-1-1.3-1.3L5.4 17.3l1.3 1.3Z"/></svg>
      </button>

      <div id="gps-panel" class="gps-panel" hidden></div>
      <div id="measure-panel" class="gps-panel measure-panel" hidden></div>

      <button class="map-fab map-fab--demo" id="demo-btn">▶ Play Demo</button>
      <button class="map-fab map-fab--stop-demo" id="demo-stop-btn" hidden>✕ End Demo</button>
      <button class="map-fab map-fab--water" id="water-only-btn" aria-pressed="false">💧 Только вода</button>
      <button class="map-fab map-fab--gpx" id="gpx-btn" title="Скачать GPX" aria-label="Скачать GPX">GPX</button>

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

  function trailPositionLine(coords) {
    const loc = locate(master, coords);
    if (!loc || loc.offTrailM > 3000) return "";
    const day = loc.day;
    const dayInfo = day ? `${escapeHtml(dayById.get(day.dayId)?.date ?? "")}: ${formatKm(loc.alongM - day.startM)} км от старта дня` : "";
    return `<p class="poi-panel__meta">${dayInfo}${loc.offTrailM > 30 ? ` &middot; ${Math.round(loc.offTrailM)} м от тропы` : " &middot; на тропе"}</p>`;
  }

  function mapsLinks(coords, gmapsUrl) {
    const [lon, lat] = coords;
    return `<div class="link-row">
      <a class="btn" target="_blank" rel="noopener" href="${gmapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`}">Google Maps</a>
      <a class="btn btn-secondary" href="om://map?ll=${lat},${lon}&n=1">Organic Maps</a>
      <a class="btn btn-secondary" href="mapsme://map?ll=${lat},${lon}&n=1">maps.me</a>
    </div>`;
  }

  async function renderPoiPanel({ kind, data }) {
    const coords = data.coordinates ?? null;
    let status = data.status;
    let bodyExtra = "";
    if (kind === "source") {
      status = data.curated ? waterVisualStatus("uncertain") : "orange";
      bodyExtra = `
        <p class="poi-panel__category">${escapeHtml(data.osmType ?? "spring")}${data.osm ? ` &middot; <a href="https://www.openstreetmap.org/${data.osm}" target="_blank" rel="noopener">OSM</a>` : ""}</p>
        <p class="poi-warning">В октябре может быть сухим, не рассчитывать как на единственный.</p>
        ${data.notes ? `<p>${escapeHtml(data.notes)}</p>` : ""}`;
    } else if (kind === "buy") {
      status = "neutral";
      bodyExtra = `<p class="poi-panel__category">${escapeHtml(data.osmType ?? "")}${data.osm ? ` &middot; <a href="https://www.openstreetmap.org/${data.osm}" target="_blank" rel="noopener">OSM</a>` : ""}</p>
        <p>Купить воду — надёжно (магазин / кафе). Часы работы не проверены.</p>`;
    } else if (kind === "food") {
      bodyExtra = `<p class="poi-panel__category">${escapeHtml(data.category ?? "food")}</p>`;
    } else if (kind === "fuel") {
      bodyExtra = `<p class="poi-panel__category">gas &middot; stock of EN417 canisters ${data.canisterStockConfirmed ? "confirmed" : "not confirmed"}</p>`;
    } else if (kind === "sleep") {
      bodyExtra = `<p class="poi-panel__category">${escapeHtml(data.type ?? "camp")}${data.booked ? " &middot; <strong>забронировано</strong>" : ""}</p>
        ${data.address ? `<p>${escapeHtml(data.address)}</p>` : ""}
        ${data.phone ? `<p><a href="tel:${data.phone.replace(/\s/g, "")}">${escapeHtml(data.phone)}</a></p>` : ""}
        ${data.checkIn ? `<p>Заезд: ${escapeHtml(data.checkIn)}<br>Выезд: ${escapeHtml(data.checkOut ?? "")}</p>` : ""}
        <p>${escapeHtml(data.priceInfo ?? "")}</p>`;
    } else if (kind === "transport") {
      const segs = data.details?.segments ?? (data.details?.flightNo ? [data.details] : []);
      bodyExtra = `<p class="poi-panel__category">${escapeHtml(data.mode ?? "transport")}${data.date ? ` &middot; ${escapeHtml(data.date)}` : ""}</p>
        ${segs.map((s) => `<p><strong>${escapeHtml(s.flightNo)}</strong> ${escapeHtml(s.from)} ${escapeHtml(s.depart)} → ${escapeHtml(s.to)} ${escapeHtml(s.arrive)}</p>`).join("")}`;
    } else if (kind === "attraction") {
      const learnMore = data.category === "ruins" ? `<a href="#/knowledge/ancient-lycia">More on Ancient Lycia &rarr;</a>` : "";
      bodyExtra = `<p class="poi-panel__category">${escapeHtml(data.category)}</p><p>${escapeHtml(data.shortDescription ?? "")}</p>${learnMore ? `<p>${learnMore}</p>` : ""}`;
    } else if (kind === "hazard") {
      bodyExtra = `<p><a href="#/knowledge/route-decisions">More on route decisions &rarr;</a> &middot; <a href="#/knowledge/safety">Safety notes &rarr;</a></p>`;
    } else if (kind === "gpx") {
      status = "neutral";
      bodyExtra = `<p class="poi-panel__category">${escapeHtml(data.categoryLabel)}</p><p style="color:var(--text-dim);font-size:0.75rem;">Из GPX trekkingmania (2024) — может быть устаревшим.</p>`;
    }
    const sources = await Promise.all((data.sources ?? []).map((id) => getSourceById(id)));
    const anchor = coords ?? placeById.get(data.placeId)?.coordinates;

    poiPanelBody.innerHTML = `
      <div class="pill-row">${statusBadgeHtml(config, status ?? "neutral")}<span class="pill">${escapeHtml(KIND_LABEL[kind] ?? kind)}</span></div>
      <h3>${escapeHtml(data.name)}</h3>
      ${anchor ? trailPositionLine(anchor) : ""}
      ${bodyExtra}
      ${data.notes && kind !== "source" ? `<p>${escapeHtml(data.notes)}</p>` : ""}
      ${data.confidence ? `<p style="font-size:0.75rem;color:var(--text-dim);">Confidence: ${escapeHtml(data.confidence)}${data.lastVerified ? ` &middot; last verified ${escapeHtml(data.lastVerified)}` : ""}</p>` : ""}
      ${sources.filter(Boolean).length ? `<div class="section-title">Sources</div>${sources.filter(Boolean).map((s) => s.url
        ? `<p><a href="${s.url}" target="_blank" rel="noopener">${escapeHtml(s.title)}</a></p>`
        : `<p>${escapeHtml(s.title)}</p>`).join("")}` : ""}
      ${anchor ? mapsLinks(anchor, data.googleMapsUrl) : ""}
    `;
    poiPanel.hidden = false;
  }

  function closePoiPanel() { poiPanel.hidden = true; }
  poiCloseBtn.addEventListener("click", closePoiPanel);

  function drawFallback() {
    fallbackNote.textContent = "Упрощённая схема — карта не запустилась на этом устройстве.";
    fallbackNote.hidden = false;
    renderOfflineMap(wrap, { config, places, master, waterList, gpsPosition: getLastPosition() });
  }

  let mapApi = null;
  try {
    const { mountMapLibre } = await import("../lib/map.js");
    wrap.innerHTML = `<div id="maplibre-container" style="width:100%;height:100%;"></div>`;
    mapApi = await mountMapLibre(wrap.querySelector("#maplibre-container"), {
      config, places, routes, food, fuel, accommodation, transport, attractions, master, waterList, pois, transportLines,
    });
    mapApi.setOnPoiClick((poi) => {
      // In «Измерить» mode a marker tap is a measuring tap at that spot.
      if (measureOn && (poi.data.coordinates ?? placeById.get(poi.data.placeId)?.coordinates)) { onMeasureTap(poi.data.coordinates ?? placeById.get(poi.data.placeId).coordinates); return; }
      renderPoiPanel(poi);
    });
    if (mapApi.mode === "offline-map") {
      fallbackNote.textContent = "Офлайн: карта коридора ±2 км";
      fallbackNote.hidden = false;
    } else if (mapApi.mode === "offline-blank") {
      fallbackNote.innerHTML = `Офлайн — подложка не скачана. Трек и точки работают. <a href="#/knowledge">Скачать карту</a>`;
      fallbackNote.hidden = false;
    }
  } catch (e) {
    console.warn("MapLibre failed to load, falling back to the SVG corridor view", e);
    drawFallback();
  }

  // --- "Где я": GPS on demand ---
  const locateBtn = container.querySelector("#locate-btn");
  const gpsPanel = container.querySelector("#gps-panel");
  const offTrailBanner = container.querySelector("#offtrail-banner");
  let gpsOn = false;
  let centeredOnce = false;
  let measureOn = false; // «Измерить» mode (see below); hides the GPS panel while on

  function renderGpsPanel(position, error) {
    if (!gpsOn) { gpsPanel.hidden = true; offTrailBanner.hidden = true; return; }
    gpsPanel.hidden = measureOn;
    if (error && !position) {
      if (error.code === 1) {
        gpsPanel.innerHTML = `<button class="gps-panel__close" aria-label="Закрыть">&times;</button>${GEO_HELP}`;
      } else {
        gpsPanel.innerHTML = `<button class="gps-panel__close" aria-label="Закрыть">&times;</button><p>Не удаётся определить местоположение: ${escapeHtml(error.message)}. Выйдите на открытое место и подождите.</p>`;
      }
      gpsPanel.querySelector(".gps-panel__close").addEventListener("click", () => setGps(false));
      offTrailBanner.hidden = true;
      return;
    }
    if (!position) {
      gpsPanel.innerHTML = `<p>Ищем GPS…</p>`;
      return;
    }
    const loc = locate(master, [position.lon, position.lat]);
    const acc = `±${Math.round(position.accuracy ?? 0)} м`;
    if (!loc || loc.offTrailM > FAR_AWAY_M) {
      offTrailBanner.hidden = true;
      gpsPanel.innerHTML = `<p><strong>Вы далеко от маршрута</strong> — ${formatKm(loc?.offTrailM ?? 0)} км до тропы. <span class="gps-panel__acc">${acc}</span></p>`;
      return;
    }
    offTrailBanner.hidden = loc.offTrailM <= OFF_TRAIL_M;
    offTrailBanner.textContent = `Вы в ${Math.round(loc.offTrailM)} м от тропы`;
    const day = loc.day ?? master.days.at(-1);
    const toFinish = Math.max(0, day.endM - loc.alongM);
    const route = routeByDay.get(day.dayId);
    const src = nextWaterAhead(waterList, loc.alongM, "source");
    const buy = nextWaterAhead(waterList, loc.alongM, "buy");
    gpsPanel.innerHTML = `
      <div class="gps-panel__row"><span>До финиша дня${route ? ` (${escapeHtml(day.to)})` : ""}</span><strong>${formatDist(toFinish)}</strong></div>
      <div class="gps-panel__row"><span>💧 Источник впереди${src ? ` — ${escapeHtml(src.name)}` : ""}</span><strong>${src ? formatDist(src.alongM - loc.alongM) : "—"}</strong></div>
      <div class="gps-panel__row"><span>🛒 Купить воду${buy ? ` — ${escapeHtml(buy.name)}` : ""}</span><strong>${buy ? formatDist(buy.alongM - loc.alongM) : "—"}</strong></div>
      <div class="gps-panel__foot">по тропе &middot; точность ${acc}</div>
    `;
  }

  function setGps(on) {
    gpsOn = on;
    writePref(on);
    locateBtn.classList.toggle("map-round-btn--active", on);
    locateBtn.setAttribute("aria-pressed", String(on));
    if (on) {
      centeredOnce = false;
      startGps();
      renderGpsPanel(getLastPosition(), null);
    } else {
      stopGps();
      renderGpsPanel(null, null);
    }
  }

  locateBtn.addEventListener("click", () => {
    if (!gpsOn) { setGps(true); return; }
    const pos = getLastPosition();
    if (pos && mapApi) mapApi.flyTo([pos.lon, pos.lat]);
    else setGps(false);
  });

  subscribeGps(({ position, error }) => {
    if (!gpsOn) return;
    if (position && mapApi) {
      mapApi.setGpsPosition(position);
      if (!centeredOnce) { centeredOnce = true; mapApi.flyTo([position.lon, position.lat], 14); }
    }
    renderGpsPanel(position, error);
  });
  if (readPref()) setGps(true);


  // --- Слои ---
  const layersBtn = container.querySelector("#layers-btn");
  const layersMenu = container.querySelector("#layers-menu");
  layersBtn.addEventListener("click", () => {
    layersMenu.hidden = !layersMenu.hidden;
    layersBtn.setAttribute("aria-expanded", String(!layersMenu.hidden));
    layersMenu.querySelectorAll("[data-layer]").forEach((b) => { b.disabled = b.dataset.layer !== "map" && !navigator.onLine; });
  });
  layersMenu.querySelectorAll("[data-layer]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!mapApi) return;
      layersMenu.querySelectorAll("[data-layer]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      layersMenu.hidden = true;
      const mode = await mapApi.setLayer(btn.dataset.layer);
      if (mode.startsWith("offline") && btn.dataset.layer !== "map") {
        fallbackNote.textContent = "Нет интернета — показана офлайн-карта.";
        fallbackNote.hidden = false;
      }
    });
  });

  // --- Измерить A→Б по тропе ---
  const measureBtn = container.querySelector("#measure-btn");
  const measurePanel = container.querySelector("#measure-panel");
  const SNAP_M = 300;
  let ptA = null, ptB = null, waitingGpsForA = false;

  function slice(fromM, toM) {
    const { coords, ele, cum } = master;
    const eleAt = (m) => {
      let i = cum.findIndex((c) => c >= m);
      if (i <= 0) return ele[0];
      const t = (m - cum[i - 1]) / Math.max(1, cum[i] - cum[i - 1]);
      return ele[i - 1] + t * (ele[i] - ele[i - 1]);
    };
    const out = [[...pointAtDistance(coords, fromM), eleAt(fromM)]];
    for (let i = 0; i < coords.length; i++) if (cum[i] > fromM && cum[i] < toM) out.push([coords[i][0], coords[i][1], ele[i]]);
    out.push([...pointAtDistance(coords, toM), eleAt(toM)]);
    return out;
  }

  function appLinks([lon, lat]) {
    return `<div class="link-row">
      <span style="font-size:0.72rem;color:var(--text-dim);align-self:center;">Открыть Б в:</span>
      <a class="btn btn-secondary" href="om://map?ll=${lat},${lon}&n=1">Organic Maps</a>
      <a class="btn btn-secondary" href="mapsme://map?ll=${lat},${lon}&n=1">maps.me</a>
      <a class="btn btn-secondary" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}">Google Maps</a>
    </div>
    <p class="gps-panel__foot">Только по нашему треку. Маршрут вне тропы не прокладывается — для этого откройте точку в приложении (нужен интернет или офлайн-карты в приложении).</p>`;
  }

  function renderMeasure(msg) {
    if (!measureOn) { measurePanel.hidden = true; return; }
    measurePanel.hidden = false;
    gpsPanel.hidden = true;
    const head = `<button class="gps-panel__close" id="measure-close" aria-label="Закрыть">&times;</button><strong>Измерить по тропе</strong>`;
    const actions = `<div class="link-row"><button class="btn btn-secondary" id="measure-from-me">📍 От меня</button><button class="btn btn-secondary" id="measure-reset">Сбросить</button></div>`;
    let body;
    if (msg) body = `<p>${msg}</p>`;
    else if (!ptA) body = `<p>Тапните точку A на треке — или «От меня».</p>`;
    else if (!ptB) body = `<p>A: ${formatKm(ptA.alongM)} км по тропе${ptA.fromMe ? " (вы)" : ""}. Теперь тапните точку Б.</p>`;
    else {
      const forward = ptB.alongM >= ptA.alongM;
      let seg = slice(Math.min(ptA.alongM, ptB.alongM), Math.max(ptA.alongM, ptB.alongM));
      if (!forward) seg = seg.reverse();
      const { ascentM, descentM } = climbOf(seg);
      const dist = Math.abs(ptB.alongM - ptA.alongM);
      body = `
        <div class="gps-panel__row"><span>Расстояние по тропе</span><strong>${formatDist(dist)}</strong></div>
        <div class="gps-panel__row"><span>Набор / сброс</span><strong>+${ascentM} / −${descentM} м</strong></div>
        <div class="gps-panel__row"><span>Время (оценка, формула Тоблера)</span><strong>≈ ${formatHours(toblerHours(seg))}</strong></div>
        ${profileSvg(seg, { height: 70 })}
        ${appLinks(ptB.point)}`;
    }
    measurePanel.innerHTML = `${head}${body}${actions}`;
    measurePanel.querySelector("#measure-close").addEventListener("click", () => setMeasure(false));
    measurePanel.querySelector("#measure-reset").addEventListener("click", () => { ptA = ptB = null; syncMeasure(); });
    measurePanel.querySelector("#measure-from-me").addEventListener("click", () => {
      const pos = getLastPosition();
      if (pos) { setAFromPosition(pos); return; }
      waitingGpsForA = true;
      if (!gpsOn) setGps(true);
      renderMeasure("Ждём GPS…");
    });
  }

  function syncMeasure(msg) {
    mapApi?.setMeasurePoints([ptA, ptB].filter(Boolean).map((p) => p.point));
    if (ptA && ptB) {
      mapApi?.setMeasureLine(slice(Math.min(ptA.alongM, ptB.alongM), Math.max(ptA.alongM, ptB.alongM)).map((c) => [c[0], c[1]]));
    } else {
      mapApi?.setMeasureLine(null);
    }
    renderMeasure(msg);
  }

  function setAFromPosition(pos) {
    waitingGpsForA = false;
    const loc = locate(master, [pos.lon, pos.lat]);
    if (!loc || loc.offTrailM > SNAP_M) { syncMeasure(`Вы в ${formatDist(loc?.offTrailM ?? 0)} от тропы — «От меня» работает только рядом с треком.`); return; }
    ptA = { alongM: loc.alongM, point: loc.point, fromMe: true };
    ptB = null;
    syncMeasure();
  }

  function setMeasure(on) {
    measureOn = on;
    measureBtn.classList.toggle("map-round-btn--active", on);
    measureBtn.setAttribute("aria-pressed", String(on));
    container.querySelector(".map-screen").classList.toggle("map-screen--measuring", on);
    if (!on) { ptA = ptB = null; waitingGpsForA = false; syncMeasure(); renderGpsPanel(getLastPosition(), null); return; }
    closePoiPanel();
    syncMeasure();
  }
  measureBtn.addEventListener("click", () => setMeasure(!measureOn));

  mapApi?.setOnMapClick((lngLat) => { if (measureOn) onMeasureTap(lngLat); });
  function onMeasureTap(lngLat) {
    const loc = locate(master, lngLat);
    if (!loc || loc.offTrailM > SNAP_M) { renderMeasure(`Тапните ближе к треку (сейчас ${formatDist(loc?.offTrailM ?? 0)} от него).`); return; }
    const pt = { alongM: loc.alongM, point: loc.point };
    if (!ptA || (ptA && ptB)) { ptA = pt; ptB = null; } else { ptB = pt; }
    syncMeasure();
  }
  subscribeGps(({ position }) => { if (measureOn && waitingGpsForA && position) setAFromPosition(position); });

  // --- Только вода ---
  const waterBtn = container.querySelector("#water-only-btn");
  waterBtn.addEventListener("click", () => {
    const on = waterBtn.getAttribute("aria-pressed") !== "true";
    waterBtn.setAttribute("aria-pressed", String(on));
    waterBtn.classList.toggle("map-fab--active", on);
    mapApi?.setWaterOnly(on);
  });

  // --- GPX export ---
  container.querySelector("#gpx-btn").addEventListener("click", () => {
    downloadGpx(buildGpx({ trail, itinerary: days, routes, waterList, accommodation }));
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
