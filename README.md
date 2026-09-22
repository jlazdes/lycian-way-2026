# Lycian Way 2026 — Trip OS

Mobile-first, offline-capable PWA field guide for a 3-person Lycian Way trek, 8–18 Oct 2026. Vanilla JS + Vite, no framework. See [UPDATE_WORKFLOW.md](UPDATE_WORKFLOW.md) for how to make factual/data changes without touching app code.

## Local development

```bash
npm install
npm run dev
```

## Validate data

```bash
npm run validate
```

Run this before every commit that touches `/data`.

## Production build

```bash
npm run build
npm run preview   # serve the built dist/ locally to sanity-check
```

## Deploy (GitHub Pages)

Push to `main` — `.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages automatically. `vite.config.js`'s `base` must match the repo name.

## Layout

- `/data` — all trip facts, as structured JSON. Edit this for almost any factual update.
- `/content/knowledge` — knowledge-base articles (Markdown + frontmatter).
- `/assets` — icons and photos.
- `/src` — app shell, screens, and lib code. Screens read from `/data`, never hardcode trip facts.
- `/scripts/validate.js` — data validator (`npm run validate`).

`public/data`, `public/content`, and `public/assets` are symlinks to the top-level directories above, so the same files are both easy to edit at the repo root and directly servable by Vite/GitHub Pages.
