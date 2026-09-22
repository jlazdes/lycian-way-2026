import { getConfig, getItinerary, getRouteById, getAlerts } from "../lib/data.js";
import { statusBadgeHtml, escapeHtml } from "../lib/status.js";
import { saveForOffline, isSavedForOffline } from "../lib/offline.js";
import { subscribeGps, startGps } from "../lib/gps.js";

function todaysDay(days, config) {
  const today = new Date().toISOString().slice(0, 10);
  const start = config.trip.startDate;
  const end = config.trip.endDate;
  if (today < start) return days[0];
  if (today > end) return days[days.length - 1];
  return days.find((d) => d.date === today) ?? days[0];
}

export async function renderToday(container) {
  const [config, days, alerts] = await Promise.all([getConfig(), getItinerary(), getAlerts()]);
  const day = todaysDay(days, config);
  const route = await getRouteById(day.routeId);
  const saved = await isSavedForOffline();

  container.innerHTML = `
    <div class="screen-pad">
      <div class="card">
        <div class="pill-row"><span class="pill">${escapeHtml(day.date)}</span>${statusBadgeHtml(config, day.status)}</div>
        <h3>${escapeHtml(day.title)}</h3>
        <p>${escapeHtml(day.summary)}</p>
        ${route ? `<p>${route.metrics[0]?.distanceKm ?? "?"} km &middot; +${route.metrics[0]?.ascentM ?? "?"} m ascent (source: ${escapeHtml(route.metrics[0]?.source ?? "unknown")})</p>` : ""}
        ${day.tasks?.length ? `<div class="section-title">Tasks</div><ul class="warn-list" style="color:var(--text-dim)">${day.tasks.map((t) => `<li style="color:var(--text-dim)">${escapeHtml(t)}</li>`).join("")}</ul>` : ""}
        ${day.watchOut?.length ? `<div class="section-title">Watch out</div><ul class="warn-list">${day.watchOut.map((w) => `<li>${escapeHtml(w)}</li>`).join("")}</ul>` : ""}
        <div class="link-row">
          <a class="btn btn-secondary" href="#/itinerary/${day.id}">Full day view</a>
        </div>
      </div>

      ${alerts.length ? `
        <div class="section-title">Active warnings</div>
        ${alerts.map((a) => `
          <div class="card">
            ${statusBadgeHtml(config, a.status)} <strong>${escapeHtml(a.title)}</strong>
            <p>${escapeHtml(a.description)}</p>
          </div>
        `).join("")}
      ` : ""}

      <div class="section-title">GPS</div>
      <div class="card" id="today-gps">
        <p>Requesting location…</p>
      </div>

      <div class="section-title">Offline</div>
      <div class="card">
        <p id="offline-status">${saved ? "Trip data is saved for offline use." : "Trip data is not yet saved for offline use."}</p>
        <button class="btn" id="save-offline-btn">Save for offline</button>
      </div>
    </div>
  `;

  const gpsBox = container.querySelector("#today-gps");
  subscribeGps(({ position, error }) => {
    if (position) {
      gpsBox.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="gps-marker"></div>
          <div>
            <p style="margin:0">${position.lat.toFixed(5)}, ${position.lon.toFixed(5)}</p>
            <p style="margin:0">±${Math.round(position.accuracy)} m &middot; updated ${new Date(position.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      `;
    } else if (error) {
      gpsBox.innerHTML = `<p>Location unavailable (${escapeHtml(error.message)}). The app works fine without it.</p>`;
    }
  });
  startGps();

  container.querySelector("#save-offline-btn").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = "Saving…";
    try {
      await saveForOffline((done, total) => (btn.textContent = `Saving ${done}/${total}…`));
      container.querySelector("#offline-status").textContent = "Trip data saved for offline use.";
      btn.textContent = "Saved";
    } catch (err) {
      btn.textContent = "Save failed — retry";
      btn.disabled = false;
      console.error(err);
    }
  });
}
