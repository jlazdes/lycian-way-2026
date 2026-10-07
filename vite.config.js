import { defineConfig } from "vite";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

// After the build, write the list of every shipped file into dist/sw.js so the
// service worker can precache the whole app on install (offline after first visit).
// The corridor basemap (dist/offline/) is excluded — it's an explicit user download.
function precacheManifest() {
  return {
    name: "precache-manifest",
    apply: "build",
    closeBundle() {
      const dist = path.resolve("dist");
      const files = [];
      const walk = (dir) => {
        for (const name of readdirSync(dir)) {
          const full = path.join(dir, name);
          const rel = path.relative(dist, full).split(path.sep).join("/");
          if (statSync(full).isDirectory()) {
            if (rel === "offline") continue;
            walk(full);
          } else if (!rel.endsWith(".map") && rel !== "sw.js" && rel !== ".nojekyll" && !rel.endsWith("README.md") && !rel.endsWith(".geojson")) {
            files.push(rel);
          }
        }
      };
      walk(dist);
      files.push("./");
      const swPath = path.join(dist, "sw.js");
      const sw = readFileSync(swPath, "utf8").replace("/*__PRECACHE__*/[]", JSON.stringify(files));
      writeFileSync(swPath, sw);
      console.log(`sw.js: precaching ${files.length} files`);
    },
  };
}

// Base path matches the GitHub Pages project-site URL (repo name).
// Change here (not in components) if the repo is ever renamed.
export default defineConfig({
  base: "/lycian-way-2026/",
  build: {
    target: "es2020",
    sourcemap: true,
  },
  plugins: [precacheManifest()],
});
