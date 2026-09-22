import {
  getConfig, getItinerary, getDayById, getRouteById, getPlaceById,
  getAccommodation, getFood, getWater, getTransport,
} from "../lib/data.js";
import { statusBadgeHtml, escapeHtml, kbBackLink } from "../lib/status.js";

export async function renderItinerary(container) {
  const [config, days] = await Promise.all([getConfig(), getItinerary()]);
  container.innerHTML = `
    <div class="screen-pad">
      ${kbBackLink()}
      <div class="section-title">Itinerary</div>
      ${days.map((d) => `
        <a href="#/itinerary/${d.id}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <div class="pill-row"><span class="pill">${escapeHtml(d.date)}</span>${statusBadgeHtml(config, d.status)}</div>
          <h3>${escapeHtml(d.title)}</h3>
          <p>${escapeHtml(d.summary)}</p>
        </a>
      `).join("")}
    </div>
  `;
}

export async function renderDay(container, { dayId }) {
  const [config, day] = await Promise.all([getConfig(), getDayById(dayId)]);
  if (!day) {
    container.innerHTML = `<div class="screen-pad"><p>Day not found.</p></div>`;
    return;
  }
  const [route, accomIds, foodAll, waterAll, transportAll] = await Promise.all([
    getRouteById(day.routeId),
    Promise.resolve(day.accommodationIds ?? []),
    getFood(),
    getWater(),
    getTransport(),
  ]);
  const accommodations = (await getAccommodation()).filter((a) => day.accommodationIds?.includes(a.id));
  const foods = foodAll.filter((f) => day.foodIds?.includes(f.id));
  const waters = waterAll.waterPoints.filter((w) => day.waterIds?.includes(w.id));
  const transports = transportAll.filter((t) => day.transportIds?.includes(t.id));

  let fromPlace = null, toPlace = null;
  if (route) {
    [fromPlace, toPlace] = await Promise.all([getPlaceById(route.fromPlaceId), getPlaceById(route.toPlaceId)]);
  }

  container.innerHTML = `
    <div class="screen-pad">
      <a href="#/itinerary" class="btn-secondary btn" style="margin-bottom:12px;display:inline-block;">&larr; All days</a>
      <div class="pill-row"><span class="pill">${escapeHtml(day.date)}</span>${statusBadgeHtml(config, day.status)}</div>
      <h2 style="margin:6px 0;">${escapeHtml(day.title)}</h2>
      <p>${escapeHtml(day.summary)}</p>

      ${route ? `
        <div class="card">
          <h3>Route</h3>
          <p>${fromPlace ? escapeHtml(fromPlace.name) : "?"} &rarr; ${toPlace ? escapeHtml(toPlace.name) : "?"}</p>
          ${route.metrics.map((m) => `<p>${m.distanceKm} km &middot; +${m.ascentM} m &middot; source: ${escapeHtml(m.source)} (${escapeHtml(m.date)})</p>`).join("")}
          ${route.variants?.length ? route.variants.map((v) => `
            <p>${statusBadgeHtml(config, v.status)} <strong>${escapeHtml(v.name)}</strong> — ${escapeHtml(v.notes)}</p>
          `).join("") : ""}
          ${route.notes ? `<p><em>${escapeHtml(route.notes)}</em></p>` : ""}
        </div>
      ` : ""}

      ${day.tasks?.length ? `<div class="section-title">Tasks</div><div class="card"><ul>${day.tasks.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul></div>` : ""}
      ${day.preTripTasks?.length ? `<div class="section-title">Pre-trip tasks</div><div class="card"><ul>${day.preTripTasks.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul></div>` : ""}

      ${waters.length ? `<div class="section-title">Water</div>${waters.map((w) => `
        <div class="card"><h3>${escapeHtml(w.name)}</h3><p>${escapeHtml(w.waterType)} &middot; ${escapeHtml(w.status)} &middot; ${escapeHtml(w.treatment)}</p><p>${escapeHtml(w.notes)}</p></div>
      `).join("")}` : ""}

      ${foods.length ? `<div class="section-title">Food</div>${foods.map((f) => `
        <div class="card">${statusBadgeHtml(config, f.status)} <strong>${escapeHtml(f.name)}</strong> <p>${escapeHtml(f.notes)}</p></div>
      `).join("")}` : ""}

      ${accommodations.length ? `<div class="section-title">Sleep</div>${accommodations.map((a) => `
        <div class="card">${statusBadgeHtml(config, a.status)} <strong>${escapeHtml(a.name)}</strong><p>${escapeHtml(a.priceInfo)}</p><p>${escapeHtml(a.notes)}</p></div>
      `).join("")}` : ""}

      ${transports.length ? `<div class="section-title">Transport</div>${transports.map((t) => `
        <div class="card">${statusBadgeHtml(config, t.status)} <strong>${escapeHtml(t.name)}</strong><p>${escapeHtml(t.notes)}</p></div>
      `).join("")}` : ""}

      ${day.highlights?.length ? `<div class="section-title">Highlights</div><div class="card"><ul>${day.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul></div>` : ""}
      ${day.watchOut?.length ? `<div class="section-title">Watch out</div><ul class="warn-list">${day.watchOut.map((w) => `<li>${escapeHtml(w)}</li>`).join("")}</ul>` : ""}
      ${day.backupPlan ? `<div class="section-title">Backup plan</div><div class="card">${escapeHtml(day.backupPlan)}</div>` : ""}
      ${day.notes ? `<p style="color:var(--text-dim);font-size:0.8rem;">${escapeHtml(day.notes)}</p>` : ""}
    </div>
  `;
}
