import "./style.css";
import { L, lang, setLang } from "./lib/i18n.js";
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
      <button class="segmented__btn" data-view="map" role="tab">${L("Map", "Карта")}</button>
      <button class="segmented__btn" data-view="kb" role="tab">${L("Knowledge Base", "База знаний")}</button>
    </div>
    <div class="lang">
      <button class="lang__btn" id="lang-btn" aria-label="${L("Language", "Язык")}" aria-expanded="false">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-2.95a15.7 15.7 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.9 8ZM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96ZM4.26 14a8.2 8.2 0 0 1 0-4h3.38a16.5 16.5 0 0 0 0 4H4.26Zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.99 7.99 0 0 1 5.08 16Zm2.95-8H5.08a7.99 7.99 0 0 1 4.33-3.56A15.7 15.7 0 0 0 8.03 8ZM12 19.96A14.1 14.1 0 0 1 10.09 16h3.82A14.1 14.1 0 0 1 12 19.96ZM14.34 14H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4Zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56ZM16.36 14a16.5 16.5 0 0 0 0-4h3.38a8.2 8.2 0 0 1 0 4h-3.38Z"/></svg>
        <span class="lang__code">${lang.toUpperCase()}</span>
      </button>
      <div class="lang__menu" id="lang-menu" hidden>
        <button data-lang="en" aria-pressed="${lang === "en"}">English</button>
        <button data-lang="ru" aria-pressed="${lang === "ru"}">Русский</button>
      </div>
    </div>
  </header>
  <div id="screen"></div>
`;

const langBtn = document.getElementById("lang-btn");
const langMenu = document.getElementById("lang-menu");
langBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  langMenu.hidden = !langMenu.hidden;
  langBtn.setAttribute("aria-expanded", String(!langMenu.hidden));
});
document.addEventListener("click", () => { langMenu.hidden = true; langBtn.setAttribute("aria-expanded", "false"); });
langMenu.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => { if (b.dataset.lang !== lang) setLang(b.dataset.lang); }));

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
