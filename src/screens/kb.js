import { listKnowledgeArticles, getKnowledgeArticle } from "../lib/data.js";
import { escapeHtml } from "../lib/status.js";

const CATEGORIES = [
  ["#/today", "Today", "What's happening right now, tasks, warnings"],
  ["#/itinerary", "Itinerary", "Day-by-day plan, 8–18 Oct"],
  ["#/water", "Water", "Water points and per-day refill planning"],
  ["#/resupply", "Resupply", "Food, shops, fuel"],
  ["#/sleep", "Sleep", "Camps and accommodation"],
  ["#/transport", "Transport", "Flights, dolmuş, ground transport"],
  ["#/places", "Places to see", "Attractions on or near the route"],
  ["#/emergency", "Emergency", "112, GPS, bailout info"],
];

export async function renderKb(container) {
  const slugs = await listKnowledgeArticles();
  const articles = await Promise.all(slugs.map((s) => getKnowledgeArticle(s).then((a) => [s, a])));

  container.innerHTML = `
    <div class="screen-pad">
      <div class="section-title">Trip</div>
      ${CATEGORIES.map(([href, label, desc]) => `
        <a href="${href}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${escapeHtml(label)}</h3>
          <p>${escapeHtml(desc)}</p>
        </a>
      `).join("")}

      <div class="section-title">Field guide</div>
      ${articles.map(([slug, a]) => `
        <a href="#/knowledge/${slug}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${escapeHtml(a.meta.title ?? slug)}</h3>
          <p>Confidence: ${escapeHtml(a.meta.confidence ?? "?")} &middot; last verified ${escapeHtml(a.meta.lastVerified ?? "?")}</p>
        </a>
      `).join("")}
    </div>
  `;
}
