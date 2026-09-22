import { defineConfig } from "vite";

// Base path matches the GitHub Pages project-site URL (repo name).
// Change here (not in components) if the repo is ever renamed.
export default defineConfig({
  base: "/lycian-way-2026/",
  build: {
    target: "es2020",
    sourcemap: true
  }
});
