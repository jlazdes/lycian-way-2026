# HANDOFF — Lycian Way 2026

Live: https://jlazdes.github.io/lycian-way-2026/

## What it is

Mobile-first offline PWA for a 3-person trek on the Lycian Way, 8–18 Oct 2026:
Ölüdeniz (8 Oct) → walking days 9–13 Oct (Ovacık → Kabak → Alınca → Yediburunlar →
Patara → Xanthos) → dolmuş to Kaş → Kaş 14–17 Oct → flight 18 Oct.
Vanilla JS + Vite + MapLibre GL. No backend.

## Structure

- `data/*.json` — trip facts (hand-edited, checked by `npm run validate`).
  - `trail.json`, `pois.json`, `corridor.geojson` — **generated** by `scripts/build-trail.mjs`, don't hand-edit.
- `content/knowledge/*.md` — Knowledge Base articles.
- `src/main.js` — shell + hash router. Screens in `src/screens/`:
  - `map.js` — full-screen map, Today checklist widget, POI panel (right on desktop, bottom sheet on mobile),
    «Где я» GPS button + panel, «Только вода», GPX export, demo.
  - `itinerary.js` — day list + day card (AllTrails numbers, track numbers, elevation profile, water list).
  - `kb.js` — Knowledge Base home incl. **Save for offline** (data, offline map download, add-to-home-screen help).
- `src/lib/`
  - `trail.js` — master trail, km-along-trail, water ahead, elevation profile SVG, Tobler.
  - `map.js` — MapLibre wrapper; picks the basemap (online OpenFreeMap / offline Protomaps extract / blank).
  - `mapMarkers.js` — all markers; `offline.js` — caches + map download; `gpx.js` — GPX export.
- `public/sw.js` — service worker. Precache list is injected at build time (`vite.config.js` plugin).
- `public/offline/` — self-hosted offline basemap (Protomaps corridor extract + fonts + sprites + manifest).
- `scripts/build-trail.mjs` — GPX cleaning → `data/trail.json`, `data/pois.json` (needs network).
- `scripts/build-offline-map.mjs` — corridor extract → `public/offline/` (needs `pmtiles` CLI).

## Data pipeline (run only when the track or corridor changes)

1. Put the source GPX at `sources/lycian_08-181026.gpx` (gitignored — third-party recording,
   trekkingmania 2024; the original is in the trip folder on Julia's Mac).
2. `node scripts/build-trail.mjs` — splits the GPX at >300 m gaps, keeps the segment through the Ovacık
   trailhead and Letoon, cuts it into days by fixed anchor points, fetches elevations once
   (OpenTopoData SRTM 30 m, Open-Meteo fallback; cached in `sources/elevation-cache.json`), pulls OSM water
   (springs/taps/drinking water ≤1 km) and shops/cafés (≤300 m) via Overpass, keeps GPX waypoints ≤3 km.
3. `PMTILES_BIN=/path/to/pmtiles node scripts/build-offline-map.mjs` — re-extracts the offline basemap.
4. `npm run validate && npm run build`.

## Deploy

GitHub Pages serves the `gh-pages` branch (the Actions workflow is gitignored — the token lacks `workflow` scope).
```
npm run build
git worktree add ../lw-ghpages gh-pages   # once
rsync -a --delete --exclude .git dist/ ../lw-ghpages/   # dist contains .nojekyll — required, or Pages hides the .md articles
cd ../lw-ghpages && git add -A && git commit -m "Deploy: …" && git push origin gh-pages
```
Bump `CACHE_NAME` in `public/sw.js` + `src/lib/offline.js` only if old caches must be dropped.

## Offline — what works

After one online visit (service worker precaches everything): map screen, track, every marker and card,
day cards with elevation profiles and water lists, KB, GPX export, «Где я» (GPS needs no internet).
Basemap offline: only after «Скачать карту маршрута» (≈3 MB, corridor ±2 km, zoom ≤15). Without it the
trail and markers show on a plain background.
Online tiles (OpenFreeMap) are never bulk-cached — their ToS forbids automated collection.

## Privacy

Public repo + public site: no full names, ticket numbers, booking codes, emails or personal phones.
Hotel name/address/phone and flight numbers/times are fine. **Note:** git history before 2026-10-07 still
contains booking codes / names in `data/transport.json`, `data/sources.json`, `data/itinerary.json`
— rewriting history needs a force-push (not done without approval).

## Status (2026-10-07)

Done and verified on the live URL (desktop + 390 px, offline after warm-up, 0 console errors):
- P0: cleaned per-day trail with DEM elevations; itinerary 8–18 Oct; hotel/flights; Kabak camps + cafés with
  Google Maps links; water (OSM sources/taps + "buy" points, two icons, «Только вода», per-day water list with km);
  «Где я» (km to day finish, next water ahead, «Вы в N м от тропы», permission help iOS/Android);
  PWA precache + «Скачать карту маршрута» (size up front, progress); GPX export (trk per day + water/lodging wpt).
- P1: «Измерить» A→Б along our track (distance, gain/loss, Tobler estimate, mini profile, open point in
  Organic Maps / maps.me / Google Maps); layers Карта / Топо (OpenTopoMap) / Спутник (Esri) — the last two online only.
- P2: Gaia-style tokens (approved «строго как Gaia»): red teardrop pins, red 3 px trail, black sheets, etc.

Track vs AllTrails (AllTrails shown as the headline everywhere):
| Day | AllTrails | Our track | Δ |
|---|---|---|---|
| 9 Oct | 18.8 km / +807 | 18.4 km / +792 | −2% / −2% |
| 10 Oct | 6.3 km / +773 | 6.5 km / +804 | +4% / +4% |
| 11 Oct | 8 km / +349 | 7.5 km / +332 | −6% / −5% |
| 12 Oct | 16.7 km / +457 | 19.0 km / +553 | +13% / **+21%** |
| 13 Oct | 13 km (plan) | 11.6 km / +18 | −11% |

Open / not done:
- Yediburunlar Lighthouse Boutique Hotel — role/date not confirmed, deliberately not added.
- Topo layer is online-only (OpenTopoMap forbids bulk download); offline = corridor basemap.
- Dolmuş Adaköy/Gelemiş → Kaş schedule, Kaş → AYT transfer for 18 Oct 04:10 — not researched.
- OSM springs are unverified for October; cards say so.
- Phones that opened the old version need to open the app twice online to pick up the new service worker.
- Pre-existing: Today widget's "Completed" header is visible even when empty (CSS `display:flex` beats `hidden`);
  left untouched because the widget is out of scope.
- Git history still contains personal data (see Privacy).
