import "./style.css";
import { registerServiceWorker } from "./lib/offline.js";
import { registerRoute, startRouter } from "./lib/router.js";

import { renderToday } from "./screens/today.js";
import { renderMap } from "./screens/map.js";
import { renderItinerary, renderDay } from "./screens/itinerary.js";
import { renderWater } from "./screens/water.js";
import { renderResupply } from "./screens/resupply.js";
import { renderSleep } from "./screens/sleep.js";
import { renderTransport } from "./screens/transport.js";
import { renderPlaces } from "./screens/places.js";
import { renderKnowledgeList, renderKnowledgeArticle } from "./screens/knowledge.js";
import { renderEmergency } from "./screens/emergency.js";

const NAV = [
  ["#/today", "Today"],
  ["#/map", "Map"],
  ["#/itinerary", "Itinerary"],
  ["#/water", "Water"],
  ["#/resupply", "Resupply"],
  ["#/sleep", "Sleep"],
  ["#/transport", "Transport"],
  ["#/places", "Places"],
  ["#/knowledge", "Knowledge"],
  ["#/emergency", "Emergency"],
];

document.getElementById("app").innerHTML = `
  <header class="app-header">
    <h1>Lycian Way 2026</h1>
    <p class="subtitle">8&ndash;18 Oct &middot; Julia, Aziza, Artem</p>
  </header>
  <div id="screen"></div>
  <nav class="nav">
    ${NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
  </nav>
`;

registerRoute("#/today", renderToday);
registerRoute("#/map", renderMap);
registerRoute("#/itinerary", renderItinerary);
registerRoute("#/itinerary/:dayId", renderDay);
registerRoute("#/water", renderWater);
registerRoute("#/resupply", renderResupply);
registerRoute("#/sleep", renderSleep);
registerRoute("#/transport", renderTransport);
registerRoute("#/places", renderPlaces);
registerRoute("#/knowledge", renderKnowledgeList);
registerRoute("#/knowledge/:slug", renderKnowledgeArticle);
registerRoute("#/emergency", renderEmergency);

registerServiceWorker();
startRouter();
