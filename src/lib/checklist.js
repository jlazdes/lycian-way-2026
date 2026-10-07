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

// Seed texts already offered for a day, so tasks added to /data later still
// show up on devices that seeded the list earlier (without re-adding ones the
// user deleted or duplicating ones they have).
function loadSeeded(dayId) {
  try { return new Set(JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${dayId}-seeded`) ?? "null") ?? []); } catch { return null; }
}
function saveSeeded(dayId, set) {
  try { localStorage.setItem(`${STORAGE_PREFIX}${dayId}-seeded`, JSON.stringify([...set])); } catch {}
}

export function getChecklist(day) {
  const seed = [...(day.preTripTasks ?? []), ...(day.tasks ?? [])];
  let items = load(day.id);
  if (!items) {
    items = seed.map((text) => ({ id: `seed-${nextId++}`, text, done: false }));
    save(day.id, items);
    saveSeeded(day.id, new Set(seed));
    return items;
  }
  const seeded = loadSeeded(day.id) ?? new Set(items.map((i) => i.text));
  const fresh = seed.filter((text) => !seeded.has(text) && !items.some((i) => i.text === text));
  if (fresh.length) {
    items.push(...fresh.map((text) => ({ id: `seed-${Date.now()}-${nextId++}`, text, done: false })));
    save(day.id, items);
  }
  seed.forEach((t) => seeded.add(t));
  saveSeeded(day.id, seeded);
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
