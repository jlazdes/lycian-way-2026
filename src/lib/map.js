// MapLibre GL wrapper. Dynamically imported only by the Map screen, only when a
// tile provider is configured and the browser is online — see screens/map.js.

export async function mountMapLibre(container, { config, places }) {
  const maplibregl = (await import("maplibre-gl")).default;
  await import("maplibre-gl/dist/maplibre-gl.css");

  const bbox = config.map.boundingBox;
  const map = new maplibregl.Map({
    container,
    style: config.map.tileProvider.styleUrl,
    bounds: [[bbox.west, bbox.south], [bbox.east, bbox.north]],
    attributionControl: true,
  });
  map.addControl(new maplibregl.NavigationControl(), "top-right");

  map.on("load", () => {
    for (const p of places) {
      new maplibregl.Marker({ color: "#7fb3a3" })
        .setLngLat(p.coordinates)
        .setPopup(new maplibregl.Popup({ offset: 12 }).setText(p.name))
        .addTo(map);
    }
  });

  return map;
}
