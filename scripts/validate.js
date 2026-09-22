#!/usr/bin/env node
// Lightweight, dependency-free validator for /data/*.json.
// Run with: npm run validate
// Intentionally hand-rolled (no ajv) — see UPDATE_WORKFLOW.md. Add ajv only if this gets unwieldy.

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");

const STATUS_VALUES = new Set(["neutral", "orange", "yellow", "red"]);
const CONFIDENCE_VALUES = new Set(["high", "medium", "low"]);
const WATER_TYPES = new Set(["public_tap", "village_fountain", "spring", "cistern", "cafe", "pension", "shop", "other"]);
const WATER_STATUS = new Set(["confirmed_available", "seasonal", "uncertain", "reported_dry", "confirmed_unavailable"]);
const TREATMENT_VALUES = new Set(["potable_as_supplied", "treat_recommended", "treat_required", "unknown"]);
const POI_CATEGORIES = new Set(["viewpoint", "beach", "ruins", "viewpoint_beach", "town", "camp"]);

let errors = [];
let warnings = [];

function err(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

function loadJson(file) {
  const full = path.join(dataDir, file);
  let raw;
  try {
    raw = readFileSync(full, "utf8");
  } catch {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    err(`${file}: malformed JSON — ${e.message}`);
    return null;
  }
}

const files = readdirSync(dataDir).filter((f) => f.endsWith(".json"));
const docs = {};
for (const f of files) docs[f] = loadJson(f);

// --- collect all known IDs per collection, for cross-reference checks ---
const knownIds = {
  sources: new Set((docs["sources.json"]?.sources ?? []).map((s) => s.id)),
  places: new Set((docs["places.json"]?.places ?? []).map((p) => p.id)),
  routes: new Set((docs["routes.json"]?.routes ?? []).map((r) => r.id)),
  water: new Set((docs["water.json"]?.waterPoints ?? []).map((w) => w.id)),
  accommodation: new Set((docs["accommodation.json"]?.accommodations ?? []).map((a) => a.id)),
  food: new Set((docs["food.json"]?.foodPlaces ?? []).map((f) => f.id)),
  transport: new Set((docs["transport.json"]?.transportLegs ?? []).map((t) => t.id)),
  days: new Set((docs["itinerary.json"]?.days ?? []).map((d) => d.id)),
};

function checkUniqueIds(fileName, list, label) {
  const seen = new Set();
  for (const item of list) {
    if (!item.id) { err(`${fileName}: ${label} missing id`); continue; }
    if (seen.has(item.id)) err(`${fileName}: duplicate id "${item.id}" in ${label}`);
    seen.add(item.id);
  }
}

function checkStatusConfidence(fileName, list, label) {
  for (const item of list) {
    if (item.status !== undefined && !STATUS_VALUES.has(item.status)) {
      err(`${fileName}: ${label} "${item.id}" has invalid status "${item.status}"`);
    }
    if (item.confidence !== undefined && !CONFIDENCE_VALUES.has(item.confidence)) {
      err(`${fileName}: ${label} "${item.id}" has invalid confidence "${item.confidence}"`);
    }
    if (item.lastVerified === undefined) {
      warn(`${fileName}: ${label} "${item.id}" has no lastVerified field`);
    }
  }
}

function checkSourceRefs(fileName, list, label) {
  for (const item of list) {
    for (const sid of item.sources ?? []) {
      if (!knownIds.sources.has(sid)) {
        err(`${fileName}: ${label} "${item.id}" references unknown source "${sid}" — add it to sources.json first`);
      }
    }
  }
}

function checkBoundingBox(fileName, list, label, getCoords) {
  const bbox = docs["config.json"]?.map?.boundingBox;
  if (!bbox) return;
  for (const item of list) {
    const coords = getCoords(item);
    if (!coords) continue;
    const [lon, lat] = coords;
    if (typeof lon !== "number" || typeof lat !== "number") {
      err(`${fileName}: ${label} "${item.id}" has non-numeric coordinates`);
      continue;
    }
    if (lon < bbox.west || lon > bbox.east || lat < bbox.south || lat > bbox.north) {
      err(`${fileName}: ${label} "${item.id}" coordinates [${lon}, ${lat}] fall outside the configured trip bounding box`);
    }
  }
}

// places.json
if (docs["places.json"]) {
  const list = docs["places.json"].places ?? [];
  checkUniqueIds("places.json", list, "place");
  checkStatusConfidence("places.json", list, "place");
  checkSourceRefs("places.json", list, "place");
  checkBoundingBox("places.json", list, "place", (p) => p.coordinates);
}

// routes.json
if (docs["routes.json"]) {
  const list = docs["routes.json"].routes ?? [];
  checkUniqueIds("routes.json", list, "route");
  checkStatusConfidence("routes.json", list, "route");
  checkSourceRefs("routes.json", list, "route");
  for (const r of list) {
    if (r.fromPlaceId && !knownIds.places.has(r.fromPlaceId)) err(`routes.json: route "${r.id}" fromPlaceId "${r.fromPlaceId}" not found in places.json`);
    if (r.toPlaceId && !knownIds.places.has(r.toPlaceId)) err(`routes.json: route "${r.id}" toPlaceId "${r.toPlaceId}" not found in places.json`);
    for (const via of r.viaPlaceIds ?? []) {
      if (!knownIds.places.has(via)) err(`routes.json: route "${r.id}" viaPlaceId "${via}" not found in places.json`);
    }
  }
}

// water.json
if (docs["water.json"]) {
  const list = docs["water.json"].waterPoints ?? [];
  checkUniqueIds("water.json", list, "waterPoint");
  checkSourceRefs("water.json", list, "waterPoint");
  checkBoundingBox("water.json", list, "waterPoint", (w) => w.coordinates);
  for (const w of list) {
    if (w.waterType && !WATER_TYPES.has(w.waterType)) err(`water.json: waterPoint "${w.id}" invalid waterType "${w.waterType}"`);
    if (w.status && !WATER_STATUS.has(w.status)) err(`water.json: waterPoint "${w.id}" invalid status "${w.status}" (water uses its own status enum, not neutral/orange/red)`);
    if (w.treatment && !TREATMENT_VALUES.has(w.treatment)) err(`water.json: waterPoint "${w.id}" invalid treatment "${w.treatment}"`);
    if (w.confidence && !CONFIDENCE_VALUES.has(w.confidence)) err(`water.json: waterPoint "${w.id}" invalid confidence "${w.confidence}"`);
  }
  for (const p of docs["water.json"].dayWaterPlans ?? []) {
    if (!knownIds.days.has(p.dayId)) err(`water.json: dayWaterPlan references unknown dayId "${p.dayId}"`);
  }
}

// accommodation.json / food.json
for (const [fname, key, label] of [["accommodation.json", "accommodations", "accommodation"], ["food.json", "foodPlaces", "foodPlace"]]) {
  if (docs[fname]) {
    const list = docs[fname][key] ?? [];
    checkUniqueIds(fname, list, label);
    checkStatusConfidence(fname, list, label);
    checkSourceRefs(fname, list, label);
    for (const item of list) {
      if (item.placeId && !knownIds.places.has(item.placeId)) err(`${fname}: ${label} "${item.id}" placeId "${item.placeId}" not found in places.json`);
    }
  }
}

// transport.json
if (docs["transport.json"]) {
  const list = docs["transport.json"].transportLegs ?? [];
  checkUniqueIds("transport.json", list, "transportLeg");
  checkStatusConfidence("transport.json", list, "transportLeg");
  checkSourceRefs("transport.json", list, "transportLeg");
}

// attractions.json
if (docs["attractions.json"]) {
  const list = docs["attractions.json"].attractions ?? [];
  checkUniqueIds("attractions.json", list, "attraction");
  checkStatusConfidence("attractions.json", list, "attraction");
  checkSourceRefs("attractions.json", list, "attraction");
  for (const a of list) {
    if (a.category && !POI_CATEGORIES.has(a.category)) err(`attractions.json: attraction "${a.id}" invalid category "${a.category}"`);
    if (a.placeId && !knownIds.places.has(a.placeId)) warn(`attractions.json: attraction "${a.id}" placeId "${a.placeId}" not found in places.json`);
  }
}

// alerts.json
if (docs["alerts.json"]) {
  const list = docs["alerts.json"].alerts ?? [];
  checkUniqueIds("alerts.json", list, "alert");
  checkStatusConfidence("alerts.json", list, "alert");
  checkSourceRefs("alerts.json", list, "alert");
  for (const a of list) {
    for (const rid of a.affects?.routeIds ?? []) {
      if (!knownIds.routes.has(rid)) err(`alerts.json: alert "${a.id}" references unknown routeId "${rid}"`);
    }
  }
}

// itinerary.json
if (docs["itinerary.json"]) {
  const list = docs["itinerary.json"].days ?? [];
  checkUniqueIds("itinerary.json", list, "day");
  checkStatusConfidence("itinerary.json", list, "day");
  checkSourceRefs("itinerary.json", list, "day");
  for (const d of list) {
    if (!d.date) err(`itinerary.json: day "${d.id}" missing date`);
    if (d.routeId && !knownIds.routes.has(d.routeId)) err(`itinerary.json: day "${d.id}" routeId "${d.routeId}" not found in routes.json`);
    for (const id of d.accommodationIds ?? []) if (!knownIds.accommodation.has(id)) err(`itinerary.json: day "${d.id}" accommodationId "${id}" not found`);
    for (const id of d.foodIds ?? []) if (!knownIds.food.has(id)) err(`itinerary.json: day "${d.id}" foodId "${id}" not found`);
    for (const id of d.waterIds ?? []) if (!knownIds.water.has(id)) err(`itinerary.json: day "${d.id}" waterId "${id}" not found`);
    for (const id of d.transportIds ?? []) if (!knownIds.transport.has(id)) err(`itinerary.json: day "${d.id}" transportId "${id}" not found`);
  }
}

// changelog.json — structural only
if (docs["changelog.json"]) {
  for (const e of docs["changelog.json"].entries ?? []) {
    for (const field of ["date", "entityId", "field", "oldValue", "newValue", "reason", "source"]) {
      if (!(field in e)) err(`changelog.json: entry missing required field "${field}"`);
    }
  }
}

console.log(`Validated ${files.length} data files.`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
}
if (errors.length) {
  console.log(`\n${errors.length} error(s):`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  process.exit(1);
} else {
  console.log("\n✓ No errors.");
}
