// UI language (EN default, RU optional), persisted per device. Strings are
// written inline as L("English", "Русский") — no key catalogue to keep in sync.
// Trip data in /data stays as written; only the interface is translated.

const KEY = "lycian-2026-lang";

function read() {
  try { return localStorage.getItem(KEY) === "ru" ? "ru" : "en"; } catch { return "en"; }
}

export const lang = read();
document.documentElement.lang = lang;

export function L(en, ru) {
  return lang === "ru" ? ru : en;
}

export function setLang(next) {
  try { localStorage.setItem(KEY, next); } catch {}
  location.reload();
}

// Russian names of the waypoints in the 2024 GPX → English.
const GPX_NAMES = {
  "Ксанфа руины": "Xanthos ruins",
  "Летоон руины": "Letoon ruins",
  "Село. Магазин, отель": "Village: shop, hotel",
  "Село. Кафе, магазин, отель": "Village: café, shop, hotel",
  "Развилка - спуск к деревне или траверсом в обход": "Fork: down to the village or traverse around",
  "Село. Магазин, кемпинги, кафе, отели": "Village: shop, camps, cafés, hotels",
  "Тропа к долине Бабочек": "Path to Butterfly Valley",
  "Пляж в Долине Бабочек": "Butterfly Valley beach",
  "Село. Кафе, отели": "Village: cafés, hotels",
  "Село. Кафе": "Village: café",
  "Тропа к Олюденизу": "Path to Ölüdeniz",
  "Олюдениз. Есть всё": "Ölüdeniz: everything",
  "Старт/финиш западной части тропы": "Start/finish of the western Lycian Way",
};
export function gpxName(name) {
  return lang === "ru" ? name : (GPX_NAMES[name] ?? name);
}
