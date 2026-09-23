// Per-viewer task checklist for the current day, persisted in localStorage.
// Seeded once from that day's tasks/preTripTasks; after that, checking items
// off or adding your own is purely local state — never written back to /data.

const STORAGE_PREFIX = "lycian-2026-checklist-";

function load(dayId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + dayId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save(dayId, items) {
  try {
    localStorage.setItem(STORAGE_PREFIX + dayId, JSON.stringify(items));
  } catch {
    // localStorage unavailable — checklist just won't persist across reloads.
  }
}

let nextId = 1;

export function getChecklist(day) {
  let items = load(day.id);
  if (!items) {
    const seed = [...(day.preTripTasks ?? []), ...(day.tasks ?? [])];
    items = seed.map((text) => ({ id: `seed-${nextId++}`, text, done: false }));
    save(day.id, items);
  }
  return items;
}

export function addItem(day, text) {
  const items = getChecklist(day);
  items.push({ id: `custom-${Date.now()}-${nextId++}`, text, done: false });
  save(day.id, items);
  return items;
}

export function toggleItem(day, itemId) {
  const items = getChecklist(day);
  const item = items.find((i) => i.id === itemId);
  if (item) item.done = !item.done;
  save(day.id, items);
  return items;
}

export function clearCompleted(day) {
  const items = getChecklist(day).filter((i) => !i.done);
  save(day.id, items);
  return items;
}
