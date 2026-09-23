(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();const X="lycian-2026-v1";function De(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/lycian-way-2026/sw.js").catch(e=>console.warn("SW registration failed",e))})}const He=["config","trip","itinerary","routes","places","water","accommodation","food","fuel","transport","alerts","attractions","sources","changelog"],Ge=["before-we-leave","water","food","fuel","sleep","transport","route-decisions","safety","ancient-lycia","turkish-phrases","hiker-reports"];function Ne(){const e=new Set;return document.querySelectorAll("script[src]").forEach(t=>e.add(t.src)),document.querySelectorAll('link[rel="stylesheet"]').forEach(t=>e.add(t.href)),document.querySelectorAll('link[rel="icon"], link[rel="manifest"]').forEach(t=>e.add(t.href)),[...e].filter(t=>t.startsWith(location.origin))}async function Ue(e){if(!("caches"in window))throw new Error("Cache API not supported in this browser.");const t="/lycian-way-2026/",n=[location.origin+t,`${t}index.html`,`${t}manifest.webmanifest`,...Ne(),...He.map(a=>`${t}data/${a}.json`),...Ge.map(a=>`${t}content/knowledge/${a}.md`)],o=await caches.open(X);let s=0;for(const a of n){try{await o.add(a)}catch(r){console.warn(`Could not cache ${a}`,r)}s+=1,e?.(s,n.length)}return{cached:s,total:n.length}}async function Ke(){return!("caches"in window)||!await caches.has(X)?!1:(await(await caches.open(X)).keys()).length>0}const me=[];let he=null;const ze="#/map";function I(e,t){const n=[],o=e.replace(/:([\w]+)/g,(a,r)=>(n.push(r),"([^/]+)")),s=new RegExp(`^${o}$`);me.push({regex:s,paramNames:n,render:t})}function Ve(e){he=e}function Xe(e){for(const t of me){const n=e.match(t.regex);if(n){const o={};return t.paramNames.forEach((s,a)=>o[s]=decodeURIComponent(n[a+1])),{render:t.render,params:o}}}return null}async function ie(){const e=document.getElementById("screen"),t=location.hash||ze,n=Xe(t);if(he?.(t),!n){e.innerHTML='<div class="screen-pad"><p>Not found.</p></div>';return}try{await n.render(e,n.params)}catch(o){console.error(o),e.innerHTML='<div class="screen-pad"><p>Something went wrong loading this screen.</p></div>'}}function Je(){window.addEventListener("hashchange",ie),ie()}const Ye="modulepreload",Qe=function(e){return"/lycian-way-2026/"+e},ce={},Ze=function(t,n,o){let s=Promise.resolve();if(n&&n.length>0){let r=function(u){return Promise.all(u.map(v=>Promise.resolve(v).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),c=d?.nonce||d?.getAttribute("nonce");s=r(n.map(u=>{if(u=Qe(u),u in ce)return;ce[u]=!0;const v=u.endsWith(".css"),g=v?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${g}`))return;const h=document.createElement("link");if(h.rel=v?"stylesheet":Ye,v||(h.as="script"),h.crossOrigin="",h.href=u,c&&h.setAttribute("nonce",c),document.head.appendChild(h),v)return new Promise((f,b)=>{h.addEventListener("load",f),h.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${u}`)))})}))}function a(r){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=r,window.dispatchEvent(d),!d.defaultPrevented)throw r}return s.then(r=>{for(const d of r||[])d.status==="rejected"&&a(d.reason);return t().catch(a)})},M=new Map;function ge(){return"/lycian-way-2026/"}async function k(e){if(M.has(e))return M.get(e);const t=await fetch(`${ge()}data/${e}.json`);if(!t.ok)throw new Error(`Failed to load data/${e}.json: ${t.status}`);const n=await t.json();return M.set(e,n),n}const te=()=>k("config").then(e=>e),ne=()=>k("itinerary").then(e=>e.days),ye=()=>k("routes").then(e=>e.routes),ve=()=>k("places").then(e=>e.places),$e=()=>k("water"),we=()=>k("accommodation").then(e=>e.accommodations),be=()=>k("food").then(e=>e.foodPlaces),et=()=>k("fuel"),ke=()=>k("transport").then(e=>e.transportLegs),tt=()=>k("alerts").then(e=>e.alerts),nt=()=>k("attractions").then(e=>e.attractions),ot=()=>k("sources").then(e=>e.sources),st=ot().then(e=>{const t=new Map;for(const n of e)t.set(n.id,n);return t}),at=async e=>(await st).get(e);async function rt(e){return(await ne()).find(n=>n.id===e)}async function it(e){return e?(await ye()).find(n=>n.id===e):null}async function le(e){return e?(await ve()).find(n=>n.id===e):null}async function _e(e){const t=`knowledge:${e}`;if(M.has(t))return M.get(t);const n=await fetch(`${ge()}content/knowledge/${e}.md`);if(!n.ok)throw new Error(`Failed to load knowledge/${e}.md: ${n.status}`);const o=await n.text(),s=ct(o);return M.set(t,s),s}function ct(e){const t=e.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);if(!t)return{meta:{},body:e};const[,n,o]=t,s={};for(const a of n.split(`
`)){const r=a.match(/^(\w+):\s*(.*)$/);if(!r)continue;const[,d,c]=r;c.startsWith("[")&&c.endsWith("]")?s[d]=c.slice(1,-1).split(",").map(u=>u.trim()).filter(Boolean):s[d]=c.trim()}return{meta:s,body:o.trim()}}const de={neutral:"#AAAAAA",orange:"#FF8800",yellow:"#FFEE00",red:"#FF0000"};function Se(e,t){return e?.status?.[t]?.color??de[t]??de.neutral}function lt(e,t){return e?.status?.[t]?.label??t}function P(e,t,{small:n=!1}={}){const o=Se(e,t),s=lt(e,t),a=n?"status-badge status-badge--small":"status-badge",r=t==="orange"||t==="yellow"||t==="red";return`<span class="${a}" style="--status-color:${o}" title="${i(s)}">
    <span class="status-badge__dot"></span>${r?'<span class="status-badge__warn">&#9650;</span>':""}
  </span>`}function Pe(){return'<a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge Base</a>'}function i(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Le([e,t],[n,o]){const a=t*Math.PI/180,r=o*Math.PI/180,d=(o-t)*Math.PI/180,c=(n-e)*Math.PI/180,u=Math.sin(d/2)**2+Math.cos(a)*Math.cos(r)*Math.sin(c/2)**2;return 2*6371e3*Math.asin(Math.sqrt(u))}function W(e){const t=[0];for(let n=1;n<e.length;n++)t.push(t[n-1]+Le(e[n-1],e[n]));return t}function Wt(e){const t=W(e);return t[t.length-1]??0}function dt(e,t){if(t.length<2)return null;const n=W(t);let o=null;for(let s=0;s<t.length-1;s++){const a=t[s],r=t[s+1],{t:d,pt:c,dist:u}=ut(e,a,r),v=n[s]+d*(n[s+1]-n[s]);(!o||u<o.distanceFrom)&&(o={distanceAlong:v,distanceFrom:u,pointOnLine:c,segmentIndex:s})}return o}function ut(e,t,n){const o=(t[1]+n[1])/2*(Math.PI/180),s=([y,$])=>[y*Math.cos(o)*111320,$*111320],[a,r]=s(e),[d,c]=s(t),[u,v]=s(n),g=u-d,h=v-c;let f=g===0&&h===0?0:((a-d)*g+(r-c)*h)/(g*g+h*h);f=Math.max(0,Math.min(1,f));const b=d+f*g,l=c+f*h,T=Math.hypot(a-b,r-l),j=[t[0]+f*(n[0]-t[0]),t[1]+f*(n[1]-t[1])];return{t:f,pt:j,dist:T}}function pt(e,t){const n=W(e),o=n[n.length-1],s=Math.max(0,Math.min(o,t));for(let a=0;a<n.length-1;a++)if(s>=n[a]&&s<=n[a+1]){const r=n[a+1]-n[a],d=r===0?0:(s-n[a])/r,c=e[a],u=e[a+1];return[c[0]+d*(u[0]-c[0]),c[1]+d*(u[1]-c[1])]}return e[e.length-1]}function ft(e,t){const n=W(e),o=n[n.length-1];if(t<=0)return{before:[],after:e};if(t>=o)return{before:e,after:[]};const s=pt(e,t);let a=0;for(let c=0;c<n.length-1;c++)if(t>=n[c]&&t<=n[c+1]){a=c;break}const r=[...e.slice(0,a+1),s],d=[s,...e.slice(a+1)];return{before:r,after:d}}const mt=["route-ovacik-faralya-kabak","route-kabak-alinca","route-alinca-yediburunlar","route-yediburunlar-bel-patara"];function xe(e,t,n=150){return!e||!t?!1:Le(e,t)<n}function Me(e,t){const n=e.geometry?.coordinates??[],o=t.get(e.toPlaceId),s=t.get(e.fromPlaceId);if(n.length===0){const r=[s?.coordinates,o?.coordinates].filter(Boolean);return{solid:[],dashed:r}}const a=n[n.length-1];return o&&!xe(a,o.coordinates)?{solid:n,dashed:[a,o.coordinates]}:{solid:n,dashed:[]}}function ht(e,t){const n=new Map(e.map(s=>[s.id,s]));let o=[];for(const s of mt){const a=n.get(s);if(!a)continue;const{solid:r}=Me(a,t);r.length!==0&&(o.length&&xe(o[o.length-1],r[0],5)?o=o.concat(r.slice(1)):o=o.concat(r))}return o}const Ee="lycian-2026-trail-progress-m",gt=300;function R(){try{const e=localStorage.getItem(Ee);return e?Number(e):0}catch{return 0}}function yt(e){try{localStorage.setItem(Ee,String(e))}catch{}}function Dt(e,t){if(!e||t.length<2)return R();const n=dt(e,t);if(!n||n.distanceFrom>gt)return R();const o=R();return n.distanceAlong>o?(yt(n.distanceAlong),n.distanceAlong):o}function B(e,[t,n],o,s,a){const r=a+(t-e.west)/(e.east-e.west)*(o-2*a),d=a+(1-(n-e.south)/(e.north-e.south))*(s-2*a);return[r,d]}function z(e,t,n,o,s){return t.map(a=>B(e,a,n,o,s))}function V(e,t,{dashed:n=!1,width:o=3}={}){return e.length<2?"":`<path d="${e.map((a,r)=>`${r===0?"M":"L"}${a[0].toFixed(1)},${a[1].toFixed(1)}`).join(" ")}" fill="none" stroke="${t}" stroke-width="${o}" stroke-linecap="round" stroke-linejoin="round" ${n?'stroke-dasharray="6 5"':""} opacity="0.9"/>`}function vt(e,{config:t,places:n,routes:o,water:s,gpsPosition:a}){const r=t.map.boundingBox,d=400,c=640,u=30,v=new Map(n.map(y=>[y.id,y])),g=t.routeProgress?.untraveled??"#AAAAAA",h=t.routeProgress?.traveled??"#00FF80";let f="";for(const y of o){const{solid:$,dashed:_}=Me(y,v);_.length>=2&&(f+=V(z(r,_,d,c,u),g,{dashed:!0})),$.length>=2&&(f+=V(z(r,$,d,c,u),g))}const b=ht(o,v);if(b.length>=2){const y=R(),{before:$}=ft(b,y);$.length>=2&&(f+=V(z(r,$,d,c,u),h))}const l=n.map(y=>{const[$,_]=B(r,y.coordinates,d,c,u),G=Se(t,y.status);return`
      <circle cx="${$}" cy="${_}" r="5" fill="${G}" stroke="#0e1613" stroke-width="1.5"/>
      <text x="${$+8}" y="${_+4}" font-size="10" fill="#eef2ee">${i(y.name)}</text>
    `}).join(""),T=(s?.waterPoints??[]).map(y=>{const[$,_]=B(r,y.coordinates,d,c,u);return`<circle cx="${$}" cy="${_}" r="4" fill="#00A3FF" stroke="#0e1613" stroke-width="1.2"/>`}).join(""),j=a?(()=>{const[y,$]=B(r,[a.lon,a.lat],d,c,u);return`<circle cx="${y}" cy="${$}" r="7" fill="${t.gps?.markerColor??"#1A73E8"}" opacity="0.9"><animate attributeName="r" values="7;13;7" dur="1.6s" repeatCount="indefinite"/></circle>`})():"";e.innerHTML=`
    <svg viewBox="0 0 ${d} ${c}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;background:#182420;">
      ${f}
      ${T}
      ${l}
      ${j}
    </svg>
  `}let ue=null,J=null;const Y=new Set;let E=null,A=null,Q=null,Ae=7e3;function $t({updateIntervalSeconds:e}={}){e&&(Ae=e*1e3)}function Ie(e){return Y.add(e),(E||A)&&e({position:E,error:A}),()=>Y.delete(e)}function Z(){for(const e of Y)e({position:E,error:A})}function pe(){Q&&(E=Q,A=null,Z()),J=null}function Te(){if(ue===null){if(!("geolocation"in navigator)){A={code:"unsupported",message:"Geolocation not supported in this browser."},Z();return}ue=navigator.geolocation.watchPosition(e=>{Q={lat:e.coords.latitude,lon:e.coords.longitude,accuracy:e.coords.accuracy,heading:typeof e.coords.heading=="number"&&!Number.isNaN(e.coords.heading)?e.coords.heading:null,timestamp:e.timestamp},E||pe(),J===null&&(J=setTimeout(pe,Ae))},e=>{A={code:e.code,message:e.message},Z()},{enableHighAccuracy:!0,maximumAge:5e3,timeout:15e3})}}function wt(){return E}function fe(e,t,n,o){return`  <wpt lat="${t}" lon="${e}"><name>${ee(n)}</name>${o?`<desc>${ee(o)}</desc>`:""}</wpt>`}function ee(e){return String(e??"").replace(/[<>&'"]/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"})[t])}function bt({places:e,routes:t,water:n,attractions:o,alerts:s}){const a=[];for(const c of e)a.push(fe(c.coordinates[0],c.coordinates[1],c.name,"place"));for(const c of n?.waterPoints??[])a.push(fe(c.coordinates[0],c.coordinates[1],`Water: ${c.name}`,`${c.waterType} / ${c.status}`));const r=new Map(e.map(c=>[c.id,c])),d=t.map(c=>{const v=(c.geometry?.coordinates?.length?c.geometry.coordinates:[r.get(c.fromPlaceId)?.coordinates,r.get(c.toPlaceId)?.coordinates].filter(Boolean)).map(([g,h])=>`      <trkpt lat="${h}" lon="${g}"></trkpt>`).join(`
`);return`  <trk><name>${ee(c.name)}</name><trkseg>
${v}
    </trkseg></trk>`});return`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Lycian Way 2026 Trip OS" xmlns="http://www.topografix.com/GPX/1/1">
${a.join(`
`)}
${d.join(`
`)}
</gpx>`}function kt(e,t="lycian-way-2026.gpx"){const n=new Blob([e],{type:"application/gpx+xml"}),o=URL.createObjectURL(n),s=document.createElement("a");s.href=o,s.download=t,s.click(),URL.revokeObjectURL(o)}const je="lycian-2026-checklist-";function _t(e){try{const t=localStorage.getItem(je+e);return t?JSON.parse(t):null}catch{return null}}function D(e,t){try{localStorage.setItem(je+e,JSON.stringify(t))}catch{}}let Ce=1;function H(e){let t=_t(e.id);return t||(t=[...e.preTripTasks??[],...e.tasks??[]].map(o=>({id:`seed-${Ce++}`,text:o,done:!1})),D(e.id,t)),t}function St(e,t){const n=H(e);return n.push({id:`custom-${Date.now()}-${Ce++}`,text:t,done:!1}),D(e.id,n),n}function Pt(e,t){const n=H(e),o=n.find(s=>s.id===t);return o&&(o.done=!o.done),D(e.id,n),n}function Lt(e){const t=H(e).filter(n=>!n.done);return D(e.id,t),t}const xt={place:"Waypoint",water:"Water",food:"Food / resupply",sleep:"Sleep",transport:"Transport",attraction:"Place to see",hazard:"Watch out"};function Mt(e,t){const n=new Date().toISOString().slice(0,10),o=t.trip.startDate,s=t.trip.endDate;return n<o?e[0]:n>s?e[e.length-1]:e.find(a=>a.date===n)??e[0]}function Et(e){return e==="confirmed_available"?"neutral":e==="confirmed_unavailable"||e==="reported_dry"?"red":"orange"}async function At(e){const[t,n,o,s,a,r,d,c,u,v,g]=await Promise.all([te(),ve(),ye(),$e(),nt(),tt(),be(),et(),we(),ke(),ne()]);$t(t.gps);const h=navigator.onLine&&!!t.map.tileProvider.styleUrl,f=Mt(g,t),b=r.filter(p=>!p.affects?.routeIds?.length);e.innerHTML=`
    <div class="map-screen">
      <div id="map-canvas-wrap"></div>
      <div id="map-fallback-note" class="map-fallback-note" hidden>Offline corridor view — no live map tiles right now.</div>

      <div class="today-widget" id="today-widget">
        <button class="today-widget__header" id="today-widget-toggle">
          <span>${i(f.date)} &middot; Tasks</span>
          <span class="today-widget__chevron" id="today-widget-chevron">&#8964;</span>
        </button>
        <div class="today-widget__body" id="today-widget-body">
          ${b.length?`
            <div class="today-widget__alerts">
              ${b.map(p=>`<div>${P(t,p.status)} ${i(p.title)}</div>`).join("")}
            </div>
          `:""}
          <div class="today-widget__list" id="today-tasks-list"></div>
          <button class="today-widget__add" id="today-add-btn">+ Add item</button>
          <div class="today-widget__completed-header" id="today-completed-header" hidden>
            <span>Completed</span>
            <button id="today-clear-btn" title="Clear completed" aria-label="Clear completed">🗑</button>
          </div>
          <div class="today-widget__list today-widget__list--completed" id="today-completed-list"></div>
          <a href="#/itinerary/${f.id}" class="today-widget__full-day">Full day view &rarr;</a>
        </div>
      </div>

      <button class="map-fab map-fab--demo" id="demo-btn">▶ Play Demo</button>
      <button class="map-fab map-fab--stop-demo" id="demo-stop-btn" hidden>✕ End Demo</button>
      <button class="map-fab map-fab--gpx" id="gpx-btn" title="Download GPX" aria-label="Download GPX">GPX</button>

      <div id="poi-panel" class="poi-panel" hidden>
        <button class="poi-panel__close" id="poi-close-btn" aria-label="Close">&times;</button>
        <div id="poi-panel-body"></div>
      </div>
    </div>
  `;const l=e.querySelector("#today-tasks-list"),T=e.querySelector("#today-completed-list"),j=e.querySelector("#today-completed-header");function y(){const p=H(f),m=p.filter(w=>!w.done),q=p.filter(w=>w.done);l.innerHTML=m.map(w=>`
      <label class="today-widget__item">
        <input type="checkbox" data-id="${w.id}" />
        <span>${i(w.text)}</span>
      </label>
    `).join("")||'<p class="empty-state" style="padding:6px 0;">Nothing left — nice.</p>',j.hidden=q.length===0,T.innerHTML=q.map(w=>`
      <label class="today-widget__item today-widget__item--done">
        <input type="checkbox" data-id="${w.id}" checked />
        <span>${i(w.text)}</span>
      </label>
    `).join(""),e.querySelectorAll("#today-tasks-list input, #today-completed-list input").forEach(w=>{w.addEventListener("change",()=>{Pt(f,w.dataset.id),y()})})}y(),e.querySelector("#today-add-btn").addEventListener("click",()=>{const p=prompt("Add a task");p&&p.trim()&&(St(f,p.trim()),y())}),e.querySelector("#today-clear-btn").addEventListener("click",()=>{Lt(f),y()});const $=e.querySelector("#today-widget-toggle"),_=e.querySelector("#today-widget-body"),G=e.querySelector("#today-widget-chevron");$.addEventListener("click",()=>{const p=_.hidden=!_.hidden;G.style.transform=p?"rotate(-90deg)":"rotate(0deg)"});const N=e.querySelector("#map-canvas-wrap"),Oe=e.querySelector("#map-fallback-note"),C=e.querySelector("#demo-btn"),O=e.querySelector("#demo-stop-btn"),oe=e.querySelector("#poi-panel"),qe=e.querySelector("#poi-panel-body"),Re=e.querySelector("#poi-close-btn");async function Be({kind:p,data:m}){const q=m.name;let w=m.status;p==="water"&&(w=Et(m.status));const We=m.confidence,ae=m.lastVerified,K=m.coordinates??null,re=await Promise.all((m.sources??[]).map(S=>at(S)));let x="";if(p==="water")x=`<p class="poi-panel__category">${i(m.waterType)} &middot; treatment: ${i(m.treatment)}</p>`;else if(p==="food")x=`<p class="poi-panel__category">${m.isFuel?"fuel":i(m.category??"food")}</p>`;else if(p==="sleep")x=`<p class="poi-panel__category">${i(m.type??"camp")}</p><p>${i(m.priceInfo??"")}</p>`;else if(p==="transport")x=`<p class="poi-panel__category">${i(m.mode??"transport")}</p>${m.date?`<p>${i(m.date)}</p>`:""}`;else if(p==="attraction"){const S=m.category==="ruins"?'<a href="#/knowledge/ancient-lycia">More on Ancient Lycia &rarr;</a>':"";x=`<p class="poi-panel__category">${i(m.category)}</p><p>${i(m.shortDescription??"")}</p>${S?`<p>${S}</p>`:""}`}else p==="hazard"&&(x='<p><a href="#/knowledge/route-decisions">More on this open question &rarr;</a> &middot; <a href="#/knowledge/safety">Safety notes &rarr;</a></p>');qe.innerHTML=`
      <div class="pill-row">${P(t,w)}<span class="pill">${i(xt[p]??p)}</span></div>
      <h3>${i(q)}</h3>
      ${x}
      ${m.notes?`<p>${i(m.notes)}</p>`:""}
      <p style="font-size:0.75rem;color:var(--text-dim);">Confidence: ${i(We??"?")}${ae?` &middot; last verified ${i(ae)}`:""}</p>
      ${re.length?`<div class="section-title">Sources</div>${re.filter(Boolean).map(S=>S.url?`<p><a href="${S.url}" target="_blank" rel="noopener">${i(S.title)}</a></p>`:`<p>${i(S.title)}</p>`).join("")}`:""}
      ${K?`<div class="link-row"><a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${K[1]},${K[0]}">Open in Google Maps</a></div>`:""}
    `,oe.hidden=!1}function se(){oe.hidden=!0}Re.addEventListener("click",se);async function U(){Oe.hidden=!1,vt(N,{config:t,places:n,routes:o,water:s,gpsPosition:wt()})}let L=null;if(h)try{const{mountMapLibre:p}=await Ze(async()=>{const{mountMapLibre:m}=await import("./map-CgSim__x.js");return{mountMapLibre:m}},[]);N.innerHTML='<div id="maplibre-container" style="width:100%;height:100%;"></div>',L=await p(N.querySelector("#maplibre-container"),{config:t,places:n,routes:o,water:s,food:d,fuel:c,accommodation:u,transport:v,attractions:a}),L.setOnPoiClick(Be)}catch(p){console.warn("MapLibre failed to load, falling back to offline corridor view",p),await U()}else await U();Ie(({position:p})=>{L&&p?L.setGpsPosition(p):h||U()}),Te(),e.querySelector("#gpx-btn").addEventListener("click",()=>{const p=bt({places:n,routes:o,water:s,attractions:a,alerts:r});kt(p)}),L?(C.addEventListener("click",()=>{se(),C.hidden=!0,O.hidden=!1,L.playDemo(()=>{C.hidden=!1,O.hidden=!0})}),O.addEventListener("click",()=>{L.stopDemo(),C.hidden=!1,O.hidden=!0})):C.hidden=!0}async function It(e){const[t,n]=await Promise.all([te(),ne()]);e.innerHTML=`
    <div class="screen-pad">
      ${Pe()}
      <div class="section-title">Itinerary</div>
      ${n.map(o=>`
        <a href="#/itinerary/${o.id}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <div class="pill-row"><span class="pill">${i(o.date)}</span>${P(t,o.status)}</div>
          <h3>${i(o.title)}</h3>
          <p>${i(o.summary)}</p>
        </a>
      `).join("")}
    </div>
  `}async function Tt(e,{dayId:t}){const[n,o]=await Promise.all([te(),rt(t)]);if(!o){e.innerHTML='<div class="screen-pad"><p>Day not found.</p></div>';return}const[s,a,r,d,c]=await Promise.all([it(o.routeId),Promise.resolve(o.accommodationIds??[]),be(),$e(),ke()]),u=(await we()).filter(l=>o.accommodationIds?.includes(l.id)),v=r.filter(l=>o.foodIds?.includes(l.id)),g=d.waterPoints.filter(l=>o.waterIds?.includes(l.id)),h=c.filter(l=>o.transportIds?.includes(l.id));let f=null,b=null;s&&([f,b]=await Promise.all([le(s.fromPlaceId),le(s.toPlaceId)])),e.innerHTML=`
    <div class="screen-pad">
      <a href="#/itinerary" class="btn-secondary btn" style="margin-bottom:12px;display:inline-block;">&larr; All days</a>
      <div class="pill-row"><span class="pill">${i(o.date)}</span>${P(n,o.status)}</div>
      <h2 style="margin:6px 0;">${i(o.title)}</h2>
      <p>${i(o.summary)}</p>

      ${s?`
        <div class="card">
          <h3>Route</h3>
          <p>${f?i(f.name):"?"} &rarr; ${b?i(b.name):"?"}</p>
          ${s.metrics.map(l=>`<p>${l.distanceKm} km &middot; +${l.ascentM} m &middot; source: ${i(l.source)} (${i(l.date)})</p>`).join("")}
          ${s.variants?.length?s.variants.map(l=>`
            <p>${P(n,l.status)} <strong>${i(l.name)}</strong> — ${i(l.notes)}</p>
          `).join(""):""}
          ${s.notes?`<p><em>${i(s.notes)}</em></p>`:""}
        </div>
      `:""}

      ${o.tasks?.length?`<div class="section-title">Tasks</div><div class="card"><ul>${o.tasks.map(l=>`<li>${i(l)}</li>`).join("")}</ul></div>`:""}
      ${o.preTripTasks?.length?`<div class="section-title">Pre-trip tasks</div><div class="card"><ul>${o.preTripTasks.map(l=>`<li>${i(l)}</li>`).join("")}</ul></div>`:""}

      ${g.length?`<div class="section-title">Water</div>${g.map(l=>`
        <div class="card"><h3>${i(l.name)}</h3><p>${i(l.waterType)} &middot; ${i(l.status)} &middot; ${i(l.treatment)}</p><p>${i(l.notes)}</p></div>
      `).join("")}`:""}

      ${v.length?`<div class="section-title">Food</div>${v.map(l=>`
        <div class="card">${P(n,l.status)} <strong>${i(l.name)}</strong> <p>${i(l.notes)}</p></div>
      `).join("")}`:""}

      ${u.length?`<div class="section-title">Sleep</div>${u.map(l=>`
        <div class="card">${P(n,l.status)} <strong>${i(l.name)}</strong><p>${i(l.priceInfo)}</p><p>${i(l.notes)}</p></div>
      `).join("")}`:""}

      ${h.length?`<div class="section-title">Transport</div>${h.map(l=>`
        <div class="card">${P(n,l.status)} <strong>${i(l.name)}</strong><p>${i(l.notes)}</p></div>
      `).join("")}`:""}

      ${o.highlights?.length?`<div class="section-title">Highlights</div><div class="card"><ul>${o.highlights.map(l=>`<li>${i(l)}</li>`).join("")}</ul></div>`:""}
      ${o.watchOut?.length?`<div class="section-title">Watch out</div><ul class="warn-list">${o.watchOut.map(l=>`<li>${i(l)}</li>`).join("")}</ul>`:""}
      ${o.backupPlan?`<div class="section-title">Backup plan</div><div class="card">${i(o.backupPlan)}</div>`:""}
      ${o.notes?`<p style="color:var(--text-dim);font-size:0.8rem;">${i(o.notes)}</p>`:""}
    </div>
  `}const jt=[["#/itinerary","Itinerary","Day-by-day plan, 8–18 Oct"],["#/emergency","Emergency","112, GPS, bailout info"]],Ct=["before-we-leave","turkish-phrases","hiker-reports"];async function Ft(e){const[t,n]=await Promise.all([Ke(),Promise.all(Ct.map(o=>_e(o).then(s=>[o,s])))]);e.innerHTML=`
    <div class="screen-pad">
      <div class="card">
        <p id="offline-status">${t?"Trip data is saved for offline use.":"Trip data is not yet saved for offline use."}</p>
        <button class="btn" id="save-offline-btn">Save for offline</button>
      </div>

      <div class="section-title">Trip</div>
      ${jt.map(([o,s,a])=>`
        <a href="${o}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${i(s)}</h3>
          <p>${i(a)}</p>
        </a>
      `).join("")}

      <div class="section-title">Field guide</div>
      <p style="color:var(--text-dim);font-size:0.78rem;margin-top:-4px;">Water, food, sleep, transport, safety, and places to see now live as markers on the Map tab — tap a pin for details.</p>
      ${n.map(([o,s])=>`
        <a href="#/knowledge/${o}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${i(s.meta.title??o)}</h3>
          <p>Confidence: ${i(s.meta.confidence??"?")} &middot; last verified ${i(s.meta.lastVerified??"?")}</p>
        </a>
      `).join("")}
    </div>
  `,e.querySelector("#save-offline-btn").addEventListener("click",async o=>{const s=o.currentTarget;s.disabled=!0,s.textContent="Saving…";try{await Ue((a,r)=>s.textContent=`Saving ${a}/${r}…`),e.querySelector("#offline-status").textContent="Trip data saved for offline use.",s.textContent="Saved"}catch(a){s.textContent="Save failed — retry",s.disabled=!1,console.error(a)}})}function Ot(e){const t=e.split(`
`);let n="",o=0;for(;o<t.length;){const s=t[o];if(/^\s*$/.test(s)){o++;continue}if(s.startsWith("# ")){n+=`<h2>${F(s.slice(2))}</h2>`,o++;continue}if(s.startsWith("## ")){n+=`<h3>${F(s.slice(3))}</h3>`,o++;continue}if(s.startsWith("**")&&s.match(/^\*\*.+\*\*/),s.startsWith("|")){const r=[];for(;o<t.length&&t[o].startsWith("|");)r.push(t[o]),o++;n+=qt(r);continue}if(s.startsWith("- ")){const r=[];for(;o<t.length&&t[o].startsWith("- ");)r.push(t[o].slice(2)),o++;n+=`<ul>${r.map(d=>`<li>${F(d)}</li>`).join("")}</ul>`;continue}const a=[];for(;o<t.length&&!/^\s*$/.test(t[o])&&!t[o].startsWith("|")&&!t[o].startsWith("- ")&&!t[o].startsWith("#");)a.push(t[o]),o++;n+=`<p>${F(a.join(" "))}</p>`}return n}function qt(e){e.filter(a=>!/^\|[\s-]+\|$/.test((a.replace(/[^|\s-]/g,""),a)));const n=e.filter(a=>!/^\|(\s*-+\s*\|)+$/.test(a)).map(a=>a.split("|").slice(1,-1).map(r=>r.trim()));if(!n.length)return"";const[o,...s]=n;return`<table class="phrases">
    <tbody>
      ${s.map(a=>`<tr>${a.map(r=>`<td>${F(r)}</td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>`}function F(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\[(.+?)\]\((.+?)\)/g,(t,n,o)=>{const s=o.endsWith(".md");return`<a href="${s?`#/knowledge/${o.replace(/\.md$/,"")}`:o}"${s?"":' target="_blank" rel="noopener"'}>${n}</a>`})}async function Rt(e,{slug:t}){const n=await _e(t);e.innerHTML=`
    <div class="screen-pad">
      <a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge base</a>
      <h2>${i(n.meta.title??t)}</h2>
      <p style="color:var(--text-dim);font-size:0.8rem;">Confidence: ${i(n.meta.confidence??"?")} &middot; last verified ${i(n.meta.lastVerified??"?")}</p>
      <div class="card">${Ot(n.body)}</div>
    </div>
  `}async function Bt(e){e.innerHTML=`
    <div class="screen-pad">
      ${Pe()}
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
  `;const t=e.querySelector("#emergency-gps");Ie(({position:n,error:o})=>{n?t.innerHTML=`
        <p>${n.lat.toFixed(5)}, ${n.lon.toFixed(5)}</p>
        <p>Accuracy: ±${Math.round(n.accuracy)} m</p>
        <div class="link-row">
          <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${n.lat},${n.lon}">Open in Google Maps</a>
        </div>
      `:o&&(t.innerHTML=`<p>${i(o.message)}</p>`)}),Te()}document.getElementById("app").innerHTML=`
  <header class="app-header">
    <div class="app-header__brand">Lycian Way 2026</div>
    <div class="segmented" role="tablist">
      <button class="segmented__btn" data-view="map" role="tab">Map</button>
      <button class="segmented__btn" data-view="kb" role="tab">Knowledge Base</button>
    </div>
  </header>
  <div id="screen"></div>
`;I("#/map",At);I("#/itinerary",It);I("#/itinerary/:dayId",Tt);I("#/knowledge",Ft);I("#/knowledge/:slug",Rt);I("#/emergency",Bt);const Fe=document.querySelectorAll(".segmented__btn");Fe.forEach(e=>{e.addEventListener("click",()=>{location.hash=e.dataset.view==="map"?"#/map":"#/knowledge"})});Ve(e=>{const t=e==="#/map"||e==="";document.getElementById("screen").classList.toggle("screen--full-bleed",t),Fe.forEach(n=>n.classList.toggle("segmented__btn--active",n.dataset.view==="map"===t))});De();Je();export{Ze as _,R as a,ht as b,ft as c,Me as g,pt as p,Se as s,Wt as t,Dt as u};
//# sourceMappingURL=index-B4oT1YTm.js.map
