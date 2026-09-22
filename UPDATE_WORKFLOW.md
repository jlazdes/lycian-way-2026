# Update workflow

This app is built so that almost every future change is a data edit, not a code change.

## For a factual/data update

1. Edit the relevant file in `/data/*.json` or `/content/knowledge/*.md`.
2. Run `npm run validate`.
3. Run `npm run dev` and check the affected screen in the browser.
4. If the change corrects a previously-recorded fact (not just fills in a blank), add an entry to `/data/changelog.json`: `date`, `entityId`, `field`, `oldValue`, `newValue`, `reason`, `source`.
5. Commit only the changed files.

Examples of pure data edits, no code required:
- "Change this water source from uncertain to confirmed" → edit its record in `data/water.json`.
- "Move the campsite" → edit `coordinates` on its record in `data/places.json`.
- "Add a new fuel seller" → append to `data/fuel.json`, cite a `sources.json` entry.
- "Replace the 12 October route" → edit `data/routes.json` + `data/itinerary.json` day record.
- "Mark this trail orange" → set `status: "orange"` and fill `notes` on the route/variant.

## Adding a new source

Every `sources` array anywhere in `/data` must point at an id that exists in `data/sources.json`. Add the source record there first — `npm run validate` will fail loudly with the exact missing id if you forget.

## When you actually need a code change

Only reach for `/src` when the *shape* of the data changes (a new field the UI needs to display, a new screen, a new status enum value). Keep new fields optional/additive where possible so old records don't need a bulk rewrite.

## Bounding box / map

If a new place falls outside `data/config.json`'s `map.boundingBox`, the validator will flag it — widen the box there rather than silently dropping the check.

## Validator

`npm run validate` (`scripts/validate.js`) checks: malformed JSON, duplicate ids, coordinates inside the trip bounding box, dangling references between files (routes ↔ places, days ↔ routes/water/food/accommodation/transport, any `sources` reference), and that `status`/`confidence`/category values are from the allowed enums. It's deliberately hand-rolled and dependency-free — keep it that way unless it gets genuinely unwieldy.
