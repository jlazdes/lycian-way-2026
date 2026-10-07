// MapLibre GL wrapper. Dynamically imported by the Map screen.
// Basemap choice (resolveStyle):
//   online  -> the configured online style (OpenFreeMap; never bulk-cached)
//   offline -> our self-hosted Protomaps corridor extract if it was downloaded,
//              otherwise a plain background (trail + markers still work).

import { statusColor } from "./status.js";
import { totalLength, pointAtDistance, splitPolylineAtDistance } from "./geo.js";
import { getStoredProgressMeters, updateProgress } from "./progress.js";
import { buildMarkerGroups } from "./mapMarkers.js";
import { getCachedPmtilesFile, offlineAssetBase } from "./offline.js";

const DEMO_DURATION_MS = 20000;
const GENERATED_MIN_ZOOM = 12;

const BLANK_STYLE = {
  version: 8,
  sources: {},
  layers: [{ id: "background", type: "background", paint: { "background-color": "#dfe6dc" } }],
};

const SATELLITE_STYLE = {
  version: 8,
  sources: {
    esri: {
      type: "raster", tileSize: 256, maxzoom: 18,
      tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
      attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
    },
  },
  layers: [{ id: "esri", type: "raster", source: "esri" }],
};

const TOPO_STYLE = {
  version: 8,
  sources: {
    topo: {
      type: "raster", tileSize: 256, maxzoom: 17,
      tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"],
      attribution: "© Esri, HERE, Garmin, USGS, NGA, OpenStreetMap contributors",
    },
  },
  layers: [{ id: "topo", type: "raster", source: "topo" }],
};

async function fetchWithTimeout(url, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

async function offlineStyle(maplibregl) {
  const file = await getCachedPmtilesFile();
  if (!file) return { style: BLANK_STYLE, mode: "offline-blank" };
  const [{ Protocol, PMTiles, FileSource }, { layers, namedFlavor }] = await Promise.all([import("pmtiles"), import("@protomaps/basemaps")]);
  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  protocol.add(new PMTiles(new FileSource(file)));
  const base = offlineAssetBase();
  return {
    mode: "offline-map",
    style: {
      version: 8,
      glyphs: `${base}fonts/{fontstack}/{range}.pbf`,
      sprite: `${base}sprites/light`,
      sources: {
        protomaps: { type: "vector", url: "pmtiles://corridor.pmtiles", attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://protomaps.com">Protomaps</a>' },
      },
      layers: layers("protomaps", namedFlavor("light"), { lang: "en" }),
    },
  };
}

export async function resolveStyle(maplibregl, config, layer = "map") {
  if (navigator.onLine) {
    if (layer === "satellite") return { style: SATELLITE_STYLE, mode: "online-satellite" };
    if (layer === "topo") return { style: TOPO_STYLE, mode: "online-topo" };
    try {
      return { style: await fetchWithTimeout(config.map.tileProvider.styleUrl, 5000), mode: "online" };
    } catch {
      // fall through to offline
    }
  }
  return offlineStyle(maplibregl);
}

function dotMarker(color, size = 14) {
  const el = document.createElement("div");
  el.className = "map-dot-marker";
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.background = color;
  return el;
}

function iconMarker(icon, color) {
  const el = document.createElement("div");
  el.className = "map-icon-marker";
  el.style.background = color;
  el.textContent = icon;
  return el;
}

function gpsMarkerElement(config) {
  const wrap = document.createElement("div");
  wrap.className = "gps-live-marker";
  wrap.innerHTML = `
    <div class="gps-live-marker__pulse"></div>
    <div class="gps-live-marker__heading"></div>
    <div class="gps-live-marker__dot"></div>
  `;
  wrap.style.setProperty("--gps-color", config.gps?.markerColor ?? "#1A73E8");
  return wrap;
}

function circlePolygon([lon, lat], radiusMeters, points = 48) {
  const coords = [];
  const latRad = (lat * Math.PI) / 180;
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    coords.push([lon + (radiusMeters * Math.cos(angle)) / (111320 * Math.cos(latRad)), lat + (radiusMeters * Math.sin(angle)) / 110540]);
  }
  return { type: "Polygon", coordinates: [coords] };
}

const lineFeature = (coords, properties = {}) => ({ type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties });
const emptyFC = () => ({ type: "FeatureCollection", features: [] });

export async function mountMapLibre(container, ctx) {
  const { config, places, master, transportLines } = ctx;
  const maplibregl = await import("maplibre-gl");
  await import("maplibre-gl/dist/maplibre-gl.css");
  maplibregl.setWorkerUrl(`${import.meta.env.BASE_URL}vendor/maplibre-gl-worker.mjs`);

  const bbox = config.map.boundingBox;
  const untraveledColor = config.routeProgress?.untraveled ?? "#AAAAAA";
  const traveledColor = config.routeProgress?.traveled ?? "#00FF80";
  const masterTrail = master.coords;
  const masterLen = totalLength(masterTrail);

  const { style, mode } = await resolveStyle(maplibregl, config, ctx.layer ?? "map");
  const trailBounds = masterTrail.reduce((b, [lon, lat]) => [[Math.min(b[0][0], lon), Math.min(b[0][1], lat)], [Math.max(b[1][0], lon), Math.max(b[1][1], lat)]], [[180, 90], [-180, -90]]);

  const map = new maplibregl.Map({
    container,
    style,
    bounds: masterTrail.length ? trailBounds : [[bbox.west, bbox.south], [bbox.east, bbox.north]],
    fitBoundsOptions: { padding: 40 },
    attributionControl: { compact: true },
    maxZoom: 18,
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

  let poiClickHandler = null;
  let mapClickHandler = null;
  let progressMeters = getStoredProgressMeters();
  let demoActive = false;
  let demoRaf = null;
  let gpsMarker = null;
  let waterOnly = false;
  const markerEls = [];

  function renderRouteSplit(atMeters) {
    if (!map.getSource("route-traveled")) return;
    const { before, after } = splitPolylineAtDistance(masterTrail, atMeters);
    map.getSource("route-traveled").setData(before.length >= 2 ? lineFeature(before) : emptyFC());
    map.getSource("route-untraveled").setData(after.length >= 2 ? lineFeature(after) : emptyFC());
  }

  function addOverlays() {
    // Transport legs (dolmuş) — dashed, clearly not trail.
    map.addSource("transport", { type: "geojson", data: { type: "FeatureCollection", features: transportLines.map((t) => lineFeature(t.coordinates, { id: t.id })) } });
    map.addLayer({
      id: "transport", type: "line", source: "transport",
      layout: { "line-cap": "round" },
      paint: { "line-color": "#8888FF", "line-width": 3, "line-dasharray": [1.5, 2], "line-opacity": 0.9 },
    });

    // Day boundaries — a light casing under the trail so the line reads on any basemap.
    map.addSource("route-casing", { type: "geojson", data: lineFeature(masterTrail) });
    map.addLayer({
      id: "route-casing", type: "line", source: "route-casing",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#0e1613", "line-width": 6, "line-opacity": 0.35 },
    });
    map.addSource("route-untraveled", { type: "geojson", data: emptyFC() });
    map.addLayer({
      id: "route-untraveled", type: "line", source: "route-untraveled",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": untraveledColor, "line-width": 4, "line-opacity": 0.95 },
    });
    map.addSource("route-traveled", { type: "geojson", data: emptyFC() });
    map.addLayer({
      id: "route-traveled", type: "line", source: "route-traveled",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": traveledColor, "line-width": 4 },
    });

    map.addSource("measure", { type: "geojson", data: emptyFC() });
    map.addLayer({
      id: "measure", type: "line", source: "measure",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#FF2D95", "line-width": 6, "line-opacity": 0.9 },
    });

    map.addSource("gps-accuracy", { type: "geojson", data: emptyFC() });
    map.addLayer({
      id: "gps-accuracy", type: "fill", source: "gps-accuracy",
      paint: { "fill-color": config.gps?.markerColor ?? "#1A73E8", "fill-opacity": 0.15 },
    });

    renderRouteSplit(progressMeters);
  }

  function addMarkers() {
    for (const m of buildMarkerGroups(ctx)) {
      if (!m.coordinates) continue;
      const el = m.kind === "place" ? dotMarker(statusColor(config, m.data.status)) : iconMarker(m.icon, m.color);
      el.classList.add(`marker--${m.group}`);
      if (m.generated) el.classList.add("marker--generated");
      el.title = m.data.name ?? "";
      const marker = new maplibregl.Marker({ element: el }).setLngLat(m.coordinates).addTo(map);
      const domEl = marker.getElement();
      domEl.style.cursor = "pointer";
      domEl.addEventListener("click", (e) => {
        e.stopPropagation();
        poiClickHandler?.({ kind: m.kind, data: m.data });
      });
      markerEls.push(domEl);
    }
    applyVisibility();
  }

  function applyVisibility() {
    const z = map.getZoom();
    container.classList.toggle("map--low-zoom", z < GENERATED_MIN_ZOOM);
    container.classList.toggle("map--water-only", waterOnly);
  }

  map.on("load", () => {
    addOverlays();
    addMarkers();
  });
  map.on("zoomend", applyVisibility);
  map.on("click", (e) => mapClickHandler?.([e.lngLat.lng, e.lngLat.lat]));
  map.on("error", (e) => {
    // Missing tiles while offline are expected; keep them out of the console noise.
    if (mode.startsWith("offline")) return;
    console.warn("map error", e?.error?.message ?? e);
  });

  function setGpsPosition(position) {
    if (!position) return;
    if (!gpsMarker) {
      gpsMarker = new maplibregl.Marker({ element: gpsMarkerElement(config), anchor: "center" }).setLngLat([position.lon, position.lat]).addTo(map);
    }
    gpsMarker.setLngLat([position.lon, position.lat]);
    const headingEl = gpsMarker.getElement().querySelector(".gps-live-marker__heading");
    if (headingEl) {
      if (typeof position.heading === "number") {
        headingEl.style.opacity = "1";
        headingEl.style.transform = `translateX(-50%) rotate(${position.heading}deg)`;
      } else {
        headingEl.style.opacity = "0";
      }
    }
    map.getSource("gps-accuracy")?.setData({ type: "Feature", geometry: circlePolygon([position.lon, position.lat], position.accuracy ?? 20), properties: {} });
    if (!demoActive && masterTrail.length >= 2) {
      progressMeters = updateProgress([position.lon, position.lat], masterTrail);
      renderRouteSplit(progressMeters);
    }
  }

  function playDemo(onEnd) {
    if (demoActive || masterTrail.length < 2) return;
    demoActive = true;
    const start = performance.now();
    let demoMarker = gpsMarker;
    if (!demoMarker) {
      demoMarker = new maplibregl.Marker({ element: gpsMarkerElement(config), anchor: "center" }).setLngLat(masterTrail[0]).addTo(map);
      gpsMarker = demoMarker;
    }
    function frame(now) {
      const t = Math.min(1, (now - start) / DEMO_DURATION_MS);
      const dist = t * masterLen;
      demoMarker.setLngLat(pointAtDistance(masterTrail, dist));
      renderRouteSplit(dist);
      if (t < 1 && demoActive) {
        demoRaf = requestAnimationFrame(frame);
      } else {
        demoActive = false;
        renderRouteSplit(getStoredProgressMeters());
        onEnd?.();
      }
    }
    demoRaf = requestAnimationFrame(frame);
  }

  function stopDemo() {
    if (demoRaf) cancelAnimationFrame(demoRaf);
    demoActive = false;
    renderRouteSplit(getStoredProgressMeters());
  }

  function fitCoords(coords, padding = 60) {
    if (!coords.length) return;
    const b = coords.reduce((acc, [lon, lat]) => [[Math.min(acc[0][0], lon), Math.min(acc[0][1], lat)], [Math.max(acc[1][0], lon), Math.max(acc[1][1], lat)]], [[180, 90], [-180, -90]]);
    map.fitBounds(b, { padding, maxZoom: 15 });
  }

  return {
    map,
    mode,
    setOnPoiClick(fn) { poiClickHandler = fn; },
    setOnMapClick(fn) { mapClickHandler = fn; },
    setGpsPosition,
    playDemo,
    stopDemo,
    fitCoords,
    flyTo(lngLat, zoom = 15) { map.flyTo({ center: lngLat, zoom: Math.max(map.getZoom(), zoom) }); },
    setWaterOnly(v) { waterOnly = v; applyVisibility(); },
    setMeasureLine(coords) { map.getSource("measure")?.setData(coords?.length >= 2 ? lineFeature(coords) : emptyFC()); },
    get isDemoActive() { return demoActive; },
  };
}
