import { getConfig, getAccommodation } from "../lib/data.js";
import { statusBadgeHtml, escapeHtml, kbBackLink } from "../lib/status.js";

export async function renderSleep(container) {
  const [config, accommodations] = await Promise.all([getConfig(), getAccommodation()]);
  container.innerHTML = `
    <div class="screen-pad">
      ${kbBackLink()}
      <div class="section-title">Sleep</div>
      ${accommodations.length ? accommodations.map((a) => `
        <div class="card">
          ${statusBadgeHtml(config, a.status)} <strong>${escapeHtml(a.name)}</strong>
          <p>${escapeHtml(a.type)} &middot; ${escapeHtml(a.priceInfo)}</p>
          <p>Confidence: ${escapeHtml(a.confidence)} &middot; last verified ${escapeHtml(a.lastVerified)}</p>
          <p>${escapeHtml(a.notes)}</p>
        </div>
      `).join("") : `<p class="empty-state">Nothing recorded yet.</p>`}
    </div>
  `;
}
