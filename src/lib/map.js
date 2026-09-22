// MapLibre GL wrapper. Dynamically imported only by the Map screen, only when a
// tile provider is configured and the browser is online — see screens/map.js.

import { statusColor } from "./status.js";

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

export async function mountMapLibre(container, { config, places, water }) {
  const maplibregl = await import("maplibre-gl");
  await import("maplibre-gl/dist/maplibre-gl.css");

  // MapLibre's tile-parsing web worker isn't picked up by Vite's static asset
  // analysis (it's constructed from a dynamic URL internally), so without this
  // the map renders the base style but no vector tile data at all.
  maplibregl.setWorkerUrl(`${import.meta.env.BASE_URL}vendor/maplibre-gl-worker.mjs`);

  const bbox = config.map.boundingBox;
  const map = new maplibregl.Map({
    container,
    style: config.map.tileProvider.styleUrl,
    bounds: [[bbox.west, bbox.south], [bbox.east, bbox.north]],
    fitBoundsOptions: { padding: 24 },
    attributionControl: { compact: true },
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  map.addControl(new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }), "top-right");

  map.on("load", () => {
    for (const p of places) {
      const marker = new maplibregl.Marker({ element: dotMarker(statusColor(config, p.status)) })
        .setLngLat(p.coordinates)
        .setPopup(new maplibregl.Popup({ offset: 14, closeButton: false }).setText(p.name))
        .addTo(map);
      marker.getElement().style.cursor = "pointer";
    }
    for (const w of water?.waterPoints ?? []) {
      new maplibregl.Marker({ element: dotMarker("#4fc3f7", 10) })
        .setLngLat(w.coordinates)
        .setPopup(new maplibregl.Popup({ offset: 12, closeButton: false }).setText(`Water: ${w.name}`))
        .addTo(map);
    }
  });

  return map;
}
