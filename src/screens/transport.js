import { getConfig, getTransport } from "../lib/data.js";
import { statusBadgeHtml, escapeHtml } from "../lib/status.js";

export async function renderTransport(container) {
  const [config, legs] = await Promise.all([getConfig(), getTransport()]);
  container.innerHTML = `
    <div class="screen-pad">
      <div class="section-title">Transport</div>
      ${legs.map((t) => `
        <div class="card">
          ${statusBadgeHtml(config, t.status)} <strong>${escapeHtml(t.name)}</strong>
          ${t.date ? `<p>${escapeHtml(t.date)}</p>` : ""}
          <p>Confidence: ${escapeHtml(t.confidence)}${t.lastVerified ? ` &middot; last verified ${escapeHtml(t.lastVerified)}` : ""}</p>
          <p>${escapeHtml(t.notes)}</p>
        </div>
      `).join("")}
    </div>
  `;
}
