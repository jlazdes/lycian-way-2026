// Single source of truth for status -> visual treatment. Used by every screen and the map.

const FALLBACK_COLORS = { neutral: "#5b6b73", orange: "#d97706", red: "#c62828" };

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

export function statusBadgeHtml(config, status, { small = false } = {}) {
  const color = statusColor(config, status);
  const label = statusLabel(config, status);
  const sizeClass = small ? "status-badge status-badge--small" : "status-badge";
  return `<span class="${sizeClass}" style="--status-color:${color}" title="${escapeHtml(label)}">
    <span class="status-badge__dot"></span>${status === "orange" || status === "red" ? "<span class=\"status-badge__warn\">&#9650;</span>" : ""}
  </span>`;
}

export function kbBackLink() {
  return `<a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge Base</a>`;
}

export function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
