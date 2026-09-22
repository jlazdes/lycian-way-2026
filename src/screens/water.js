import { getConfig, getWater } from "../lib/data.js";
import { statusBadgeHtml, waterVisualStatus, escapeHtml } from "../lib/status.js";

export async function renderWater(container) {
  const [config, water] = await Promise.all([getConfig(), getWater()]);
  const defaultCapacity = config.water.defaultCapacityLitersPerPerson;

  container.innerHTML = `
    <div class="screen-pad">
      <div class="section-title">Water points</div>
      ${water.waterPoints.length ? water.waterPoints.map((w) => `
        <div class="card">
          ${statusBadgeHtml(config, waterVisualStatus(w.status))}
          <strong>${escapeHtml(w.name)}</strong>
          <p>${escapeHtml(w.waterType)} &middot; status: ${escapeHtml(w.status)} &middot; treatment: ${escapeHtml(w.treatment)}</p>
          <p>Confidence: ${escapeHtml(w.confidence)} &middot; last verified ${escapeHtml(w.lastVerified)}</p>
          <p>${escapeHtml(w.notes)}</p>
        </div>
      `).join("") : `<p class="empty-state">No water points recorded yet.</p>`}

      <div class="section-title">Per-day water planning (capacity: ${defaultCapacity} L/person)</div>
      ${water.dayWaterPlans.length ? water.dayWaterPlans.map((p) => `
        <div class="card">
          <strong>${escapeHtml(p.dayId)}</strong>
          <p>Longest known gap: ${p.longestKnownGapKm != null ? p.longestKnownGapKm + " km" : "unknown"}</p>
          <p>Risk: ${escapeHtml(p.risk)}</p>
          <p>${escapeHtml(p.notes)}</p>
        </div>
      `).join("") : `<p class="empty-state">No per-day water plans recorded yet.</p>`}
    </div>
  `;
}
