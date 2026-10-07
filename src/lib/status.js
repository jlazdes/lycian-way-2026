import { L } from "./i18n.js";
// Single source of truth for status -> visual treatment. Used by every screen and the map.

const FALLBACK_COLORS = { neutral: "#AAAAAA", orange: "#FF8800", yellow: "#FFEE00", red: "#FF0000" };

export function statusColor(config, status) {
  return config?.status?.[status]?.color ?? FALLBACK_COLORS[status] ?? FALLBACK_COLORS.neutral;
}

export function statusLabel(config, status) {
  return config?.status?.[status]?.label ?? status;
}

// water.json uses a richer, water-specific status enum; map it down to the
// shared neutral/orange/red visual system without losing the underlying value.
const WATER_STATUS_TO_VISUAL = {
  confirmed_available: "neutral",
  seasonal: "orange",
  uncertain: "orange",
  reported_dry: "red",
  confirmed_unavailable: "red",
};

export function waterVisualStatus(waterStatus) {
  return WATER_STATUS_TO_VISUAL[waterStatus] ?? "orange";
}

// Status as a familiar map-style chip: nothing for verified, a yellow warning
// triangle for "unverified / check", a red no-entry sign for "closed".
const WARN_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 2.5 1.5 21h21L12 2.5Z" fill="#FFC400" stroke="#000" stroke-width="1" stroke-linejoin="round"/><path d="M11 9h2v6h-2zM11 16.5h2v2h-2z" fill="#000"/></svg>`;
const CLOSED_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="#E53935"/><rect x="6" y="10.5" width="12" height="3" rx="1" fill="#fff"/></svg>`;

export function statusBadgeHtml(config, status) {
  if (status === "red") return `<span class="status-chip status-chip--red">${CLOSED_SVG}${L("Closed", "Закрыто")}</span>`;
  if (status === "orange") return `<span class="status-chip status-chip--warn">${WARN_SVG}${L("Unverified", "Не проверено")}</span>`;
  if (status === "yellow") return `<span class="status-chip status-chip--warn">${WARN_SVG}${L("Partly an issue", "Частично проблема")}</span>`;
  return "";
}

export function kbBackLink() {
  return `<a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; ${L("Knowledge Base", "База знаний")}</a>`;
}

export function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
