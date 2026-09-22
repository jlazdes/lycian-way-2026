// Thin fetch+cache loader for /data/*.json and /content/knowledge/*.md.
// Screens must go through this — never hardcode trip facts in a component.

const cache = new Map();

function base() {
  return import.meta.env.BASE_URL;
}

async function loadJson(name) {
  if (cache.has(name)) return cache.get(name);
  const res = await fetch(`${base()}data/${name}.json`);
  if (!res.ok) throw new Error(`Failed to load data/${name}.json: ${res.status}`);
  const json = await res.json();
  cache.set(name, json);
  return json;
}

export const getConfig = () => loadJson("config").then((d) => d);
export const getTrip = () => loadJson("trip");
export const getItinerary = () => loadJson("itinerary").then((d) => d.days);
export const getRoutes = () => loadJson("routes").then((d) => d.routes);
export const getPlaces = () => loadJson("places").then((d) => d.places);
export const getWater = () => loadJson("water");
export const getAccommodation = () => loadJson("accommodation").then((d) => d.accommodations);
export const getFood = () => loadJson("food").then((d) => d.foodPlaces);
export const getFuel = () => loadJson("fuel");
export const getTransport = () => loadJson("transport").then((d) => d.transportLegs);
export const getAlerts = () => loadJson("alerts").then((d) => d.alerts);
export const getAttractions = () => loadJson("attractions").then((d) => d.attractions);
export const getSources = () => loadJson("sources").then((d) => d.sources);

const sourceIndexPromise = getSources().then((list) => {
  const map = new Map();
  for (const s of list) map.set(s.id, s);
  return map;
});
export const getSourceById = async (id) => (await sourceIndexPromise).get(id);

export async function getDayById(id) {
  const days = await getItinerary();
  return days.find((d) => d.id === id);
}

export async function getRouteById(id) {
  if (!id) return null;
  const routes = await getRoutes();
  return routes.find((r) => r.id === id);
}

export async function getPlaceById(id) {
  if (!id) return null;
  const places = await getPlaces();
  return places.find((p) => p.id === id);
}

export async function listKnowledgeArticles() {
  const slugs = [
    "before-we-leave", "water", "food", "fuel", "sleep", "transport",
    "route-decisions", "safety", "ancient-lycia", "turkish-phrases", "hiker-reports"
  ];
  return slugs;
}

export async function getKnowledgeArticle(slug) {
  const key = `knowledge:${slug}`;
  if (cache.has(key)) return cache.get(key);
  const res = await fetch(`${base()}content/knowledge/${slug}.md`);
  if (!res.ok) throw new Error(`Failed to load knowledge/${slug}.md: ${res.status}`);
  const text = await res.text();
  const parsed = parseFrontmatter(text);
  cache.set(key, parsed);
  return parsed;
}

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };
  const [, fmBlock, body] = match;
  const meta = {};
  for (const line of fmBlock.split("\n")) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    const [, key, rawVal] = m;
    if (rawVal.startsWith("[") && rawVal.endsWith("]")) {
      meta[key] = rawVal
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      meta[key] = rawVal.trim();
    }
  }
  return { meta, body: body.trim() };
}
