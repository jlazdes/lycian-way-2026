// MapLibre GL wrapper. Dynamically imported only by the Map screen, only when a
// tile provider is configured and the browser is online — see screens/map.js.

import { statusColor } from "./status.js";
import { getDisplaySegments, buildMasterTrail } from "./routeGeometry.js";
import { totalLength, pointAtDistance, splitPolylineAtDistance } from "./geo.js";
import { getStoredProgressMeters, updateProgress } from "./progress.js";

const DEMO_DURATION_MS = 20000;

function dotMarker(color, size = 14) {
  const el = document.createElement("div");
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = "50%";
  el.style.background = color;
  el.style.border = "2px solid #0e1613";
  el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.4)";
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
    const dx = (radiusMeters * Math.cos(angle)) / (111320 * Math.cos(latRad));
    const dy = (radiusMeters * Math.sin(angle)) / 110540;
    coords.push([lon + dx, lat + dy]);
  }
  return { type: "Polygon", coordinates: [coords] };
}

function lineFeature(coords) {
  return { type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} };
}
function emptyFC() {
  return { type: "FeatureCollection", features: [] };
}

export async function mountMapLibre(container, { config, places, routes, water }) {
  const maplibregl = await import("maplibre-gl");
  await import("maplibre-gl/dist/maplibre-gl.css");

  maplibregl.setWorkerUrl(`${import.meta.env.BASE_URL}vendor/maplibre-gl-worker.mjs`);

  const bbox = config.map.boundingBox;
  const placeById = new Map(places.map((p) => [p.id, p]));
  const dashedColor = config.routeProgress?.untraveled ?? "#AAAAAA";
  const untraveledColor = config.routeProgress?.untraveled ?? "#AAAAAA";
  const traveledColor = config.routeProgress?.traveled ?? "#00FF80";

  // Precompute per-route solid/dashed display segments and the concatenated master trail.
  const dashedSegments = [];
  for (const r of routes) {
    const { dashed } = getDisplaySegments(r, placeById);
    if (dashed.length >= 2) dashedSegments.push(dashed);
  }
  const masterTrail = buildMasterTrail(routes, placeById);
  const masterLen = totalLength(masterTrail);

  const map = new maplibregl.Map({
    container,
    style: config.map.tileProvider.styleUrl,
    bounds: [[bbox.west, bbox.south], [bbox.east, bbox.north]],
    fitBoundsOptions: { padding: 24 },
    attributionControl: { compact: true },
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

  let poiClickHandler = null;
  let progressMeters = getStoredProgressMeters();
  let demoActive = false;
  let demoRaf = null;
  let gpsMarker = null;
  let accuracySourceReady = false;

  function renderRouteSplit(atMeters) {
    if (!map.getSource("route-traveled")) return;
    const { before, after } = splitPolylineAtDistance(masterTrail, atMeters);
    map.getSource("route-traveled").setData(before.length >= 2 ? lineFeature(before) : emptyFC());
    map.getSource("route-untraveled").setData(after.length >= 2 ? lineFeature(after) : emptyFC());
  }

  map.on("load", () => {
    map.addSource("route-dashed", { type: "geojson", data: { type: "FeatureCollection", features: dashedSegments.map(lineFeature) } });
    map.addLayer({
      id: "route-dashed", type: "line", source: "route-dashed",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": dashedColor, "line-width": 3, "line-dasharray": [1, 1.6], "line-opacity": 0.85 },
    });

    map.addSource("route-untraveled", { type: "geojson", data: emptyFC() });
    map.addLayer({
      id: "route-untraveled", type: "line", source: "route-untraveled",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": untraveledColor, "line-width": 4, "line-opacity": 0.9 },
    });

    map.addSource("route-traveled", { type: "geojson", data: emptyFC() });
    map.addLayer({
      id: "route-traveled", type: "line", source: "route-traveled",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": traveledColor, "line-width": 4 },
    });

    map.addSource("gps-accuracy", { type: "geojson", data: emptyFC() });
    map.addLayer({
      id: "gps-accuracy", type: "fill", source: "gps-accuracy",
      paint: { "fill-color": config.gps?.markerColor ?? "#1A73E8", "fill-opacity": 0.15 },
    });
    accuracySourceReady = true;

    renderRouteSplit(progressMeters);

    for (const p of places) {
      const marker = new maplibregl.Marker({ element: dotMarker(statusColor(config, p.status)) })
        .setLngLat(p.coordinates)
        .addTo(map);
      const el = marker.getElement();
      el.style.cursor = "pointer";
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        poiClickHandler?.({ kind: "place", data: p });
      });
    }
    for (const w of water?.waterPoints ?? []) {
      const marker = new maplibregl.Marker({ element: dotMarker("#00A3FF", 10) }).setLngLat(w.coordinates).addTo(map);
      const el = marker.getElement();
      el.style.cursor = "pointer";
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        poiClickHandler?.({ kind: "water", data: w });
      });
    }
  });

  function setGpsPosition(position) {
    if (!position) return;
    if (!gpsMarker) {
      gpsMarker = new (maplibregl.Marker)({ element: gpsMarkerElement(config), anchor: "center" });
      gpsMarker.setLngLat([position.lon, position.lat]).addTo(map);
    }
    gpsMarker.setLngLat([position.lon, position.lat]);
    const headingEl = gpsMarker.getElement().querySelector(".gps-live-marker__heading");
    if (headingEl) {
      if (typeof position.heading === "number") {
        headingEl.style.opacity = "1";
        headingEl.style.transform = `rotate(${position.heading}deg)`;
      } else {
        headingEl.style.opacity = "0";
      }
    }
    if (accuracySourceReady && map.getSource("gps-accuracy")) {
      map.getSource("gps-accuracy").setData({
        type: "Feature",
        geometry: circlePolygon([position.lon, position.lat], position.accuracy ?? 20),
        properties: {},
      });
    }
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
      demoMarker = new (maplibregl.Marker)({ element: gpsMarkerElement(config), anchor: "center" });
      demoMarker.setLngLat(masterTrail[0]).addTo(map);
      gpsMarker = demoMarker;
    }
    function frame(now) {
      const t = Math.min(1, (now - start) / DEMO_DURATION_MS);
      const dist = t * masterLen;
      const pt = pointAtDistance(masterTrail, dist);
      demoMarker.setLngLat(pt);
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

  return {
    map,
    setOnPoiClick(fn) { poiClickHandler = fn; },
    setGpsPosition,
    playDemo,
    stopDemo,
    get isDemoActive() { return demoActive; },
  };
}
