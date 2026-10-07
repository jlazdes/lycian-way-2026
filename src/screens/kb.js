import { L } from "../lib/i18n.js";
import { getKnowledgeArticle } from "../lib/data.js";
import { escapeHtml } from "../lib/status.js";
import { saveForOffline, isSavedForOffline, getMapManifest, isMapDownloaded, downloadMap, deleteMap, formatBytes } from "../lib/offline.js";

const CATEGORIES = [
  ["#/itinerary", L("Itinerary", "План по дням"), L("Day-by-day plan, 8–18 Oct", "План по дням, 8–18 окт")],
  ["#/emergency", L("Emergency", "Экстренное"), L("112, GPS, bailout info", "112, GPS, как сойти с маршрута")],
];

// Water/resupply/sleep/transport/places-to-see/route-decisions/safety/ancient-lycia
// all moved onto the map itself as markers — see screens/map.js. These are the
// articles that don't map to a point on the trail.
const FIELD_GUIDE_SLUGS = ["before-we-leave", "turkish-phrases", "hiker-reports"];

export async function renderKb(container) {
  const [saved, mapSaved, manifest, articles] = await Promise.all([
    isSavedForOffline(),
    isMapDownloaded(),
    getMapManifest(),
    Promise.all(FIELD_GUIDE_SLUGS.map((s) => getKnowledgeArticle(s).then((a) => [s, a]))),
  ]);

  container.innerHTML = `
    <div class="screen-pad">
      <div class="section-title">${L("Save for offline", "Офлайн")}</div>
      <div class="card">
        <p id="offline-status">${saved ? L("Trip data is saved for offline use.", "Данные поездки сохранены для офлайна.") : L("Trip data is not yet saved for offline use.", "Данные поездки ещё не сохранены для офлайна.")}</p>
        <p style="font-size:0.75rem;">${L("The daily track, all markers, day cards, elevation profiles and articles are saved automatically after the first online visit. The button below refreshes them.", "Трек по дням, все маркеры, карточки дней, профили высот и статьи сохраняются автоматически после первого открытия онлайн. Кнопка ниже обновляет их вручную.")}</p>
        <button class="btn" id="save-offline-btn">${L("Save for offline", "Сохранить офлайн")}</button>
      </div>

      <div class="card">
        <h3>${L("Offline route map", "Карта маршрута офлайн")}</h3>
        <p>${L("Base map for a ±2 km corridor around the trail (Ovacık → Xanthos) + Ölüdeniz, Gelemiş, Kaş. Zoom up to 15 — paths, villages and roads. Source: OpenStreetMap / Protomaps, hosted on this site.", "Подложка для коридора ±2 км вокруг тропы (Ovacık → Xanthos) + Ölüdeniz, Gelemiş, Kaş. Зумы до 15 — видны тропинки, сёла и дороги. Источник: OpenStreetMap / Protomaps, хранится на нашем сайте.")}</p>
        <p id="map-offline-status">${mapSaved ? L("✓ Map downloaded — works without internet.", "✓ Карта скачана — работает без интернета.") : manifest ? `${L("Download size", "Размер загрузки")}: <strong>${formatBytes(manifest.totalBytes)}</strong> (${manifest.files.length} ${L("files", "файлов")}).` : L("Needs internet to check the size and download.", "Нужен интернет, чтобы узнать размер и скачать.")}</p>
        <div class="progress" id="map-progress" hidden><div class="progress__bar" id="map-progress-bar"></div></div>
        <div class="link-row">
          <button class="btn" id="map-download-btn" ${manifest ? "" : "disabled"}>${mapSaved ? L("Update map", "Обновить карту") : L("Download route map", "Скачать карту маршрута")}</button>
          ${mapSaved ? `<button class="btn btn-secondary" id="map-delete-btn">${L("Delete", "Удалить")}</button>` : ""}
        </div>
        <p style="font-size:0.72rem;">${L("Satellite and the map outside the corridor need internet.", "Спутник и онлайн-карта вне коридора требуют интернета.")}</p>
      </div>

      <div class="card">
        <h3>${L("Add to home screen", "Добавить на главный экран")}</h3>
        <p><strong>iPhone, Safari:</strong></p>
        <ol class="install-steps">
          <li>${L("Open the site in Safari (not Chrome/Telegram).", "Откройте сайт в Safari (не в Chrome/Telegram).")}</li>
          <li>${L("Tap Share (square with an up arrow).", "Нажмите «Поделиться» (квадрат со стрелкой вверх).")}</li>
          <li>${L("“Add to Home Screen” → “Add”.", "«На экран «Домой»» → «Добавить».")}</li>
          <li>${L("Open the app from the icon once while online — after that it works offline.", "Откройте приложение с иконки один раз при интернете — после этого оно работает офлайн.")}</li>
        </ol>
        <p><strong>Android, Chrome:</strong></p>
        <ol class="install-steps">
          <li>${L("Open the site in Chrome.", "Откройте сайт в Chrome.")}</li>
          <li>${L("⋮ (top-right menu) → “Add to Home screen” or “Install app”.", "⋮ (меню справа сверху) → «Добавить на гл. экран» или «Установить приложение».")}</li>
          <li>${L("Confirm “Install”.", "Подтвердите «Установить».")}</li>
          <li>${L("Open it from the icon once while online.", "Откройте с иконки один раз при интернете.")}</li>
        </ol>
        <p style="font-size:0.72rem;">${L("Note: on iPhone the home-screen app and Safari keep separate storage — download the map in the one you will use on the trail.", "Важно: на iPhone данные иконки на главном экране и вкладки Safari хранятся отдельно — скачайте карту именно в том, чем будете пользоваться в походе.")}</p>
      </div>

      <div class="section-title">${L("Trip", "Поездка")}</div>
      ${CATEGORIES.map(([href, label, desc]) => `
        <a href="${href}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${escapeHtml(label)}</h3>
          <p>${escapeHtml(desc)}</p>
        </a>
      `).join("")}

      <div class="section-title">${L("Field guide", "Справочник")}</div>
      <p style="color:var(--text-dim);font-size:0.78rem;margin-top:-4px;">${L("Water, food, sleep, transport, safety, and places to see now live as markers on the Map tab — tap a pin for details.", "Вода, еда, ночёвки, транспорт, безопасность и достопримечательности — маркерами на карте, нажмите на пин.")}</p>
      ${articles.map(([slug, a]) => `
        <a href="#/knowledge/${slug}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${escapeHtml(a.meta.title ?? slug)}</h3>
          <p>${L("Confidence", "Достоверность")}: ${escapeHtml(a.meta.confidence ?? "?")} &middot; ${L("last verified", "проверено")} ${escapeHtml(a.meta.lastVerified ?? "?")}</p>
        </a>
      `).join("")}
    </div>
  `;

  const mapBtn = container.querySelector("#map-download-btn");
  const mapStatus = container.querySelector("#map-offline-status");
  const progress = container.querySelector("#map-progress");
  const bar = container.querySelector("#map-progress-bar");
  mapBtn.addEventListener("click", async () => {
    if (!manifest) return;
    mapBtn.disabled = true;
    progress.hidden = false;
    try {
      await downloadMap((done, total) => {
        const pct = Math.min(100, Math.round((done / total) * 100));
        bar.style.width = `${pct}%`;
        mapStatus.textContent = `${L("Downloading", "Загрузка")}: ${formatBytes(done)} ${L("of", "из")} ${formatBytes(total)} (${pct}%)`;
      });
      bar.style.width = "100%";
      mapStatus.textContent = L("✓ Map downloaded — works without internet.", "✓ Карта скачана — работает без интернета.");
      mapBtn.textContent = L("Update map", "Обновить карту");
    } catch (err) {
      console.warn(err);
      mapStatus.textContent = L(`Failed: ${err.message}. Check the internet and try again.`, `Не получилось: ${err.message}. Проверьте интернет и попробуйте ещё раз.`);
    } finally {
      mapBtn.disabled = false;
    }
  });
  container.querySelector("#map-delete-btn")?.addEventListener("click", async () => {
    await deleteMap();
    renderKb(container);
  });

  container.querySelector("#save-offline-btn").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = L("Saving…", "Сохраняем…");
    try {
      await saveForOffline((done, total) => (btn.textContent = `${L("Saving", "Сохраняем")} ${done}/${total}…`));
      container.querySelector("#offline-status").textContent = L("Trip data saved for offline use.", "Данные поездки сохранены для офлайна.");
      btn.textContent = L("Saved", "Сохранено");
    } catch (err) {
      btn.textContent = L("Save failed — retry", "Ошибка — повторить");
      btn.disabled = false;
      console.error(err);
    }
  });
}
