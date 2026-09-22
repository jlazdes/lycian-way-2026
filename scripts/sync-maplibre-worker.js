#!/usr/bin/env node
// MapLibre GL JS needs its tile-parsing web worker served as a static file, but
// Vite's static-asset analysis doesn't pick it up (maplibre constructs the worker
// URL dynamically at runtime). So we copy the worker + its shared chunk out of
// node_modules into public/vendor/ on every install, keeping them in lockstep
// with whatever maplibre-gl version package.json resolves to.

import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "node_modules", "maplibre-gl", "dist");
const dest = join(root, "public", "vendor");

mkdirSync(dest, { recursive: true });

for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(join(src, file), join(dest, file));
}

console.log("Synced MapLibre worker files into public/vendor/");
