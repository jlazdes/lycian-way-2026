import { getConfig, getFood, getFuel } from "../lib/data.js";
import { statusBadgeHtml, escapeHtml } from "../lib/status.js";

export async function renderResupply(container) {
  const [config, foods, fuel] = await Promise.all([getConfig(), getFood(), getFuel()]);
  container.innerHTML = `
    <div class="screen-pad">
      <div class="section-title">Food &amp; shops</div>
      ${foods.length ? foods.map((f) => `
        <div class="card">
          ${statusBadgeHtml(config, f.status)} <strong>${escapeHtml(f.name)}</strong>
          <p>${escapeHtml(f.category)} &middot; confidence: ${escapeHtml(f.confidence)}</p>
          <p>${escapeHtml(f.notes)}</p>
        </div>
      `).join("") : `<p class="empty-state">No food/shop records yet.</p>`}

      <div class="section-title">Fuel — ${escapeHtml(fuel.fuelType)}</div>
      ${fuel.sellers.length ? fuel.sellers.map((s) => `
        <div class="card">${statusBadgeHtml(config, s.status)} <strong>${escapeHtml(s.name)}</strong></div>
      `).join("") : `<p class="empty-state">No fuel sellers researched yet — pre-trip task. Seller existence and correct canister stock will be tracked separately once found.</p>`}
    </div>
  `;
}
