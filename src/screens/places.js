import { getConfig, getAttractions } from "../lib/data.js";
import { statusBadgeHtml, escapeHtml } from "../lib/status.js";

export async function renderPlaces(container) {
  const [config, attractions] = await Promise.all([getConfig(), getAttractions()]);
  container.innerHTML = `
    <div class="screen-pad">
      <div class="section-title">Places to see</div>
      ${attractions.map((a) => `
        <div class="card">
          ${statusBadgeHtml(config, a.status)} <strong>${escapeHtml(a.name)}</strong>
          <p>${escapeHtml(a.shortDescription)}</p>
          <p style="font-size:0.75rem;">${escapeHtml(a.routeDistanceNote)}</p>
          <div class="link-row">
            <a class="btn btn-secondary" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.name)}">Open in Google Maps</a>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}
