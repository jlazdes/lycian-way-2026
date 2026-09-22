(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();const I="lycian-2026-v1";function le(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/lycian-way-2026/sw.js").catch(e=>console.warn("SW registration failed",e))})}const de=["config","trip","itinerary","routes","places","water","accommodation","food","fuel","transport","alerts","attractions","sources","changelog"],pe=["before-we-leave","water","food","fuel","sleep","transport","route-decisions","safety","ancient-lycia","turkish-phrases","hiker-reports"];function ue(){const e=new Set;return document.querySelectorAll("script[src]").forEach(n=>e.add(n.src)),document.querySelectorAll('link[rel="stylesheet"]').forEach(n=>e.add(n.href)),document.querySelectorAll('link[rel="icon"], link[rel="manifest"]').forEach(n=>e.add(n.href)),[...e].filter(n=>n.startsWith(location.origin))}async function me(e){if(!("caches"in window))throw new Error("Cache API not supported in this browser.");const n="/lycian-way-2026/",a=[location.origin+n,`${n}index.html`,`${n}manifest.webmanifest`,...ue(),...de.map(r=>`${n}data/${r}.json`),...pe.map(r=>`${n}content/knowledge/${r}.md`)],t=await caches.open(I);let s=0;for(const r of a){try{await t.add(r)}catch(l){console.warn(`Could not cache ${r}`,l)}s+=1,e?.(s,a.length)}return{cached:s,total:a.length}}async function fe(){return!("caches"in window)||!await caches.has(I)?!1:(await(await caches.open(I)).keys()).length>0}const K=[];let U=null;const ge="#/map";function h(e,n){const a=[],t=e.replace(/:([\w]+)/g,(r,l)=>(a.push(l),"([^/]+)")),s=new RegExp(`^${t}$`);K.push({regex:s,paramNames:a,render:n})}function he(e){U=e}function $e(e){for(const n of K){const a=e.match(n.regex);if(a){const t={};return n.paramNames.forEach((s,r)=>t[s]=decodeURIComponent(a[r+1])),{render:n.render,params:t}}}return null}async function B(){const e=document.getElementById("screen"),n=location.hash||ge,a=$e(n);if(U?.(n),!a){e.innerHTML='<div class="screen-pad"><p>Not found.</p></div>';return}try{await a.render(e,a.params)}catch(t){console.error(t),e.innerHTML='<div class="screen-pad"><p>Something went wrong loading this screen.</p></div>'}}function ye(){window.addEventListener("hashchange",B),B()}const P=new Map;function V(){return"/lycian-way-2026/"}async function $(e){if(P.has(e))return P.get(e);const n=await fetch(`${V()}data/${e}.json`);if(!n.ok)throw new Error(`Failed to load data/${e}.json: ${n.status}`);const a=await n.json();return P.set(e,a),a}const v=()=>$("config").then(e=>e),C=()=>$("itinerary").then(e=>e.days),z=()=>$("routes").then(e=>e.routes),X=()=>$("places").then(e=>e.places),H=()=>$("water"),Y=()=>$("accommodation").then(e=>e.accommodations),J=()=>$("food").then(e=>e.foodPlaces),ve=()=>$("fuel"),Q=()=>$("transport").then(e=>e.transportLegs),Z=()=>$("alerts").then(e=>e.alerts),ee=()=>$("attractions").then(e=>e.attractions),we=()=>$("sources").then(e=>e.sources);we().then(e=>{const n=new Map;for(const a of e)n.set(a.id,a);return n});async function be(e){return(await C()).find(a=>a.id===e)}async function te(e){return e?(await z()).find(a=>a.id===e):null}async function F(e){return e?(await X()).find(a=>a.id===e):null}async function ke(){return["before-we-leave","water","food","fuel","sleep","transport","route-decisions","safety","ancient-lycia","turkish-phrases","hiker-reports"]}async function ne(e){const n=`knowledge:${e}`;if(P.has(n))return P.get(n);const a=await fetch(`${V()}content/knowledge/${e}.md`);if(!a.ok)throw new Error(`Failed to load knowledge/${e}.md: ${a.status}`);const t=await a.text(),s=Le(t);return P.set(n,s),s}function Le(e){const n=e.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);if(!n)return{meta:{},body:e};const[,a,t]=n,s={};for(const r of a.split(`
`)){const l=r.match(/^(\w+):\s*(.*)$/);if(!l)continue;const[,p,c]=l;c.startsWith("[")&&c.endsWith("]")?s[p]=c.slice(1,-1).split(",").map(d=>d.trim()).filter(Boolean):s[p]=c.trim()}return{meta:s,body:t.trim()}}const q={neutral:"#5b6b73",orange:"#d97706",red:"#c62828"};function A(e,n){return e?.status?.[n]?.color??q[n]??q.neutral}function Pe(e,n){return e?.status?.[n]?.label??n}const xe={confirmed_available:"neutral",seasonal:"orange",uncertain:"orange",reported_dry:"red",confirmed_unavailable:"red"};function Te(e){return xe[e]??"orange"}function g(e,n,{small:a=!1}={}){const t=A(e,n),s=Pe(e,n);return`<span class="${a?"status-badge status-badge--small":"status-badge"}" style="--status-color:${t}" title="${o(s)}">
    <span class="status-badge__dot"></span>${n==="orange"||n==="red"?'<span class="status-badge__warn">&#9650;</span>':""}
  </span>`}function w(){return'<a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge Base</a>'}function o(e){return String(e??"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}let G=null;const _=new Set;let M=null,x=null;function O(e){return _.add(e),(M||x)&&e({position:M,error:x}),()=>_.delete(e)}function E(){for(const e of _)e({position:M,error:x})}function R(){if(G===null){if(!("geolocation"in navigator)){x={code:"unsupported",message:"Geolocation not supported in this browser."},E();return}G=navigator.geolocation.watchPosition(e=>{M={lat:e.coords.latitude,lon:e.coords.longitude,accuracy:e.coords.accuracy,timestamp:e.timestamp},x=null,E()},e=>{x={code:e.code,message:e.message},E()},{enableHighAccuracy:!0,maximumAge:5e3,timeout:15e3})}}function Se(){return M}function Me(e,n){const a=new Date().toISOString().slice(0,10),t=n.trip.startDate,s=n.trip.endDate;return a<t?e[0]:a>s?e[e.length-1]:e.find(r=>r.date===a)??e[0]}async function je(e){const[n,a,t]=await Promise.all([v(),C(),Z()]),s=Me(a,n),r=await te(s.routeId),l=await fe();e.innerHTML=`
    <div class="screen-pad">
      ${w()}
      <div class="card">
        <div class="pill-row"><span class="pill">${o(s.date)}</span>${g(n,s.status)}</div>
        <h3>${o(s.title)}</h3>
        <p>${o(s.summary)}</p>
        ${r?`<p>${r.metrics[0]?.distanceKm??"?"} km &middot; +${r.metrics[0]?.ascentM??"?"} m ascent (source: ${o(r.metrics[0]?.source??"unknown")})</p>`:""}
        ${s.tasks?.length?`<div class="section-title">Tasks</div><ul class="warn-list" style="color:var(--text-dim)">${s.tasks.map(c=>`<li style="color:var(--text-dim)">${o(c)}</li>`).join("")}</ul>`:""}
        ${s.watchOut?.length?`<div class="section-title">Watch out</div><ul class="warn-list">${s.watchOut.map(c=>`<li>${o(c)}</li>`).join("")}</ul>`:""}
        <div class="link-row">
          <a class="btn btn-secondary" href="#/itinerary/${s.id}">Full day view</a>
        </div>
      </div>

      ${t.length?`
        <div class="section-title">Active warnings</div>
        ${t.map(c=>`
          <div class="card">
            ${g(n,c.status)} <strong>${o(c.title)}</strong>
            <p>${o(c.description)}</p>
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
  `;const p=e.querySelector("#today-gps");O(({position:c,error:d})=>{c?p.innerHTML=`
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="gps-marker"></div>
          <div>
            <p style="margin:0">${c.lat.toFixed(5)}, ${c.lon.toFixed(5)}</p>
            <p style="margin:0">±${Math.round(c.accuracy)} m &middot; updated ${new Date(c.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      `:d&&(p.innerHTML=`<p>Location unavailable (${o(d.message)}). The app works fine without it.</p>`)}),R(),e.querySelector("#save-offline-btn").addEventListener("click",async c=>{const d=c.currentTarget;d.disabled=!0,d.textContent="Saving…";try{await me((u,m)=>d.textContent=`Saving ${u}/${m}…`),e.querySelector("#offline-status").textContent="Trip data saved for offline use.",d.textContent="Saved"}catch(u){d.textContent="Save failed — retry",d.disabled=!1,console.error(u)}})}const Ee="modulepreload",Ie=function(e){return"/lycian-way-2026/"+e},N={},Ae=function(n,a,t){let s=Promise.resolve();if(a&&a.length>0){let l=function(d){return Promise.all(d.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const p=document.querySelector("meta[property=csp-nonce]"),c=p?.nonce||p?.getAttribute("nonce");s=l(a.map(d=>{if(d=Ie(d),d in N)return;N[d]=!0;const u=d.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${m}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":Ee,u||(f.as="script"),f.crossOrigin="",f.href=d,c&&f.setAttribute("nonce",c),document.head.appendChild(f),u)return new Promise((b,k)=>{f.addEventListener("load",b),f.addEventListener("error",()=>k(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(l){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=l,window.dispatchEvent(p),!p.defaultPrevented)throw l}return s.then(l=>{for(const p of l||[])p.status==="rejected"&&r(p.reason);return n().catch(r)})};function T(e,[n,a],t,s,r){const l=r+(n-e.west)/(e.east-e.west)*(t-2*r),p=r+(1-(a-e.south)/(e.north-e.south))*(s-2*r);return[l,p]}function _e(e,{config:n,places:a,routes:t,water:s,gpsPosition:r}){const l=n.map.boundingBox,p=400,c=640,d=30,u=new Map(a.map(i=>[i.id,i])),m=t.map(i=>{const y=u.get(i.fromPlaceId),L=u.get(i.toPlaceId);if(!y||!L)return"";const[j,ae]=T(l,y.coordinates,p,c,d),[oe,re]=T(l,L.coordinates,p,c,d),ie=i.geometry?.coordinates?.length>0,ce=A(n,i.status);return`<line x1="${j}" y1="${ae}" x2="${oe}" y2="${re}" stroke="${ce}" stroke-width="3" ${ie?"":'stroke-dasharray="6 5"'} opacity="0.85"/>`}).join(""),f=a.map(i=>{const[y,L]=T(l,i.coordinates,p,c,d),j=A(n,i.status);return`
      <circle cx="${y}" cy="${L}" r="5" fill="${j}" stroke="#0e1613" stroke-width="1.5"/>
      <text x="${y+8}" y="${L+4}" font-size="10" fill="#eef2ee">${o(i.name)}</text>
    `}).join(""),b=(s?.waterPoints??[]).map(i=>{const[y,L]=T(l,i.coordinates,p,c,d);return`<circle cx="${y}" cy="${L}" r="4" fill="#4fc3f7" stroke="#0e1613" stroke-width="1.2"/>`}).join(""),k=r?(()=>{const[i,y]=T(l,[r.lon,r.lat],p,c,d);return`<circle cx="${i}" cy="${y}" r="7" fill="#4fc3f7" opacity="0.9"><animate attributeName="r" values="7;13;7" dur="1.6s" repeatCount="indefinite"/></circle>`})():"";e.innerHTML=`
    <svg viewBox="0 0 ${p} ${c}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;background:#182420;">
      ${m}
      ${b}
      ${f}
      ${k}
    </svg>
  `}function D(e,n,a,t){return`  <wpt lat="${n}" lon="${e}"><name>${W(a)}</name>${t?`<desc>${W(t)}</desc>`:""}</wpt>`}function W(e){return String(e??"").replace(/[<>&'"]/g,n=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"})[n])}function We({places:e,routes:n,water:a,attractions:t,alerts:s}){const r=[];for(const c of e)r.push(D(c.coordinates[0],c.coordinates[1],c.name,"place"));for(const c of a?.waterPoints??[])r.push(D(c.coordinates[0],c.coordinates[1],`Water: ${c.name}`,`${c.waterType} / ${c.status}`));const l=new Map(e.map(c=>[c.id,c])),p=n.map(c=>{const u=(c.geometry?.coordinates?.length?c.geometry.coordinates:[l.get(c.fromPlaceId)?.coordinates,l.get(c.toPlaceId)?.coordinates].filter(Boolean)).map(([m,f])=>`      <trkpt lat="${f}" lon="${m}"></trkpt>`).join(`
`);return`  <trk><name>${W(c.name)}</name><trkseg>
${u}
    </trkseg></trk>`});return`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Lycian Way 2026 Trip OS" xmlns="http://www.topografix.com/GPX/1/1">
${r.join(`
`)}
${p.join(`
`)}
</gpx>`}function Ce(e,n="lycian-way-2026.gpx"){const a=new Blob([e],{type:"application/gpx+xml"}),t=URL.createObjectURL(a),s=document.createElement("a");s.href=t,s.download=n,s.click(),URL.revokeObjectURL(t)}async function He(e){const[n,a,t,s,r,l]=await Promise.all([v(),X(),z(),H(),ee(),Z()]),p=navigator.onLine&&!!n.map.tileProvider.styleUrl;e.innerHTML=`
    <div class="map-screen">
      <div id="map-canvas-wrap"></div>
      <button class="map-fab" id="gpx-btn" title="Download GPX" aria-label="Download GPX">GPX</button>
      <div id="map-fallback-note" class="map-fallback-note" hidden>Offline corridor view — no live map tiles right now.</div>
    </div>
  `;const c=e.querySelector("#map-canvas-wrap"),d=e.querySelector("#map-fallback-note");async function u(){d.hidden=!1,_e(c,{config:n,places:a,routes:t,water:s,gpsPosition:Se()})}if(p)try{const{mountMapLibre:m}=await Ae(async()=>{const{mountMapLibre:f}=await import("./map-SNV8GSE7.js");return{mountMapLibre:f}},[]);c.innerHTML='<div id="maplibre-container" style="width:100%;height:100%;"></div>',await m(c.querySelector("#maplibre-container"),{config:n,places:a,water:s})}catch(m){console.warn("MapLibre failed to load, falling back to offline corridor view",m),await u()}else await u();O(()=>{p||u()}),R(),e.querySelector("#gpx-btn").addEventListener("click",()=>{const m=We({places:a,routes:t,water:s,attractions:r,alerts:l});Ce(m)})}async function Oe(e){const[n,a]=await Promise.all([v(),C()]);e.innerHTML=`
    <div class="screen-pad">
      ${w()}
      <div class="section-title">Itinerary</div>
      ${a.map(t=>`
        <a href="#/itinerary/${t.id}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <div class="pill-row"><span class="pill">${o(t.date)}</span>${g(n,t.status)}</div>
          <h3>${o(t.title)}</h3>
          <p>${o(t.summary)}</p>
        </a>
      `).join("")}
    </div>
  `}async function Re(e,{dayId:n}){const[a,t]=await Promise.all([v(),be(n)]);if(!t){e.innerHTML='<div class="screen-pad"><p>Day not found.</p></div>';return}const[s,r,l,p,c]=await Promise.all([te(t.routeId),Promise.resolve(t.accommodationIds??[]),J(),H(),Q()]),d=(await Y()).filter(i=>t.accommodationIds?.includes(i.id)),u=l.filter(i=>t.foodIds?.includes(i.id)),m=p.waterPoints.filter(i=>t.waterIds?.includes(i.id)),f=c.filter(i=>t.transportIds?.includes(i.id));let b=null,k=null;s&&([b,k]=await Promise.all([F(s.fromPlaceId),F(s.toPlaceId)])),e.innerHTML=`
    <div class="screen-pad">
      <a href="#/itinerary" class="btn-secondary btn" style="margin-bottom:12px;display:inline-block;">&larr; All days</a>
      <div class="pill-row"><span class="pill">${o(t.date)}</span>${g(a,t.status)}</div>
      <h2 style="margin:6px 0;">${o(t.title)}</h2>
      <p>${o(t.summary)}</p>

      ${s?`
        <div class="card">
          <h3>Route</h3>
          <p>${b?o(b.name):"?"} &rarr; ${k?o(k.name):"?"}</p>
          ${s.metrics.map(i=>`<p>${i.distanceKm} km &middot; +${i.ascentM} m &middot; source: ${o(i.source)} (${o(i.date)})</p>`).join("")}
          ${s.variants?.length?s.variants.map(i=>`
            <p>${g(a,i.status)} <strong>${o(i.name)}</strong> — ${o(i.notes)}</p>
          `).join(""):""}
          ${s.notes?`<p><em>${o(s.notes)}</em></p>`:""}
        </div>
      `:""}

      ${t.tasks?.length?`<div class="section-title">Tasks</div><div class="card"><ul>${t.tasks.map(i=>`<li>${o(i)}</li>`).join("")}</ul></div>`:""}
      ${t.preTripTasks?.length?`<div class="section-title">Pre-trip tasks</div><div class="card"><ul>${t.preTripTasks.map(i=>`<li>${o(i)}</li>`).join("")}</ul></div>`:""}

      ${m.length?`<div class="section-title">Water</div>${m.map(i=>`
        <div class="card"><h3>${o(i.name)}</h3><p>${o(i.waterType)} &middot; ${o(i.status)} &middot; ${o(i.treatment)}</p><p>${o(i.notes)}</p></div>
      `).join("")}`:""}

      ${u.length?`<div class="section-title">Food</div>${u.map(i=>`
        <div class="card">${g(a,i.status)} <strong>${o(i.name)}</strong> <p>${o(i.notes)}</p></div>
      `).join("")}`:""}

      ${d.length?`<div class="section-title">Sleep</div>${d.map(i=>`
        <div class="card">${g(a,i.status)} <strong>${o(i.name)}</strong><p>${o(i.priceInfo)}</p><p>${o(i.notes)}</p></div>
      `).join("")}`:""}

      ${f.length?`<div class="section-title">Transport</div>${f.map(i=>`
        <div class="card">${g(a,i.status)} <strong>${o(i.name)}</strong><p>${o(i.notes)}</p></div>
      `).join("")}`:""}

      ${t.highlights?.length?`<div class="section-title">Highlights</div><div class="card"><ul>${t.highlights.map(i=>`<li>${o(i)}</li>`).join("")}</ul></div>`:""}
      ${t.watchOut?.length?`<div class="section-title">Watch out</div><ul class="warn-list">${t.watchOut.map(i=>`<li>${o(i)}</li>`).join("")}</ul>`:""}
      ${t.backupPlan?`<div class="section-title">Backup plan</div><div class="card">${o(t.backupPlan)}</div>`:""}
      ${t.notes?`<p style="color:var(--text-dim);font-size:0.8rem;">${o(t.notes)}</p>`:""}
    </div>
  `}async function Be(e){const[n,a]=await Promise.all([v(),H()]),t=n.water.defaultCapacityLitersPerPerson;e.innerHTML=`
    <div class="screen-pad">
      ${w()}
      <div class="section-title">Water points</div>
      ${a.waterPoints.length?a.waterPoints.map(s=>`
        <div class="card">
          ${g(n,Te(s.status))}
          <strong>${o(s.name)}</strong>
          <p>${o(s.waterType)} &middot; status: ${o(s.status)} &middot; treatment: ${o(s.treatment)}</p>
          <p>Confidence: ${o(s.confidence)} &middot; last verified ${o(s.lastVerified)}</p>
          <p>${o(s.notes)}</p>
        </div>
      `).join(""):'<p class="empty-state">No water points recorded yet.</p>'}

      <div class="section-title">Per-day water planning (capacity: ${t} L/person)</div>
      ${a.dayWaterPlans.length?a.dayWaterPlans.map(s=>`
        <div class="card">
          <strong>${o(s.dayId)}</strong>
          <p>Longest known gap: ${s.longestKnownGapKm!=null?s.longestKnownGapKm+" km":"unknown"}</p>
          <p>Risk: ${o(s.risk)}</p>
          <p>${o(s.notes)}</p>
        </div>
      `).join(""):'<p class="empty-state">No per-day water plans recorded yet.</p>'}
    </div>
  `}async function Fe(e){const[n,a,t]=await Promise.all([v(),J(),ve()]);e.innerHTML=`
    <div class="screen-pad">
      ${w()}
      <div class="section-title">Food &amp; shops</div>
      ${a.length?a.map(s=>`
        <div class="card">
          ${g(n,s.status)} <strong>${o(s.name)}</strong>
          <p>${o(s.category)} &middot; confidence: ${o(s.confidence)}</p>
          <p>${o(s.notes)}</p>
        </div>
      `).join(""):'<p class="empty-state">No food/shop records yet.</p>'}

      <div class="section-title">Fuel — ${o(t.fuelType)}</div>
      ${t.sellers.length?t.sellers.map(s=>`
        <div class="card">${g(n,s.status)} <strong>${o(s.name)}</strong></div>
      `).join(""):'<p class="empty-state">No fuel sellers researched yet — pre-trip task. Seller existence and correct canister stock will be tracked separately once found.</p>'}
    </div>
  `}async function qe(e){const[n,a]=await Promise.all([v(),Y()]);e.innerHTML=`
    <div class="screen-pad">
      ${w()}
      <div class="section-title">Sleep</div>
      ${a.length?a.map(t=>`
        <div class="card">
          ${g(n,t.status)} <strong>${o(t.name)}</strong>
          <p>${o(t.type)} &middot; ${o(t.priceInfo)}</p>
          <p>Confidence: ${o(t.confidence)} &middot; last verified ${o(t.lastVerified)}</p>
          <p>${o(t.notes)}</p>
        </div>
      `).join(""):'<p class="empty-state">Nothing recorded yet.</p>'}
    </div>
  `}async function Ge(e){const[n,a]=await Promise.all([v(),Q()]);e.innerHTML=`
    <div class="screen-pad">
      ${w()}
      <div class="section-title">Transport</div>
      ${a.map(t=>`
        <div class="card">
          ${g(n,t.status)} <strong>${o(t.name)}</strong>
          ${t.date?`<p>${o(t.date)}</p>`:""}
          <p>Confidence: ${o(t.confidence)}${t.lastVerified?` &middot; last verified ${o(t.lastVerified)}`:""}</p>
          <p>${o(t.notes)}</p>
        </div>
      `).join("")}
    </div>
  `}async function Ne(e){const[n,a]=await Promise.all([v(),ee()]);e.innerHTML=`
    <div class="screen-pad">
      ${w()}
      <div class="section-title">Places to see</div>
      ${a.map(t=>`
        <div class="card">
          ${g(n,t.status)} <strong>${o(t.name)}</strong>
          <p>${o(t.shortDescription)}</p>
          <p style="font-size:0.75rem;">${o(t.routeDistanceNote)}</p>
          <div class="link-row">
            <a class="btn btn-secondary" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.name)}">Open in Google Maps</a>
          </div>
        </div>
      `).join("")}
    </div>
  `}const De=[["#/today","Today","What's happening right now, tasks, warnings"],["#/itinerary","Itinerary","Day-by-day plan, 8–18 Oct"],["#/water","Water","Water points and per-day refill planning"],["#/resupply","Resupply","Food, shops, fuel"],["#/sleep","Sleep","Camps and accommodation"],["#/transport","Transport","Flights, dolmuş, ground transport"],["#/places","Places to see","Attractions on or near the route"],["#/emergency","Emergency","112, GPS, bailout info"]];async function Ke(e){const n=await ke(),a=await Promise.all(n.map(t=>ne(t).then(s=>[t,s])));e.innerHTML=`
    <div class="screen-pad">
      <div class="section-title">Trip</div>
      ${De.map(([t,s,r])=>`
        <a href="${t}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${o(s)}</h3>
          <p>${o(r)}</p>
        </a>
      `).join("")}

      <div class="section-title">Field guide</div>
      ${a.map(([t,s])=>`
        <a href="#/knowledge/${t}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${o(s.meta.title??t)}</h3>
          <p>Confidence: ${o(s.meta.confidence??"?")} &middot; last verified ${o(s.meta.lastVerified??"?")}</p>
        </a>
      `).join("")}
    </div>
  `}function Ue(e){const n=e.split(`
`);let a="",t=0;for(;t<n.length;){const s=n[t];if(/^\s*$/.test(s)){t++;continue}if(s.startsWith("# ")){a+=`<h2>${S(s.slice(2))}</h2>`,t++;continue}if(s.startsWith("## ")){a+=`<h3>${S(s.slice(3))}</h3>`,t++;continue}if(s.startsWith("**")&&s.match(/^\*\*.+\*\*/),s.startsWith("|")){const l=[];for(;t<n.length&&n[t].startsWith("|");)l.push(n[t]),t++;a+=Ve(l);continue}if(s.startsWith("- ")){const l=[];for(;t<n.length&&n[t].startsWith("- ");)l.push(n[t].slice(2)),t++;a+=`<ul>${l.map(p=>`<li>${S(p)}</li>`).join("")}</ul>`;continue}const r=[];for(;t<n.length&&!/^\s*$/.test(n[t])&&!n[t].startsWith("|")&&!n[t].startsWith("- ")&&!n[t].startsWith("#");)r.push(n[t]),t++;a+=`<p>${S(r.join(" "))}</p>`}return a}function Ve(e){e.filter(r=>!/^\|[\s-]+\|$/.test((r.replace(/[^|\s-]/g,""),r)));const a=e.filter(r=>!/^\|(\s*-+\s*\|)+$/.test(r)).map(r=>r.split("|").slice(1,-1).map(l=>l.trim()));if(!a.length)return"";const[t,...s]=a;return`<table class="phrases">
    <tbody>
      ${s.map(r=>`<tr>${r.map(l=>`<td>${S(l)}</td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>`}function S(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\[(.+?)\]\((.+?)\)/g,(n,a,t)=>{const s=t.endsWith(".md");return`<a href="${s?`#/knowledge/${t.replace(/\.md$/,"")}`:t}"${s?"":' target="_blank" rel="noopener"'}>${a}</a>`})}async function ze(e,{slug:n}){const a=await ne(n);e.innerHTML=`
    <div class="screen-pad">
      <a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge base</a>
      <h2>${o(a.meta.title??n)}</h2>
      <p style="color:var(--text-dim);font-size:0.8rem;">Confidence: ${o(a.meta.confidence??"?")} &middot; last verified ${o(a.meta.lastVerified??"?")}</p>
      <div class="card">${Ue(a.body)}</div>
    </div>
  `}async function Xe(e){e.innerHTML=`
    <div class="screen-pad">
      ${w()}
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
  `;const n=e.querySelector("#emergency-gps");O(({position:a,error:t})=>{a?n.innerHTML=`
        <p>${a.lat.toFixed(5)}, ${a.lon.toFixed(5)}</p>
        <p>Accuracy: ±${Math.round(a.accuracy)} m</p>
        <div class="link-row">
          <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lon}">Open in Google Maps</a>
        </div>
      `:t&&(n.innerHTML=`<p>${o(t.message)}</p>`)}),R()}document.getElementById("app").innerHTML=`
  <header class="app-header">
    <div class="app-header__brand">Lycian Way 2026</div>
    <div class="segmented" role="tablist">
      <button class="segmented__btn" data-view="map" role="tab">Map</button>
      <button class="segmented__btn" data-view="kb" role="tab">Knowledge Base</button>
    </div>
  </header>
  <div id="screen"></div>
`;h("#/map",He);h("#/today",je);h("#/itinerary",Oe);h("#/itinerary/:dayId",Re);h("#/water",Be);h("#/resupply",Fe);h("#/sleep",qe);h("#/transport",Ge);h("#/places",Ne);h("#/knowledge",Ke);h("#/knowledge/:slug",ze);h("#/emergency",Xe);const se=document.querySelectorAll(".segmented__btn");se.forEach(e=>{e.addEventListener("click",()=>{location.hash=e.dataset.view==="map"?"#/map":"#/knowledge"})});he(e=>{const n=e==="#/map"||e==="";document.getElementById("screen").classList.toggle("screen--full-bleed",n),se.forEach(a=>a.classList.toggle("segmented__btn--active",a.dataset.view==="map"===n))});le();ye();export{Ae as _,A as s};
//# sourceMappingURL=index-OCY8X4Up.js.map
