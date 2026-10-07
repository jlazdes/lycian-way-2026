import { getKnowledgeArticle } from "../lib/data.js";
import { escapeHtml } from "../lib/status.js";
import { saveForOffline, isSavedForOffline, getMapManifest, isMapDownloaded, downloadMap, deleteMap, formatBytes } from "../lib/offline.js";

const CATEGORIES = [
  ["#/itinerary", "Itinerary", "Day-by-day plan, 8–18 Oct"],
  ["#/emergency", "Emergency", "112, GPS, bailout info"],
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
      <div class="section-title">Save for offline</div>
      <div class="card">
        <p id="offline-status">${saved ? "Trip data is saved for offline use." : "Trip data is not yet saved for offline use."}</p>
        <p style="font-size:0.75rem;">Трек по дням, все маркеры, карточки дней, профили высот и статьи сохраняются автоматически после первого открытия онлайн. Кнопка ниже обновляет их вручную.</p>
        <button class="btn" id="save-offline-btn">Save for offline</button>
      </div>

      <div class="card">
        <h3>Карта маршрута офлайн</h3>
        <p>Подложка для коридора ±2 км вокруг тропы (Ovacık → Xanthos) + Ölüdeniz, Gelemiş, Kaş. Зумы до 15 — видны тропинки, сёла и дороги. Источник: OpenStreetMap / Protomaps, хранится на нашем сайте.</p>
        <p id="map-offline-status">${mapSaved ? "✓ Карта скачана — работает без интернета." : manifest ? `Размер загрузки: <strong>${formatBytes(manifest.totalBytes)}</strong> (${manifest.files.length} файлов).` : "Нужен интернет, чтобы узнать размер и скачать."}</p>
        <div class="progress" id="map-progress" hidden><div class="progress__bar" id="map-progress-bar"></div></div>
        <div class="link-row">
          <button class="btn" id="map-download-btn" ${manifest ? "" : "disabled"}>${mapSaved ? "Обновить карту" : "Скачать карту маршрута"}</button>
          ${mapSaved ? '<button class="btn btn-secondary" id="map-delete-btn">Удалить</button>' : ""}
        </div>
        <p style="font-size:0.72rem;">Спутник и онлайн-карта вне коридора требуют интернета.</p>
      </div>

      <div class="card">
        <h3>Добавить на главный экран</h3>
        <p><strong>iPhone, Safari:</strong></p>
        <ol class="install-steps">
          <li>Откройте сайт в Safari (не в Chrome/Telegram).</li>
          <li>Нажмите «Поделиться» (квадрат со стрелкой вверх).</li>
          <li>«На экран «Домой»» → «Добавить».</li>
          <li>Откройте приложение с иконки один раз при интернете — после этого оно работает офлайн.</li>
        </ol>
        <p><strong>Android, Chrome:</strong></p>
        <ol class="install-steps">
          <li>Откройте сайт в Chrome.</li>
          <li>⋮ (меню справа сверху) → «Добавить на гл. экран» или «Установить приложение».</li>
          <li>Подтвердите «Установить».</li>
          <li>Откройте с иконки один раз при интернете.</li>
        </ol>
        <p style="font-size:0.72rem;">Важно: на iPhone данные иконки на главном экране и вкладки Safari хранятся отдельно — скачайте карту именно в том, чем будете пользоваться в походе.</p>
      </div>

      <div class="section-title">Trip</div>
      ${CATEGORIES.map(([href, label, desc]) => `
        <a href="${href}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${escapeHtml(label)}</h3>
          <p>${escapeHtml(desc)}</p>
        </a>
      `).join("")}

      <div class="section-title">Field guide</div>
      <p style="color:var(--text-dim);font-size:0.78rem;margin-top:-4px;">Water, food, sleep, transport, safety, and places to see now live as markers on the Map tab — tap a pin for details.</p>
      ${articles.map(([slug, a]) => `
        <a href="#/knowledge/${slug}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${escapeHtml(a.meta.title ?? slug)}</h3>
          <p>Confidence: ${escapeHtml(a.meta.confidence ?? "?")} &middot; last verified ${escapeHtml(a.meta.lastVerified ?? "?")}</p>
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
        mapStatus.textContent = `Загрузка: ${formatBytes(done)} из ${formatBytes(total)} (${pct}%)`;
      });
      bar.style.width = "100%";
      mapStatus.textContent = "✓ Карта скачана — работает без интернета.";
      mapBtn.textContent = "Обновить карту";
    } catch (err) {
      console.warn(err);
      mapStatus.textContent = `Не получилось: ${err.message}. Проверьте интернет и попробуйте ещё раз.`;
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
