import "./style.css";
import { registerServiceWorker } from "./lib/offline.js";
import { registerRoute, onRouteChange, startRouter } from "./lib/router.js";

import { renderMap } from "./screens/map.js";
import { renderItinerary, renderDay } from "./screens/itinerary.js";
import { renderKb } from "./screens/kb.js";
import { renderKnowledgeArticle } from "./screens/knowledge.js";
import { renderEmergency } from "./screens/emergency.js";

document.getElementById("app").innerHTML = `
  <header class="app-header">
    <div class="app-header__brand">Lycian Way 2026</div>
    <div class="segmented" role="tablist">
      <button class="segmented__btn" data-view="map" role="tab">Map</button>
      <button class="segmented__btn" data-view="kb" role="tab">Knowledge Base</button>
    </div>
  </header>
  <div id="screen"></div>
`;

registerRoute("#/map", renderMap);
registerRoute("#/itinerary", renderItinerary);
registerRoute("#/itinerary/:dayId", renderDay);
registerRoute("#/knowledge", renderKb);
registerRoute("#/knowledge/:slug", renderKnowledgeArticle);
registerRoute("#/emergency", renderEmergency);

const segButtons = document.querySelectorAll(".segmented__btn");
segButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    location.hash = btn.dataset.view === "map" ? "#/map" : "#/knowledge";
  });
});

onRouteChange((hash) => {
  const isMap = hash === "#/map" || hash === "";
  document.getElementById("screen").classList.toggle("screen--full-bleed", isMap);
  segButtons.forEach((btn) => btn.classList.toggle("segmented__btn--active", (btn.dataset.view === "map") === isMap));
});

registerServiceWorker();
startRouter();
