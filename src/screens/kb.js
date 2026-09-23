import { getKnowledgeArticle } from "../lib/data.js";
import { escapeHtml } from "../lib/status.js";
import { saveForOffline, isSavedForOffline } from "../lib/offline.js";

const CATEGORIES = [
  ["#/itinerary", "Itinerary", "Day-by-day plan, 8–18 Oct"],
  ["#/emergency", "Emergency", "112, GPS, bailout info"],
];

// Water/resupply/sleep/transport/places-to-see/route-decisions/safety/ancient-lycia
// all moved onto the map itself as markers — see screens/map.js. These are the
// articles that don't map to a point on the trail.
const FIELD_GUIDE_SLUGS = ["before-we-leave", "turkish-phrases", "hiker-reports"];

export async function renderKb(container) {
  const [saved, articles] = await Promise.all([
    isSavedForOffline(),
    Promise.all(FIELD_GUIDE_SLUGS.map((s) => getKnowledgeArticle(s).then((a) => [s, a]))),
  ]);

  container.innerHTML = `
    <div class="screen-pad">
      <div class="card">
        <p id="offline-status">${saved ? "Trip data is saved for offline use." : "Trip data is not yet saved for offline use."}</p>
        <button class="btn" id="save-offline-btn">Save for offline</button>
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
