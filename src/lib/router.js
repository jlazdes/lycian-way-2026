// Minimal hash router — no framework. Routes map to a render(container, params) function.

const routes = [];
let routeChangeListener = null;
const DEFAULT_HASH = "#/map";

export function registerRoute(pattern, render) {
  // pattern like "#/day/:id" -> regex with named group
  const paramNames = [];
  const regexStr = pattern.replace(/:([\w]+)/g, (_, name) => {
    paramNames.push(name);
    return "([^/]+)";
  });
  const regex = new RegExp(`^${regexStr}$`);
  routes.push({ regex, paramNames, render });
}

export function onRouteChange(listener) {
  routeChangeListener = listener;
}

export function navigate(hash) {
  if (location.hash !== hash) location.hash = hash;
  else render();
}

function matchRoute(hash) {
  for (const r of routes) {
    const m = hash.match(r.regex);
    if (m) {
      const params = {};
      r.paramNames.forEach((name, i) => (params[name] = decodeURIComponent(m[i + 1])));
      return { render: r.render, params };
    }
  }
  return null;
}

async function render() {
  const container = document.getElementById("screen");
  const hash = location.hash || DEFAULT_HASH;
  const match = matchRoute(hash);
  routeChangeListener?.(hash);
  if (!match) {
    container.innerHTML = `<div class="screen-pad"><p>Not found.</p></div>`;
    return;
  }
  try {
    await match.render(container, match.params);
  } catch (e) {
    console.error(e);
    container.innerHTML = `<div class="screen-pad"><p>Something went wrong loading this screen.</p></div>`;
  }
}

export function startRouter() {
  window.addEventListener("hashchange", render);
  render();
}
