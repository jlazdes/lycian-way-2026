(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function a(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=a(s);fetch(s.href,o)}})();const A="lycian-2026-v1";function oe(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/lycian-way-2026/sw.js").catch(e=>console.warn("SW registration failed",e))})}const ie=["config","trip","itinerary","routes","places","water","accommodation","food","fuel","transport","alerts","attractions","sources","changelog"],ce=["before-we-leave","water","food","fuel","sleep","transport","route-decisions","safety","ancient-lycia","turkish-phrases","hiker-reports"];function le(){const e=new Set;return document.querySelectorAll("script[src]").forEach(t=>e.add(t.src)),document.querySelectorAll('link[rel="stylesheet"]').forEach(t=>e.add(t.href)),document.querySelectorAll('link[rel="icon"], link[rel="manifest"]').forEach(t=>e.add(t.href)),[...e].filter(t=>t.startsWith(location.origin))}async function de(e){if(!("caches"in window))throw new Error("Cache API not supported in this browser.");const t="/lycian-way-2026/",a=[location.origin+t,`${t}index.html`,`${t}manifest.webmanifest`,...le(),...ie.map(o=>`${t}data/${o}.json`),...ce.map(o=>`${t}content/knowledge/${o}.md`)],n=await caches.open(A);let s=0;for(const o of a){try{await n.add(o)}catch(l){console.warn(`Could not cache ${o}`,l)}s+=1,e?.(s,a.length)}return{cached:s,total:a.length}}async function pe(){return!("caches"in window)||!await caches.has(A)?!1:(await(await caches.open(A)).keys()).length>0}const U=[];function h(e,t){const a=[],n=e.replace(/:([\w]+)/g,(o,l)=>(a.push(l),"([^/]+)")),s=new RegExp(`^${n}$`);U.push({regex:s,paramNames:a,render:t})}function ue(e){for(const t of U){const a=e.match(t.regex);if(a){const n={};return t.paramNames.forEach((s,o)=>n[s]=decodeURIComponent(a[o+1])),{render:t.render,params:n}}}return null}async function R(){const e=document.getElementById("screen"),t=location.hash||"#/today",a=ue(t);if(me(t),!a){e.innerHTML='<div class="screen-pad"><p>Not found.</p></div>';return}try{await a.render(e,a.params)}catch(n){console.error(n),e.innerHTML='<div class="screen-pad"><p>Something went wrong loading this screen.</p></div>'}}function me(e){const t="#/"+e.slice(2).split("/")[0];document.querySelectorAll(".nav a").forEach(a=>{a.classList.toggle("nav__link--active",a.getAttribute("href")===t||t==="#/today"&&a.getAttribute("href")==="#/today")})}function fe(){window.addEventListener("hashchange",R),R()}const x=new Map;function K(){return"/lycian-way-2026/"}async function v(e){if(x.has(e))return x.get(e);const t=await fetch(`${K()}data/${e}.json`);if(!t.ok)throw new Error(`Failed to load data/${e}.json: ${t.status}`);const a=await t.json();return x.set(e,a),a}const $=()=>v("config").then(e=>e),O=()=>v("itinerary").then(e=>e.days),D=()=>v("routes").then(e=>e.routes),z=()=>v("places").then(e=>e.places),_=()=>v("water"),V=()=>v("accommodation").then(e=>e.accommodations),X=()=>v("food").then(e=>e.foodPlaces),ge=()=>v("fuel"),J=()=>v("transport").then(e=>e.transportLegs),Y=()=>v("alerts").then(e=>e.alerts),Q=()=>v("attractions").then(e=>e.attractions),he=()=>v("sources").then(e=>e.sources);he().then(e=>{const t=new Map;for(const a of e)t.set(a.id,a);return t});async function ve(e){return(await O()).find(a=>a.id===e)}async function Z(e){return e?(await D()).find(a=>a.id===e):null}async function q(e){return e?(await z()).find(a=>a.id===e):null}async function ye(){return["before-we-leave","water","food","fuel","sleep","transport","route-decisions","safety","ancient-lycia","turkish-phrases","hiker-reports"]}async function ee(e){const t=`knowledge:${e}`;if(x.has(t))return x.get(t);const a=await fetch(`${K()}content/knowledge/${e}.md`);if(!a.ok)throw new Error(`Failed to load knowledge/${e}.md: ${a.status}`);const n=await a.text(),s=$e(n);return x.set(t,s),s}function $e(e){const t=e.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);if(!t)return{meta:{},body:e};const[,a,n]=t,s={};for(const o of a.split(`
`)){const l=o.match(/^(\w+):\s*(.*)$/);if(!l)continue;const[,p,c]=l;c.startsWith("[")&&c.endsWith("]")?s[p]=c.slice(1,-1).split(",").map(d=>d.trim()).filter(Boolean):s[p]=c.trim()}return{meta:s,body:n.trim()}}const B={neutral:"#5b6b73",orange:"#d97706",red:"#c62828"};function I(e,t){return e?.status?.[t]?.color??B[t]??B.neutral}function we(e,t){return e?.status?.[t]?.label??t}const be={confirmed_available:"neutral",seasonal:"orange",uncertain:"orange",reported_dry:"red",confirmed_unavailable:"red"};function ke(e){return be[e]??"orange"}function g(e,t,{small:a=!1}={}){const n=I(e,t),s=we(e,t);return`<span class="${a?"status-badge status-badge--small":"status-badge"}" style="--status-color:${n}" title="${r(s)}">
    <span class="status-badge__dot"></span>${t==="orange"||t==="red"?'<span class="status-badge__warn">&#9650;</span>':""}
  </span>`}function r(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let F=null;const E=new Set;let S=null,L=null;function H(e){return E.add(e),(S||L)&&e({position:S,error:L}),()=>E.delete(e)}function j(){for(const e of E)e({position:S,error:L})}function C(){if(F===null){if(!("geolocation"in navigator)){L={code:"unsupported",message:"Geolocation not supported in this browser."},j();return}F=navigator.geolocation.watchPosition(e=>{S={lat:e.coords.latitude,lon:e.coords.longitude,accuracy:e.coords.accuracy,timestamp:e.timestamp},L=null,j()},e=>{L={code:e.code,message:e.message},j()},{enableHighAccuracy:!0,maximumAge:5e3,timeout:15e3})}}function xe(){return S}function Le(e,t){const a=new Date().toISOString().slice(0,10),n=t.trip.startDate,s=t.trip.endDate;return a<n?e[0]:a>s?e[e.length-1]:e.find(o=>o.date===a)??e[0]}async function Pe(e){const[t,a,n]=await Promise.all([$(),O(),Y()]),s=Le(a,t),o=await Z(s.routeId),l=await pe();e.innerHTML=`
    <div class="screen-pad">
      <div class="card">
        <div class="pill-row"><span class="pill">${r(s.date)}</span>${g(t,s.status)}</div>
        <h3>${r(s.title)}</h3>
        <p>${r(s.summary)}</p>
        ${o?`<p>${o.metrics[0]?.distanceKm??"?"} km &middot; +${o.metrics[0]?.ascentM??"?"} m ascent (source: ${r(o.metrics[0]?.source??"unknown")})</p>`:""}
        ${s.tasks?.length?`<div class="section-title">Tasks</div><ul class="warn-list" style="color:var(--text-dim)">${s.tasks.map(c=>`<li style="color:var(--text-dim)">${r(c)}</li>`).join("")}</ul>`:""}
        ${s.watchOut?.length?`<div class="section-title">Watch out</div><ul class="warn-list">${s.watchOut.map(c=>`<li>${r(c)}</li>`).join("")}</ul>`:""}
        <div class="link-row">
          <a class="btn btn-secondary" href="#/itinerary/${s.id}">Full day view</a>
        </div>
      </div>

      ${n.length?`
        <div class="section-title">Active warnings</div>
        ${n.map(c=>`
          <div class="card">
            ${g(t,c.status)} <strong>${r(c.title)}</strong>
            <p>${r(c.description)}</p>
          </div>
        `).join("")}
      `:""}

      <div class="section-title">GPS</div>
      <div class="card" id="today-gps">
        <p>Requesting location…</p>
      </div>

      <div class="section-title">Offline</div>
      <div class="card">
        <p id="offline-status">${l?"Trip data is saved for offline use.":"Trip data is not yet saved for offline use."}</p>
        <button class="btn" id="save-offline-btn">Save for offline</button>
      </div>
    </div>
  `;const p=e.querySelector("#today-gps");H(({position:c,error:d})=>{c?p.innerHTML=`
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="gps-marker"></div>
          <div>
            <p style="margin:0">${c.lat.toFixed(5)}, ${c.lon.toFixed(5)}</p>
            <p style="margin:0">±${Math.round(c.accuracy)} m &middot; updated ${new Date(c.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      `:d&&(p.innerHTML=`<p>Location unavailable (${r(d.message)}). The app works fine without it.</p>`)}),C(),e.querySelector("#save-offline-btn").addEventListener("click",async c=>{const d=c.currentTarget;d.disabled=!0,d.textContent="Saving…";try{await de((u,m)=>d.textContent=`Saving ${u}/${m}…`),e.querySelector("#offline-status").textContent="Trip data saved for offline use.",d.textContent="Saved"}catch(u){d.textContent="Save failed — retry",d.disabled=!1,console.error(u)}})}const Te="modulepreload",Se=function(e){return"/lycian-way-2026/"+e},N={},Me=function(t,a,n){let s=Promise.resolve();if(a&&a.length>0){let l=function(d){return Promise.all(d.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const p=document.querySelector("meta[property=csp-nonce]"),c=p?.nonce||p?.getAttribute("nonce");s=l(a.map(d=>{if(d=Se(d),d in N)return;N[d]=!0;const u=d.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${m}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":Te,u||(f.as="script"),f.crossOrigin="",f.href=d,c&&f.setAttribute("nonce",c),document.head.appendChild(f),u)return new Promise((w,b)=>{f.addEventListener("load",w),f.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${d}`)))})}))}function o(l){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=l,window.dispatchEvent(p),!p.defaultPrevented)throw l}return s.then(l=>{for(const p of l||[])p.status==="rejected"&&o(p.reason);return t().catch(o)})};function P(e,[t,a],n,s,o){const l=o+(t-e.west)/(e.east-e.west)*(n-2*o),p=o+(1-(a-e.south)/(e.north-e.south))*(s-2*o);return[l,p]}function je(e,{config:t,places:a,routes:n,water:s,gpsPosition:o}){const l=t.map.boundingBox,p=400,c=520,d=24,u=new Map(a.map(i=>[i.id,i])),m=n.map(i=>{const y=u.get(i.fromPlaceId),k=u.get(i.toPlaceId);if(!y||!k)return"";const[M,te]=P(l,y.coordinates,p,c,d),[ne,se]=P(l,k.coordinates,p,c,d),ae=i.geometry?.coordinates?.length>0,re=I(t,i.status);return`<line x1="${M}" y1="${te}" x2="${ne}" y2="${se}" stroke="${re}" stroke-width="3" ${ae?"":'stroke-dasharray="6 5"'} opacity="0.85"/>`}).join(""),f=a.map(i=>{const[y,k]=P(l,i.coordinates,p,c,d),M=I(t,i.status);return`
      <circle cx="${y}" cy="${k}" r="5" fill="${M}" stroke="#0e1613" stroke-width="1.5"/>
      <text x="${y+8}" y="${k+4}" font-size="9" fill="#eef2ee">${r(i.name)}</text>
    `}).join(""),w=(s?.waterPoints??[]).map(i=>{const[y,k]=P(l,i.coordinates,p,c,d);return`<circle cx="${y}" cy="${k}" r="4" fill="#4fc3f7" stroke="#0e1613" stroke-width="1.2"/>`}).join(""),b=o?(()=>{const[i,y]=P(l,[o.lon,o.lat],p,c,d);return`<circle cx="${i}" cy="${y}" r="7" fill="#4fc3f7" opacity="0.9"><animate attributeName="r" values="7;13;7" dur="1.6s" repeatCount="indefinite"/></circle>`})():"";e.innerHTML=`
    <div style="text-align:center;">
      <svg viewBox="0 0 ${p} ${c}" style="width:100%;max-width:420px;background:#182420;border-radius:10px;border:1px solid var(--border);">
        ${m}
        ${w}
        ${f}
        ${b}
      </svg>
      <p style="color:var(--text-dim);font-size:0.75rem;margin-top:8px;">
        Offline corridor view — dashed lines are straight-line placeholders, not surveyed track geometry.
        Blue dots are water points.
      </p>
    </div>
  `}function G(e,t,a,n){return`  <wpt lat="${t}" lon="${e}"><name>${W(a)}</name>${n?`<desc>${W(n)}</desc>`:""}</wpt>`}function W(e){return String(e??"").replace(/[<>&'"]/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"})[t])}function Ae({places:e,routes:t,water:a,attractions:n,alerts:s}){const o=[];for(const c of e)o.push(G(c.coordinates[0],c.coordinates[1],c.name,"place"));for(const c of a?.waterPoints??[])o.push(G(c.coordinates[0],c.coordinates[1],`Water: ${c.name}`,`${c.waterType} / ${c.status}`));const l=new Map(e.map(c=>[c.id,c])),p=t.map(c=>{const u=(c.geometry?.coordinates?.length?c.geometry.coordinates:[l.get(c.fromPlaceId)?.coordinates,l.get(c.toPlaceId)?.coordinates].filter(Boolean)).map(([m,f])=>`      <trkpt lat="${f}" lon="${m}"></trkpt>`).join(`
`);return`  <trk><name>${W(c.name)}</name><trkseg>
${u}
    </trkseg></trk>`});return`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Lycian Way 2026 Trip OS" xmlns="http://www.topografix.com/GPX/1/1">
${o.join(`
`)}
${p.join(`
`)}
</gpx>`}function Ie(e,t="lycian-way-2026.gpx"){const a=new Blob([e],{type:"application/gpx+xml"}),n=URL.createObjectURL(a),s=document.createElement("a");s.href=n,s.download=t,s.click(),URL.revokeObjectURL(n)}async function Ee(e){const[t,a,n,s,o,l]=await Promise.all([$(),z(),D(),_(),Q(),Y()]),p=navigator.onLine&&!!t.map.tileProvider.styleUrl;e.innerHTML=`
    <div class="screen-pad">
      <div class="section-title">Map</div>
      ${t.map.tileProvider.styleUrl?"":'<p class="empty-state">No live tile provider configured yet — showing the offline corridor view. See data/config.json map.tileProvider.styleUrl.</p>'}
      <div id="map-canvas-wrap"></div>
      <div class="link-row">
        <button class="btn" id="gpx-btn">Download GPX</button>
      </div>
    </div>
  `;const c=e.querySelector("#map-canvas-wrap");async function d(){je(c,{config:t,places:a,routes:n,water:s,gpsPosition:xe()})}if(p)try{const{mountMapLibre:u}=await Me(async()=>{const{mountMapLibre:m}=await import("./map-WlRxDYCM.js");return{mountMapLibre:m}},[]);c.innerHTML='<div id="maplibre-container"></div>',await u(c.querySelector("#maplibre-container"),{config:t,places:a})}catch(u){console.warn("MapLibre failed to load, falling back to offline corridor view",u),await d()}else await d();H(()=>{p||d()}),C(),e.querySelector("#gpx-btn").addEventListener("click",()=>{const u=Ae({places:a,routes:n,water:s,attractions:o,alerts:l});Ie(u)})}async function We(e){const[t,a]=await Promise.all([$(),O()]);e.innerHTML=`
    <div class="screen-pad">
      <div class="section-title">Itinerary</div>
      ${a.map(n=>`
        <a href="#/itinerary/${n.id}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <div class="pill-row"><span class="pill">${r(n.date)}</span>${g(t,n.status)}</div>
          <h3>${r(n.title)}</h3>
          <p>${r(n.summary)}</p>
        </a>
      `).join("")}
    </div>
  `}async function Oe(e,{dayId:t}){const[a,n]=await Promise.all([$(),ve(t)]);if(!n){e.innerHTML='<div class="screen-pad"><p>Day not found.</p></div>';return}const[s,o,l,p,c]=await Promise.all([Z(n.routeId),Promise.resolve(n.accommodationIds??[]),X(),_(),J()]),d=(await V()).filter(i=>n.accommodationIds?.includes(i.id)),u=l.filter(i=>n.foodIds?.includes(i.id)),m=p.waterPoints.filter(i=>n.waterIds?.includes(i.id)),f=c.filter(i=>n.transportIds?.includes(i.id));let w=null,b=null;s&&([w,b]=await Promise.all([q(s.fromPlaceId),q(s.toPlaceId)])),e.innerHTML=`
    <div class="screen-pad">
      <a href="#/itinerary" class="btn-secondary btn" style="margin-bottom:12px;display:inline-block;">&larr; All days</a>
      <div class="pill-row"><span class="pill">${r(n.date)}</span>${g(a,n.status)}</div>
      <h2 style="margin:6px 0;">${r(n.title)}</h2>
      <p>${r(n.summary)}</p>

      ${s?`
        <div class="card">
          <h3>Route</h3>
          <p>${w?r(w.name):"?"} &rarr; ${b?r(b.name):"?"}</p>
          ${s.metrics.map(i=>`<p>${i.distanceKm} km &middot; +${i.ascentM} m &middot; source: ${r(i.source)} (${r(i.date)})</p>`).join("")}
          ${s.variants?.length?s.variants.map(i=>`
            <p>${g(a,i.status)} <strong>${r(i.name)}</strong> — ${r(i.notes)}</p>
          `).join(""):""}
          ${s.notes?`<p><em>${r(s.notes)}</em></p>`:""}
        </div>
      `:""}

      ${n.tasks?.length?`<div class="section-title">Tasks</div><div class="card"><ul>${n.tasks.map(i=>`<li>${r(i)}</li>`).join("")}</ul></div>`:""}
      ${n.preTripTasks?.length?`<div class="section-title">Pre-trip tasks</div><div class="card"><ul>${n.preTripTasks.map(i=>`<li>${r(i)}</li>`).join("")}</ul></div>`:""}

      ${m.length?`<div class="section-title">Water</div>${m.map(i=>`
        <div class="card"><h3>${r(i.name)}</h3><p>${r(i.waterType)} &middot; ${r(i.status)} &middot; ${r(i.treatment)}</p><p>${r(i.notes)}</p></div>
      `).join("")}`:""}

      ${u.length?`<div class="section-title">Food</div>${u.map(i=>`
        <div class="card">${g(a,i.status)} <strong>${r(i.name)}</strong> <p>${r(i.notes)}</p></div>
      `).join("")}`:""}

      ${d.length?`<div class="section-title">Sleep</div>${d.map(i=>`
        <div class="card">${g(a,i.status)} <strong>${r(i.name)}</strong><p>${r(i.priceInfo)}</p><p>${r(i.notes)}</p></div>
      `).join("")}`:""}

      ${f.length?`<div class="section-title">Transport</div>${f.map(i=>`
        <div class="card">${g(a,i.status)} <strong>${r(i.name)}</strong><p>${r(i.notes)}</p></div>
      `).join("")}`:""}

      ${n.highlights?.length?`<div class="section-title">Highlights</div><div class="card"><ul>${n.highlights.map(i=>`<li>${r(i)}</li>`).join("")}</ul></div>`:""}
      ${n.watchOut?.length?`<div class="section-title">Watch out</div><ul class="warn-list">${n.watchOut.map(i=>`<li>${r(i)}</li>`).join("")}</ul>`:""}
      ${n.backupPlan?`<div class="section-title">Backup plan</div><div class="card">${r(n.backupPlan)}</div>`:""}
      ${n.notes?`<p style="color:var(--text-dim);font-size:0.8rem;">${r(n.notes)}</p>`:""}
    </div>
  `}async function _e(e){const[t,a]=await Promise.all([$(),_()]),n=t.water.defaultCapacityLitersPerPerson;e.innerHTML=`
    <div class="screen-pad">
      <div class="section-title">Water points</div>
      ${a.waterPoints.length?a.waterPoints.map(s=>`
        <div class="card">
          ${g(t,ke(s.status))}
          <strong>${r(s.name)}</strong>
          <p>${r(s.waterType)} &middot; status: ${r(s.status)} &middot; treatment: ${r(s.treatment)}</p>
          <p>Confidence: ${r(s.confidence)} &middot; last verified ${r(s.lastVerified)}</p>
          <p>${r(s.notes)}</p>
        </div>
      `).join(""):'<p class="empty-state">No water points recorded yet.</p>'}

      <div class="section-title">Per-day water planning (capacity: ${n} L/person)</div>
      ${a.dayWaterPlans.length?a.dayWaterPlans.map(s=>`
        <div class="card">
          <strong>${r(s.dayId)}</strong>
          <p>Longest known gap: ${s.longestKnownGapKm!=null?s.longestKnownGapKm+" km":"unknown"}</p>
          <p>Risk: ${r(s.risk)}</p>
          <p>${r(s.notes)}</p>
        </div>
      `).join(""):'<p class="empty-state">No per-day water plans recorded yet.</p>'}
    </div>
  `}async function He(e){const[t,a,n]=await Promise.all([$(),X(),ge()]);e.innerHTML=`
    <div class="screen-pad">
      <div class="section-title">Food &amp; shops</div>
      ${a.length?a.map(s=>`
        <div class="card">
          ${g(t,s.status)} <strong>${r(s.name)}</strong>
          <p>${r(s.category)} &middot; confidence: ${r(s.confidence)}</p>
          <p>${r(s.notes)}</p>
        </div>
      `).join(""):'<p class="empty-state">No food/shop records yet.</p>'}

      <div class="section-title">Fuel — ${r(n.fuelType)}</div>
      ${n.sellers.length?n.sellers.map(s=>`
        <div class="card">${g(t,s.status)} <strong>${r(s.name)}</strong></div>
      `).join(""):'<p class="empty-state">No fuel sellers researched yet — pre-trip task. Seller existence and correct canister stock will be tracked separately once found.</p>'}
    </div>
  `}async function Ce(e){const[t,a]=await Promise.all([$(),V()]);e.innerHTML=`
    <div class="screen-pad">
      <div class="section-title">Sleep</div>
      ${a.length?a.map(n=>`
        <div class="card">
          ${g(t,n.status)} <strong>${r(n.name)}</strong>
          <p>${r(n.type)} &middot; ${r(n.priceInfo)}</p>
          <p>Confidence: ${r(n.confidence)} &middot; last verified ${r(n.lastVerified)}</p>
          <p>${r(n.notes)}</p>
        </div>
      `).join(""):'<p class="empty-state">Nothing recorded yet.</p>'}
    </div>
  `}async function Re(e){const[t,a]=await Promise.all([$(),J()]);e.innerHTML=`
    <div class="screen-pad">
      <div class="section-title">Transport</div>
      ${a.map(n=>`
        <div class="card">
          ${g(t,n.status)} <strong>${r(n.name)}</strong>
          ${n.date?`<p>${r(n.date)}</p>`:""}
          <p>Confidence: ${r(n.confidence)}${n.lastVerified?` &middot; last verified ${r(n.lastVerified)}`:""}</p>
          <p>${r(n.notes)}</p>
        </div>
      `).join("")}
    </div>
  `}async function qe(e){const[t,a]=await Promise.all([$(),Q()]);e.innerHTML=`
    <div class="screen-pad">
      <div class="section-title">Places to see</div>
      ${a.map(n=>`
        <div class="card">
          ${g(t,n.status)} <strong>${r(n.name)}</strong>
          <p>${r(n.shortDescription)}</p>
          <p style="font-size:0.75rem;">${r(n.routeDistanceNote)}</p>
          <div class="link-row">
            <a class="btn btn-secondary" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n.name)}">Open in Google Maps</a>
          </div>
        </div>
      `).join("")}
    </div>
  `}function Be(e){const t=e.split(`
`);let a="",n=0;for(;n<t.length;){const s=t[n];if(/^\s*$/.test(s)){n++;continue}if(s.startsWith("# ")){a+=`<h2>${T(s.slice(2))}</h2>`,n++;continue}if(s.startsWith("## ")){a+=`<h3>${T(s.slice(3))}</h3>`,n++;continue}if(s.startsWith("**")&&s.match(/^\*\*.+\*\*/),s.startsWith("|")){const l=[];for(;n<t.length&&t[n].startsWith("|");)l.push(t[n]),n++;a+=Fe(l);continue}if(s.startsWith("- ")){const l=[];for(;n<t.length&&t[n].startsWith("- ");)l.push(t[n].slice(2)),n++;a+=`<ul>${l.map(p=>`<li>${T(p)}</li>`).join("")}</ul>`;continue}const o=[];for(;n<t.length&&!/^\s*$/.test(t[n])&&!t[n].startsWith("|")&&!t[n].startsWith("- ")&&!t[n].startsWith("#");)o.push(t[n]),n++;a+=`<p>${T(o.join(" "))}</p>`}return a}function Fe(e){e.filter(o=>!/^\|[\s-]+\|$/.test((o.replace(/[^|\s-]/g,""),o)));const a=e.filter(o=>!/^\|(\s*-+\s*\|)+$/.test(o)).map(o=>o.split("|").slice(1,-1).map(l=>l.trim()));if(!a.length)return"";const[n,...s]=a;return`<table class="phrases">
    <tbody>
      ${s.map(o=>`<tr>${o.map(l=>`<td>${T(l)}</td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>`}function T(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\[(.+?)\]\((.+?)\)/g,(t,a,n)=>{const s=n.endsWith(".md");return`<a href="${s?`#/knowledge/${n.replace(/\.md$/,"")}`:n}"${s?"":' target="_blank" rel="noopener"'}>${a}</a>`})}async function Ne(e){const t=await ye(),a=await Promise.all(t.map(n=>ee(n).then(s=>[n,s])));e.innerHTML=`
    <div class="screen-pad">
      <div class="section-title">Knowledge base</div>
      ${a.map(([n,s])=>`
        <a href="#/knowledge/${n}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${r(s.meta.title??n)}</h3>
          <p>Confidence: ${r(s.meta.confidence??"?")} &middot; last verified ${r(s.meta.lastVerified??"?")}</p>
        </a>
      `).join("")}
    </div>
  `}async function Ge(e,{slug:t}){const a=await ee(t);e.innerHTML=`
    <div class="screen-pad">
      <a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge base</a>
      <h2>${r(a.meta.title??t)}</h2>
      <p style="color:var(--text-dim);font-size:0.8rem;">Confidence: ${r(a.meta.confidence??"?")} &middot; last verified ${r(a.meta.lastVerified??"?")}</p>
      <div class="card">${Be(a.body)}</div>
    </div>
  `}async function Ue(e){e.innerHTML=`
    <div class="screen-pad">
      <div class="card">
        <h3>Emergency number</h3>
        <p style="font-size:1.6rem;font-weight:700;">112</p>
        <p>Türkiye's single emergency number — police, ambulance, fire.</p>
      </div>

      <div class="card">
        <h3>Forestry Directorate (OGM)</h3>
        <p>For fire-restriction / forest-entry questions: <a href="https://www.ogm.gov.tr/en" target="_blank" rel="noopener">ogm.gov.tr</a></p>
        <p style="color:var(--text-dim);font-size:0.8rem;">A direct local contact number for the Muğla regional directorate has not been looked up yet.</p>
      </div>

      <div class="card">
        <h3>Your current position</h3>
        <div id="emergency-gps"><p>Requesting location…</p></div>
      </div>

      <div class="card">
        <p style="color:var(--text-dim);font-size:0.8rem;">This app is a planning and reference tool. It does not replace a dedicated GPS/satellite communicator for real emergencies in the backcountry.</p>
      </div>
    </div>
  `;const t=e.querySelector("#emergency-gps");H(({position:a,error:n})=>{a?t.innerHTML=`
        <p>${a.lat.toFixed(5)}, ${a.lon.toFixed(5)}</p>
        <p>Accuracy: ±${Math.round(a.accuracy)} m</p>
        <div class="link-row">
          <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lon}">Open in Google Maps</a>
        </div>
      `:n&&(t.innerHTML=`<p>${r(n.message)}</p>`)}),C()}const Ke=[["#/today","Today"],["#/map","Map"],["#/itinerary","Itinerary"],["#/water","Water"],["#/resupply","Resupply"],["#/sleep","Sleep"],["#/transport","Transport"],["#/places","Places"],["#/knowledge","Knowledge"],["#/emergency","Emergency"]];document.getElementById("app").innerHTML=`
  <header class="app-header">
    <h1>Lycian Way 2026</h1>
    <p class="subtitle">8&ndash;18 Oct &middot; Julia, Aziza, Artem</p>
  </header>
  <div id="screen"></div>
  <nav class="nav">
    ${Ke.map(([e,t])=>`<a href="${e}">${t}</a>`).join("")}
  </nav>
`;h("#/today",Pe);h("#/map",Ee);h("#/itinerary",We);h("#/itinerary/:dayId",Oe);h("#/water",_e);h("#/resupply",He);h("#/sleep",Ce);h("#/transport",Re);h("#/places",qe);h("#/knowledge",Ne);h("#/knowledge/:slug",Ge);h("#/emergency",Ue);oe();fe();export{Me as _};
//# sourceMappingURL=index-Bc_Xyr58.js.map
