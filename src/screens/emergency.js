import { escapeHtml, kbBackLink } from "../lib/status.js";
import { subscribeGps, startGps } from "../lib/gps.js";

export async function renderEmergency(container) {
  container.innerHTML = `
    <div class="screen-pad">
      ${kbBackLink()}
      <div class="card">
        <h3>Emergency number</h3>
        <p style="font-size:1.6rem;font-weight:700;">112</p>
        <p>Türkiye's single emergency number — police, ambulance, fire.</p>
      </div>

      <div class="card">
        <h3>Forestry Directorate (OGM)</h3>
        <p>For fire-restriction / forest-entry questions: <a href="https://www.ogm.gov.tr/en" target="_blank" rel="noopener">ogm.gov.tr</a></p>
        <p style="color:var(--text-dim);font-size:0.8rem;">A direct local contact number for the Muğla regional directorate has not been looked up yet.</p>
      </div>

      <div class="card">
        <h3>Your current position</h3>
        <div id="emergency-gps"><p>Requesting location…</p></div>
      </div>

      <div class="card">
        <p style="color:var(--text-dim);font-size:0.8rem;">This app is a planning and reference tool. It does not replace a dedicated GPS/satellite communicator for real emergencies in the backcountry.</p>
      </div>
    </div>
  `;

  const gpsBox = container.querySelector("#emergency-gps");
  subscribeGps(({ position, error }) => {
    if (position) {
      gpsBox.innerHTML = `
        <p>${position.lat.toFixed(5)}, ${position.lon.toFixed(5)}</p>
        <p>Accuracy: ±${Math.round(position.accuracy)} m</p>
        <div class="link-row">
          <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lon}">Open in Google Maps</a>
        </div>
      `;
    } else if (error) {
      gpsBox.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
    }
  });
  startGps();
}
