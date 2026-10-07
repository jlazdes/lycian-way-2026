import {
  getConfig, getItinerary, getDayById, getRouteById, getPlaceById,
  getAccommodation, getFood, getWater, getTransport, getTrail, getPois,
} from "../lib/data.js";
import { statusBadgeHtml, escapeHtml, kbBackLink } from "../lib/status.js";
import { buildMaster, waterAlongTrail, profileSvg, formatKm } from "../lib/trail.js";

const DIFF_THRESHOLD = 0.15;

function gmaps(coords, url) {
  if (!coords && !url) return "";
  const href = url ?? `https://www.google.com/maps/search/?api=1&query=${coords[1]},${coords[0]}`;
  return ` <a href="${href}" target="_blank" rel="noopener">карта&nbsp;↗</a>`;
}

function routeCard(config, route, fromPlace, toPlace, trailDay, waterInDay) {
  const at = route.allTrails;
  const plan = route.metrics.find((m) => m.source === "user_itinerary");
  const headDist = at?.distanceKm ?? plan?.distanceKm;
  const headUp = at?.ascentM ?? plan?.ascentM;
  const headSrc = at ? "AllTrails" : "план";
  const diff = (a, b) => (a && b ? Math.abs(a - b) / b : 0);
  const distOff = trailDay && diff(trailDay.distanceKm, headDist) > DIFF_THRESHOLD;
  const upOff = trailDay && headUp && diff(trailDay.ascentM, headUp) > DIFF_THRESHOLD;
  const marks = waterInDay.map((w) => ({ m: w.alongM - trailDay.startM, color: w.kind === "source" ? "#00A3FF" : "#2EC4B6" }));
  return `
    <div class="card">
      <h3>Route</h3>
      <p>${fromPlace ? escapeHtml(fromPlace.name) : "?"} &rarr; ${toPlace ? escapeHtml(toPlace.name) : "?"}</p>
      <div class="metric-grid">
        <div class="metric"><div class="metric__value">${String(headDist ?? "—").replace(".", ",")} км</div><div class="metric__label">${headSrc}</div></div>
        <div class="metric"><div class="metric__value">${headUp != null ? `+${headUp} м` : "—"}</div><div class="metric__label">набор, ${headSrc}</div></div>
      </div>
      ${at?.links?.length ? `<p>${at.links.map((l, i) => `<a href="${l}" target="_blank" rel="noopener">AllTrails${at.links.length > 1 ? ` ${i + 1}` : ""}&nbsp;↗</a>`).join(" &middot; ")}</p>` : ""}
      ${trailDay ? `
        <p style="font-size:0.75rem;">По нашему треку: ${formatKm(trailDay.distanceKm * 1000)} км, +${trailDay.ascentM} / −${trailDay.descentM} м, ${trailDay.minEleM}–${trailDay.maxEleM} м над уровнем моря${distOff || upOff ? " — <strong>расходится с AllTrails больше чем на 15%, ориентируйтесь на AllTrails</strong>" : ""}.</p>
        ${profileSvg(trailDay.coordinates, { marks })}
        <p style="font-size:0.7rem;">Метки на профиле: <span style="color:#00A3FF">источники</span>, <span style="color:#2EC4B6">купить воду</span>.</p>
      ` : ""}
      ${route.variants?.length ? route.variants.map((v) => `
        <p>${statusBadgeHtml(config, v.status)} <strong>${escapeHtml(v.name)}</strong> — ${escapeHtml(v.notes)}</p>
      `).join("") : ""}
      ${route.notes ? `<p><em>${escapeHtml(route.notes)}</em></p>` : ""}
    </div>`;
}

function waterCard(waterInDay, trailDay) {
  if (!trailDay) return "";
  if (!waterInDay.length) return `<div class="section-title">Вода на участке</div><div class="card"><p>Точек воды на участке не найдено — несите запас на весь день.</p></div>`;
  return `
    <div class="section-title">Вода на участке</div>
    <div class="card">
      <ul class="water-list">
        ${waterInDay.map((w) => `
          <li>
            <span class="water-list__km">${formatKm(Math.max(0, w.alongM - trailDay.startM))} км</span>
            <span class="water-list__name">${w.kind === "source" ? "💧" : "🛒"} ${escapeHtml(w.name)}${w.kind === "source" ? ' <span style="color:var(--status-orange);font-size:0.72rem;">(может быть сухим)</span>' : ""}</span>
            <span class="water-list__off">${w.offTrailM > 40 ? `${Math.round(w.offTrailM)} м от тропы` : "на тропе"}</span>
          </li>`).join("")}
      </ul>
      <p style="font-size:0.72rem;">💧 источник — в октябре может быть сухим, не рассчитывать как на единственный. 🛒 купить — магазин/кафе (надёжно, часы не проверены). Расстояние — от старта дня по тропе.</p>
    </div>`;
}

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
  const [trail, pois] = await Promise.all([getTrail(), getPois()]);
  const master = buildMaster(trail);
  const trailDay = master.days.find((d) => d.dayId === day.id) ?? null;
  const waterInDay = trailDay
    ? waterAlongTrail(master, { pois, water: waterAll, food: foodAll }).filter((w) => w.alongM >= trailDay.startM - 50 && w.alongM <= trailDay.endM + 50 && w.offTrailM <= 1000)
    : [];
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

      ${route ? routeCard(config, route, fromPlace, toPlace, trailDay, waterInDay) : ""}
      ${waterCard(waterInDay, trailDay)}

      ${day.tasks?.length ? `<div class="section-title">Tasks</div><div class="card"><ul>${day.tasks.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul></div>` : ""}
      ${day.preTripTasks?.length ? `<div class="section-title">Pre-trip tasks</div><div class="card"><ul>${day.preTripTasks.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul></div>` : ""}

      ${waters.length ? `<div class="section-title">Water</div>${waters.map((w) => `
        <div class="card"><h3>${escapeHtml(w.name)}</h3><p>${escapeHtml(w.waterType)} &middot; ${escapeHtml(w.status)} &middot; ${escapeHtml(w.treatment)}</p><p>${escapeHtml(w.notes)}</p></div>
      `).join("")}` : ""}

      ${foods.length ? `<div class="section-title">Food</div>${foods.map((f) => `
        <div class="card">${statusBadgeHtml(config, f.status)} <strong>${escapeHtml(f.name)}</strong>${gmaps(f.coordinates, f.googleMapsUrl)} <p>${escapeHtml(f.notes)}</p></div>
      `).join("")}` : ""}

      ${accommodations.length ? `<div class="section-title">Sleep</div>${accommodations.map((a) => `
        <div class="card">${statusBadgeHtml(config, a.status)} <strong>${escapeHtml(a.name)}</strong>${a.booked ? ' <span class="pill">забронировано</span>' : ""}${gmaps(a.coordinates, a.googleMapsUrl)}
          ${a.address ? `<p>${escapeHtml(a.address)}</p>` : ""}
          ${a.phone ? `<p><a href="tel:${a.phone.replace(/\s/g, "")}">${escapeHtml(a.phone)}</a></p>` : ""}
          ${a.checkIn ? `<p>Заезд: ${escapeHtml(a.checkIn)} &middot; Выезд: ${escapeHtml(a.checkOut ?? "")}</p>` : ""}
          <p>${escapeHtml(a.priceInfo)}</p><p>${escapeHtml(a.notes)}</p></div>
      `).join("")}` : ""}

      ${transports.length ? `<div class="section-title">Transport</div>${transports.map((t) => `
        <div class="card">${statusBadgeHtml(config, t.status)} <strong>${escapeHtml(t.name)}</strong>
          ${(t.details?.segments ?? (t.details?.flightNo ? [t.details] : [])).map((sg) => `<p><strong>${escapeHtml(sg.flightNo)}</strong> ${escapeHtml(sg.from)} ${escapeHtml(sg.depart)} → ${escapeHtml(sg.to)} ${escapeHtml(sg.arrive)}</p>`).join("")}
          <p>${escapeHtml(t.notes)}</p></div>
      `).join("")}` : ""}

      ${day.highlights?.length ? `<div class="section-title">Highlights</div><div class="card"><ul>${day.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul></div>` : ""}
      ${day.watchOut?.length ? `<div class="section-title">Watch out</div><ul class="warn-list">${day.watchOut.map((w) => `<li>${escapeHtml(w)}</li>`).join("")}</ul>` : ""}
      ${day.backupPlan ? `<div class="section-title">Backup plan</div><div class="card">${escapeHtml(day.backupPlan)}</div>` : ""}
      ${day.notes ? `<p style="color:var(--text-dim);font-size:0.8rem;">${escapeHtml(day.notes)}</p>` : ""}
    </div>
  `;
}
