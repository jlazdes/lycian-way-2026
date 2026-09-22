(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();const B="lycian-2026-v1";function Ie(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/lycian-way-2026/sw.js").catch(e=>console.warn("SW registration failed",e))})}const _e=["config","trip","itinerary","routes","places","water","accommodation","food","fuel","transport","alerts","attractions","sources","changelog"],je=["before-we-leave","water","food","fuel","sleep","transport","route-decisions","safety","ancient-lycia","turkish-phrases","hiker-reports"];function Fe(){const e=new Set;return document.querySelectorAll("script[src]").forEach(t=>e.add(t.src)),document.querySelectorAll('link[rel="stylesheet"]').forEach(t=>e.add(t.href)),document.querySelectorAll('link[rel="icon"], link[rel="manifest"]').forEach(t=>e.add(t.href)),[...e].filter(t=>t.startsWith(location.origin))}async function Oe(e){if(!("caches"in window))throw new Error("Cache API not supported in this browser.");const t="/lycian-way-2026/",s=[location.origin+t,`${t}index.html`,`${t}manifest.webmanifest`,...Fe(),..._e.map(o=>`${t}data/${o}.json`),...je.map(o=>`${t}content/knowledge/${o}.md`)],n=await caches.open(B);let a=0;for(const o of s){try{await n.add(o)}catch(c){console.warn(`Could not cache ${o}`,c)}a+=1,e?.(a,s.length)}return{cached:a,total:s.length}}async function Ce(){return!("caches"in window)||!await caches.has(B)?!1:(await(await caches.open(B)).keys()).length>0}const re=[];let ie=null;const Re="#/map";function k(e,t){const s=[],n=e.replace(/:([\w]+)/g,(o,c)=>(s.push(c),"([^/]+)")),a=new RegExp(`^${n}$`);re.push({regex:a,paramNames:s,render:t})}function We(e){ie=e}function Be(e){for(const t of re){const s=e.match(t.regex);if(s){const n={};return t.paramNames.forEach((a,o)=>n[a]=decodeURIComponent(s[o+1])),{render:t.render,params:n}}}return null}async function Z(){const e=document.getElementById("screen"),t=location.hash||Re,s=Be(t);if(ie?.(t),!s){e.innerHTML='<div class="screen-pad"><p>Not found.</p></div>';return}try{await s.render(e,s.params)}catch(n){console.error(n),e.innerHTML='<div class="screen-pad"><p>Something went wrong loading this screen.</p></div>'}}function He(){window.addEventListener("hashchange",Z),Z()}const T=new Map;function ce(){return"/lycian-way-2026/"}async function P(e){if(T.has(e))return T.get(e);const t=await fetch(`${ce()}data/${e}.json`);if(!t.ok)throw new Error(`Failed to load data/${e}.json: ${t.status}`);const s=await t.json();return T.set(e,s),s}const M=()=>P("config").then(e=>e),K=()=>P("itinerary").then(e=>e.days),le=()=>P("routes").then(e=>e.routes),de=()=>P("places").then(e=>e.places),U=()=>P("water"),pe=()=>P("accommodation").then(e=>e.accommodations),ue=()=>P("food").then(e=>e.foodPlaces),qe=()=>P("fuel"),fe=()=>P("transport").then(e=>e.transportLegs),me=()=>P("alerts").then(e=>e.alerts),ge=()=>P("attractions").then(e=>e.attractions),De=()=>P("sources").then(e=>e.sources),Ne=De().then(e=>{const t=new Map;for(const s of e)t.set(s.id,s);return t}),Ge=async e=>(await Ne).get(e);async function Ke(e){return(await K()).find(s=>s.id===e)}async function he(e){return e?(await le()).find(s=>s.id===e):null}async function ee(e){return e?(await de()).find(s=>s.id===e):null}async function Ue(){return["before-we-leave","water","food","fuel","sleep","transport","route-decisions","safety","ancient-lycia","turkish-phrases","hiker-reports"]}async function ye(e){const t=`knowledge:${e}`;if(T.has(t))return T.get(t);const s=await fetch(`${ce()}content/knowledge/${e}.md`);if(!s.ok)throw new Error(`Failed to load knowledge/${e}.md: ${s.status}`);const n=await s.text(),a=Ve(n);return T.set(t,a),a}function Ve(e){const t=e.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);if(!t)return{meta:{},body:e};const[,s,n]=t,a={};for(const o of s.split(`
`)){const c=o.match(/^(\w+):\s*(.*)$/);if(!c)continue;const[,d,i]=c;i.startsWith("[")&&i.endsWith("]")?a[d]=i.slice(1,-1).split(",").map(p=>p.trim()).filter(Boolean):a[d]=i.trim()}return{meta:a,body:n.trim()}}const te={neutral:"#AAAAAA",orange:"#FF8800",yellow:"#FFEE00",red:"#FF0000"};function ve(e,t){return e?.status?.[t]?.color??te[t]??te.neutral}function $e(e,t){return e?.status?.[t]?.label??t}const ze={confirmed_available:"neutral",seasonal:"orange",uncertain:"orange",reported_dry:"red",confirmed_unavailable:"red"};function Xe(e){return ze[e]??"orange"}function w(e,t,{small:s=!1}={}){const n=ve(e,t),a=$e(e,t),o=s?"status-badge status-badge--small":"status-badge",c=t==="orange"||t==="yellow"||t==="red";return`<span class="${o}" style="--status-color:${n}" title="${r(a)}">
    <span class="status-badge__dot"></span>${c?'<span class="status-badge__warn">&#9650;</span>':""}
  </span>`}function S(){return'<a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge Base</a>'}function r(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let ne=null,H=null;const q=new Set;let A=null,E=null,D=null,we=7e3;function Ye({updateIntervalSeconds:e}={}){e&&(we=e*1e3)}function V(e){return q.add(e),(A||E)&&e({position:A,error:E}),()=>q.delete(e)}function N(){for(const e of q)e({position:A,error:E})}function se(){D&&(A=D,E=null,N()),H=null}function z(){if(ne===null){if(!("geolocation"in navigator)){E={code:"unsupported",message:"Geolocation not supported in this browser."},N();return}ne=navigator.geolocation.watchPosition(e=>{D={lat:e.coords.latitude,lon:e.coords.longitude,accuracy:e.coords.accuracy,heading:typeof e.coords.heading=="number"&&!Number.isNaN(e.coords.heading)?e.coords.heading:null,timestamp:e.timestamp},A||se(),H===null&&(H=setTimeout(se,we))},e=>{E={code:e.code,message:e.message},N()},{enableHighAccuracy:!0,maximumAge:5e3,timeout:15e3})}}function Je(){return A}function Qe(e,t){const s=new Date().toISOString().slice(0,10),n=t.trip.startDate,a=t.trip.endDate;return s<n?e[0]:s>a?e[e.length-1]:e.find(o=>o.date===s)??e[0]}async function Ze(e){const[t,s,n]=await Promise.all([M(),K(),me()]),a=Qe(s,t),o=await he(a.routeId),c=await Ce();e.innerHTML=`
    <div class="screen-pad">
      ${S()}
      <div class="card">
        <div class="pill-row"><span class="pill">${r(a.date)}</span>${w(t,a.status)}</div>
        <h3>${r(a.title)}</h3>
        <p>${r(a.summary)}</p>
        ${o?`<p>${o.metrics[0]?.distanceKm??"?"} km &middot; +${o.metrics[0]?.ascentM??"?"} m ascent (source: ${r(o.metrics[0]?.source??"unknown")})</p>`:""}
        ${a.tasks?.length?`<div class="section-title">Tasks</div><ul class="warn-list" style="color:var(--text-dim)">${a.tasks.map(i=>`<li style="color:var(--text-dim)">${r(i)}</li>`).join("")}</ul>`:""}
        ${a.watchOut?.length?`<div class="section-title">Watch out</div><ul class="warn-list">${a.watchOut.map(i=>`<li>${r(i)}</li>`).join("")}</ul>`:""}
        <div class="link-row">
          <a class="btn btn-secondary" href="#/itinerary/${a.id}">Full day view</a>
        </div>
      </div>

      ${n.length?`
        <div class="section-title">Active warnings</div>
        ${n.map(i=>`
          <div class="card">
            ${w(t,i.status)} <strong>${r(i.title)}</strong>
            <p>${r(i.description)}</p>
          </div>
        `).join("")}
      `:""}

      <div class="section-title">GPS</div>
      <div class="card" id="today-gps">
        <p>Requesting location…</p>
      </div>

      <div class="section-title">Offline</div>
      <div class="card">
        <p id="offline-status">${c?"Trip data is saved for offline use.":"Trip data is not yet saved for offline use."}</p>
        <button class="btn" id="save-offline-btn">Save for offline</button>
      </div>
    </div>
  `;const d=e.querySelector("#today-gps");V(({position:i,error:p})=>{i?d.innerHTML=`
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="gps-marker"></div>
          <div>
            <p style="margin:0">${i.lat.toFixed(5)}, ${i.lon.toFixed(5)}</p>
            <p style="margin:0">±${Math.round(i.accuracy)} m &middot; updated ${new Date(i.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      `:p&&(d.innerHTML=`<p>Location unavailable (${r(p.message)}). The app works fine without it.</p>`)}),z(),e.querySelector("#save-offline-btn").addEventListener("click",async i=>{const p=i.currentTarget;p.disabled=!0,p.textContent="Saving…";try{await Oe((m,u)=>p.textContent=`Saving ${m}/${u}…`),e.querySelector("#offline-status").textContent="Trip data saved for offline use.",p.textContent="Saved"}catch(m){p.textContent="Save failed — retry",p.disabled=!1,console.error(m)}})}const et="modulepreload",tt=function(e){return"/lycian-way-2026/"+e},ae={},nt=function(t,s,n){let a=Promise.resolve();if(s&&s.length>0){let c=function(p){return Promise.all(p.map(m=>Promise.resolve(m).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),i=d?.nonce||d?.getAttribute("nonce");a=c(s.map(p=>{if(p=tt(p),p in ae)return;ae[p]=!0;const m=p.endsWith(".css"),u=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${u}`))return;const f=document.createElement("link");if(f.rel=m?"stylesheet":et,m||(f.as="script"),f.crossOrigin="",f.href=p,i&&f.setAttribute("nonce",i),document.head.appendChild(f),m)return new Promise((y,b)=>{f.addEventListener("load",y),f.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${p}`)))})}))}function o(c){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=c,window.dispatchEvent(d),!d.defaultPrevented)throw c}return a.then(c=>{for(const d of c||[])d.status==="rejected"&&o(d.reason);return t().catch(o)})};function be([e,t],[s,n]){const o=t*Math.PI/180,c=n*Math.PI/180,d=(n-t)*Math.PI/180,i=(s-e)*Math.PI/180,p=Math.sin(d/2)**2+Math.cos(o)*Math.cos(c)*Math.sin(i/2)**2;return 2*6371e3*Math.asin(Math.sqrt(p))}function O(e){const t=[0];for(let s=1;s<e.length;s++)t.push(t[s-1]+be(e[s-1],e[s]));return t}function Tt(e){const t=O(e);return t[t.length-1]??0}function st(e,t){if(t.length<2)return null;const s=O(t);let n=null;for(let a=0;a<t.length-1;a++){const o=t[a],c=t[a+1],{t:d,pt:i,dist:p}=at(e,o,c),m=s[a]+d*(s[a+1]-s[a]);(!n||p<n.distanceFrom)&&(n={distanceAlong:m,distanceFrom:p,pointOnLine:i,segmentIndex:a})}return n}function at(e,t,s){const n=(t[1]+s[1])/2*(Math.PI/180),a=([v,h])=>[v*Math.cos(n)*111320,h*111320],[o,c]=a(e),[d,i]=a(t),[p,m]=a(s),u=p-d,f=m-i;let y=u===0&&f===0?0:((o-d)*u+(c-i)*f)/(u*u+f*f);y=Math.max(0,Math.min(1,y));const b=d+y*u,l=i+y*f,I=Math.hypot(o-b,c-l),L=[t[0]+y*(s[0]-t[0]),t[1]+y*(s[1]-t[1])];return{t:y,pt:L,dist:I}}function ot(e,t){const s=O(e),n=s[s.length-1],a=Math.max(0,Math.min(n,t));for(let o=0;o<s.length-1;o++)if(a>=s[o]&&a<=s[o+1]){const c=s[o+1]-s[o],d=c===0?0:(a-s[o])/c,i=e[o],p=e[o+1];return[i[0]+d*(p[0]-i[0]),i[1]+d*(p[1]-i[1])]}return e[e.length-1]}function rt(e,t){const s=O(e),n=s[s.length-1];if(t<=0)return{before:[],after:e};if(t>=n)return{before:e,after:[]};const a=ot(e,t);let o=0;for(let i=0;i<s.length-1;i++)if(t>=s[i]&&t<=s[i+1]){o=i;break}const c=[...e.slice(0,o+1),a],d=[a,...e.slice(o+1)];return{before:c,after:d}}const it=["route-ovacik-faralya-kabak","route-kabak-alinca","route-alinca-yediburunlar","route-yediburunlar-bel-patara"];function ke(e,t,s=150){return!e||!t?!1:be(e,t)<s}function Pe(e,t){const s=e.geometry?.coordinates??[],n=t.get(e.toPlaceId),a=t.get(e.fromPlaceId);if(s.length===0){const c=[a?.coordinates,n?.coordinates].filter(Boolean);return{solid:[],dashed:c}}const o=s[s.length-1];return n&&!ke(o,n.coordinates)?{solid:s,dashed:[o,n.coordinates]}:{solid:s,dashed:[]}}function ct(e,t){const s=new Map(e.map(a=>[a.id,a]));let n=[];for(const a of it){const o=s.get(a);if(!o)continue;const{solid:c}=Pe(o,t);c.length!==0&&(n.length&&ke(n[n.length-1],c[0],5)?n=n.concat(c.slice(1)):n=n.concat(c))}return n}const Me="lycian-2026-trail-progress-m",lt=300;function j(){try{const e=localStorage.getItem(Me);return e?Number(e):0}catch{return 0}}function dt(e){try{localStorage.setItem(Me,String(e))}catch{}}function At(e,t){if(!e||t.length<2)return j();const s=st(e,t);if(!s||s.distanceFrom>lt)return j();const n=j();return s.distanceAlong>n?(dt(s.distanceAlong),s.distanceAlong):n}function F(e,[t,s],n,a,o){const c=o+(t-e.west)/(e.east-e.west)*(n-2*o),d=o+(1-(s-e.south)/(e.north-e.south))*(a-2*o);return[c,d]}function R(e,t,s,n,a){return t.map(o=>F(e,o,s,n,a))}function W(e,t,{dashed:s=!1,width:n=3}={}){return e.length<2?"":`<path d="${e.map((o,c)=>`${c===0?"M":"L"}${o[0].toFixed(1)},${o[1].toFixed(1)}`).join(" ")}" fill="none" stroke="${t}" stroke-width="${n}" stroke-linecap="round" stroke-linejoin="round" ${s?'stroke-dasharray="6 5"':""} opacity="0.9"/>`}function pt(e,{config:t,places:s,routes:n,water:a,gpsPosition:o}){const c=t.map.boundingBox,d=400,i=640,p=30,m=new Map(s.map(v=>[v.id,v])),u=t.routeProgress?.untraveled??"#AAAAAA",f=t.routeProgress?.traveled??"#00FF80";let y="";for(const v of n){const{solid:h,dashed:g}=Pe(v,m);g.length>=2&&(y+=W(R(c,g,d,i,p),u,{dashed:!0})),h.length>=2&&(y+=W(R(c,h,d,i,p),u))}const b=ct(n,m);if(b.length>=2){const v=j(),{before:h}=rt(b,v);h.length>=2&&(y+=W(R(c,h,d,i,p),f))}const l=s.map(v=>{const[h,g]=F(c,v.coordinates,d,i,p),$=ve(t,v.status);return`
      <circle cx="${h}" cy="${g}" r="5" fill="${$}" stroke="#0e1613" stroke-width="1.5"/>
      <text x="${h+8}" y="${g+4}" font-size="10" fill="#eef2ee">${r(v.name)}</text>
    `}).join(""),I=(a?.waterPoints??[]).map(v=>{const[h,g]=F(c,v.coordinates,d,i,p);return`<circle cx="${h}" cy="${g}" r="4" fill="#00A3FF" stroke="#0e1613" stroke-width="1.2"/>`}).join(""),L=o?(()=>{const[v,h]=F(c,[o.lon,o.lat],d,i,p);return`<circle cx="${v}" cy="${h}" r="7" fill="${t.gps?.markerColor??"#1A73E8"}" opacity="0.9"><animate attributeName="r" values="7;13;7" dur="1.6s" repeatCount="indefinite"/></circle>`})():"";e.innerHTML=`
    <svg viewBox="0 0 ${d} ${i}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;background:#182420;">
      ${y}
      ${I}
      ${l}
      ${L}
    </svg>
  `}function oe(e,t,s,n){return`  <wpt lat="${t}" lon="${e}"><name>${G(s)}</name>${n?`<desc>${G(n)}</desc>`:""}</wpt>`}function G(e){return String(e??"").replace(/[<>&'"]/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"})[t])}function ut({places:e,routes:t,water:s,attractions:n,alerts:a}){const o=[];for(const i of e)o.push(oe(i.coordinates[0],i.coordinates[1],i.name,"place"));for(const i of s?.waterPoints??[])o.push(oe(i.coordinates[0],i.coordinates[1],`Water: ${i.name}`,`${i.waterType} / ${i.status}`));const c=new Map(e.map(i=>[i.id,i])),d=t.map(i=>{const m=(i.geometry?.coordinates?.length?i.geometry.coordinates:[c.get(i.fromPlaceId)?.coordinates,c.get(i.toPlaceId)?.coordinates].filter(Boolean)).map(([u,f])=>`      <trkpt lat="${f}" lon="${u}"></trkpt>`).join(`
`);return`  <trk><name>${G(i.name)}</name><trkseg>
${m}
    </trkseg></trk>`});return`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Lycian Way 2026 Trip OS" xmlns="http://www.topografix.com/GPX/1/1">
${o.join(`
`)}
${d.join(`
`)}
</gpx>`}function ft(e,t="lycian-way-2026.gpx"){const s=new Blob([e],{type:"application/gpx+xml"}),n=URL.createObjectURL(s),a=document.createElement("a");a.href=n,a.download=t,a.click(),URL.revokeObjectURL(n)}async function mt(e){const[t,s,n,a,o,c]=await Promise.all([M(),de(),le(),U(),ge(),me()]);Ye(t.gps);const d=navigator.onLine&&!!t.map.tileProvider.styleUrl,i=new Map(o.filter(g=>g.placeId).map(g=>[g.placeId,g]));e.innerHTML=`
    <div class="map-screen">
      <div id="map-canvas-wrap"></div>
      <div id="map-fallback-note" class="map-fallback-note" hidden>Offline corridor view — no live map tiles right now.</div>

      <button class="map-fab map-fab--demo" id="demo-btn">▶ Play Demo</button>
      <button class="map-fab map-fab--stop-demo" id="demo-stop-btn" hidden>✕ End Demo</button>
      <button class="map-fab map-fab--gpx" id="gpx-btn" title="Download GPX" aria-label="Download GPX">GPX</button>

      <div id="poi-panel" class="poi-panel" hidden>
        <button class="poi-panel__close" id="poi-close-btn" aria-label="Close">&times;</button>
        <div id="poi-panel-body"></div>
      </div>
    </div>
  `;const p=e.querySelector("#map-canvas-wrap"),m=e.querySelector("#map-fallback-note"),u=e.querySelector("#demo-btn"),f=e.querySelector("#demo-stop-btn"),y=e.querySelector("#poi-panel"),b=e.querySelector("#poi-panel-body"),l=e.querySelector("#poi-close-btn");async function I({kind:g,data:$}){const C=g==="place",Le=C?i.get($.id):null,xe=$.name,X=C?$.status:$.status==="confirmed_available"?"neutral":$.status==="confirmed_unavailable"||$.status==="reported_dry"?"red":"orange",Te=$.confidence,Y=$.lastVerified,J=Le?.shortDescription??$.notes??"",[Ae,Ee]=$.coordinates,Q=await Promise.all(($.sources??[]).map(x=>Ge(x)));b.innerHTML=`
      <div class="pill-row">${w(t,X)}<span class="pill">${r($e(t,X))}</span></div>
      <h3>${r(xe)}</h3>
      ${C?"":`<p class="poi-panel__category">${r($.waterType??"water point")}</p>`}
      ${J?`<p>${r(J)}</p>`:""}
      <p style="font-size:0.75rem;color:var(--text-dim);">Confidence: ${r(Te??"?")}${Y?` &middot; last verified ${r(Y)}`:""}</p>
      ${Q.length?`<div class="section-title">Sources</div>${Q.filter(Boolean).map(x=>x.url?`<p><a href="${x.url}" target="_blank" rel="noopener">${r(x.title)}</a></p>`:`<p>${r(x.title)}</p>`).join("")}`:""}
      <div class="link-row">
        <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${Ee},${Ae}">Open in Google Maps</a>
      </div>
    `,y.hidden=!1}function L(){y.hidden=!0}l.addEventListener("click",L);async function v(){m.hidden=!1,pt(p,{config:t,places:s,routes:n,water:a,gpsPosition:Je()})}let h=null;if(d)try{const{mountMapLibre:g}=await nt(async()=>{const{mountMapLibre:$}=await import("./map-B6fQz0T-.js");return{mountMapLibre:$}},[]);p.innerHTML='<div id="maplibre-container" style="width:100%;height:100%;"></div>',h=await g(p.querySelector("#maplibre-container"),{config:t,places:s,routes:n,water:a}),h.setOnPoiClick(I)}catch(g){console.warn("MapLibre failed to load, falling back to offline corridor view",g),await v()}else await v();V(({position:g})=>{h&&g?h.setGpsPosition(g):d||v()}),z(),e.querySelector("#gpx-btn").addEventListener("click",()=>{const g=ut({places:s,routes:n,water:a,attractions:o,alerts:c});ft(g)}),h?(u.addEventListener("click",()=>{L(),u.hidden=!0,f.hidden=!1,h.playDemo(()=>{u.hidden=!1,f.hidden=!0})}),f.addEventListener("click",()=>{h.stopDemo(),u.hidden=!1,f.hidden=!0})):u.hidden=!0}async function gt(e){const[t,s]=await Promise.all([M(),K()]);e.innerHTML=`
    <div class="screen-pad">
      ${S()}
      <div class="section-title">Itinerary</div>
      ${s.map(n=>`
        <a href="#/itinerary/${n.id}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <div class="pill-row"><span class="pill">${r(n.date)}</span>${w(t,n.status)}</div>
          <h3>${r(n.title)}</h3>
          <p>${r(n.summary)}</p>
        </a>
      `).join("")}
    </div>
  `}async function ht(e,{dayId:t}){const[s,n]=await Promise.all([M(),Ke(t)]);if(!n){e.innerHTML='<div class="screen-pad"><p>Day not found.</p></div>';return}const[a,o,c,d,i]=await Promise.all([he(n.routeId),Promise.resolve(n.accommodationIds??[]),ue(),U(),fe()]),p=(await pe()).filter(l=>n.accommodationIds?.includes(l.id)),m=c.filter(l=>n.foodIds?.includes(l.id)),u=d.waterPoints.filter(l=>n.waterIds?.includes(l.id)),f=i.filter(l=>n.transportIds?.includes(l.id));let y=null,b=null;a&&([y,b]=await Promise.all([ee(a.fromPlaceId),ee(a.toPlaceId)])),e.innerHTML=`
    <div class="screen-pad">
      <a href="#/itinerary" class="btn-secondary btn" style="margin-bottom:12px;display:inline-block;">&larr; All days</a>
      <div class="pill-row"><span class="pill">${r(n.date)}</span>${w(s,n.status)}</div>
      <h2 style="margin:6px 0;">${r(n.title)}</h2>
      <p>${r(n.summary)}</p>

      ${a?`
        <div class="card">
          <h3>Route</h3>
          <p>${y?r(y.name):"?"} &rarr; ${b?r(b.name):"?"}</p>
          ${a.metrics.map(l=>`<p>${l.distanceKm} km &middot; +${l.ascentM} m &middot; source: ${r(l.source)} (${r(l.date)})</p>`).join("")}
          ${a.variants?.length?a.variants.map(l=>`
            <p>${w(s,l.status)} <strong>${r(l.name)}</strong> — ${r(l.notes)}</p>
          `).join(""):""}
          ${a.notes?`<p><em>${r(a.notes)}</em></p>`:""}
        </div>
      `:""}

      ${n.tasks?.length?`<div class="section-title">Tasks</div><div class="card"><ul>${n.tasks.map(l=>`<li>${r(l)}</li>`).join("")}</ul></div>`:""}
      ${n.preTripTasks?.length?`<div class="section-title">Pre-trip tasks</div><div class="card"><ul>${n.preTripTasks.map(l=>`<li>${r(l)}</li>`).join("")}</ul></div>`:""}

      ${u.length?`<div class="section-title">Water</div>${u.map(l=>`
        <div class="card"><h3>${r(l.name)}</h3><p>${r(l.waterType)} &middot; ${r(l.status)} &middot; ${r(l.treatment)}</p><p>${r(l.notes)}</p></div>
      `).join("")}`:""}

      ${m.length?`<div class="section-title">Food</div>${m.map(l=>`
        <div class="card">${w(s,l.status)} <strong>${r(l.name)}</strong> <p>${r(l.notes)}</p></div>
      `).join("")}`:""}

      ${p.length?`<div class="section-title">Sleep</div>${p.map(l=>`
        <div class="card">${w(s,l.status)} <strong>${r(l.name)}</strong><p>${r(l.priceInfo)}</p><p>${r(l.notes)}</p></div>
      `).join("")}`:""}

      ${f.length?`<div class="section-title">Transport</div>${f.map(l=>`
        <div class="card">${w(s,l.status)} <strong>${r(l.name)}</strong><p>${r(l.notes)}</p></div>
      `).join("")}`:""}

      ${n.highlights?.length?`<div class="section-title">Highlights</div><div class="card"><ul>${n.highlights.map(l=>`<li>${r(l)}</li>`).join("")}</ul></div>`:""}
      ${n.watchOut?.length?`<div class="section-title">Watch out</div><ul class="warn-list">${n.watchOut.map(l=>`<li>${r(l)}</li>`).join("")}</ul>`:""}
      ${n.backupPlan?`<div class="section-title">Backup plan</div><div class="card">${r(n.backupPlan)}</div>`:""}
      ${n.notes?`<p style="color:var(--text-dim);font-size:0.8rem;">${r(n.notes)}</p>`:""}
    </div>
  `}async function yt(e){const[t,s]=await Promise.all([M(),U()]),n=t.water.defaultCapacityLitersPerPerson;e.innerHTML=`
    <div class="screen-pad">
      ${S()}
      <div class="section-title">Water points</div>
      ${s.waterPoints.length?s.waterPoints.map(a=>`
        <div class="card">
          ${w(t,Xe(a.status))}
          <strong>${r(a.name)}</strong>
          <p>${r(a.waterType)} &middot; status: ${r(a.status)} &middot; treatment: ${r(a.treatment)}</p>
          <p>Confidence: ${r(a.confidence)} &middot; last verified ${r(a.lastVerified)}</p>
          <p>${r(a.notes)}</p>
        </div>
      `).join(""):'<p class="empty-state">No water points recorded yet.</p>'}

      <div class="section-title">Per-day water planning (capacity: ${n} L/person)</div>
      ${s.dayWaterPlans.length?s.dayWaterPlans.map(a=>`
        <div class="card">
          <strong>${r(a.dayId)}</strong>
          <p>Longest known gap: ${a.longestKnownGapKm!=null?a.longestKnownGapKm+" km":"unknown"}</p>
          <p>Risk: ${r(a.risk)}</p>
          <p>${r(a.notes)}</p>
        </div>
      `).join(""):'<p class="empty-state">No per-day water plans recorded yet.</p>'}
    </div>
  `}async function vt(e){const[t,s,n]=await Promise.all([M(),ue(),qe()]);e.innerHTML=`
    <div class="screen-pad">
      ${S()}
      <div class="section-title">Food &amp; shops</div>
      ${s.length?s.map(a=>`
        <div class="card">
          ${w(t,a.status)} <strong>${r(a.name)}</strong>
          <p>${r(a.category)} &middot; confidence: ${r(a.confidence)}</p>
          <p>${r(a.notes)}</p>
        </div>
      `).join(""):'<p class="empty-state">No food/shop records yet.</p>'}

      <div class="section-title">Fuel — ${r(n.fuelType)}</div>
      ${n.sellers.length?n.sellers.map(a=>`
        <div class="card">${w(t,a.status)} <strong>${r(a.name)}</strong></div>
      `).join(""):'<p class="empty-state">No fuel sellers researched yet — pre-trip task. Seller existence and correct canister stock will be tracked separately once found.</p>'}
    </div>
  `}async function $t(e){const[t,s]=await Promise.all([M(),pe()]);e.innerHTML=`
    <div class="screen-pad">
      ${S()}
      <div class="section-title">Sleep</div>
      ${s.length?s.map(n=>`
        <div class="card">
          ${w(t,n.status)} <strong>${r(n.name)}</strong>
          <p>${r(n.type)} &middot; ${r(n.priceInfo)}</p>
          <p>Confidence: ${r(n.confidence)} &middot; last verified ${r(n.lastVerified)}</p>
          <p>${r(n.notes)}</p>
        </div>
      `).join(""):'<p class="empty-state">Nothing recorded yet.</p>'}
    </div>
  `}async function wt(e){const[t,s]=await Promise.all([M(),fe()]);e.innerHTML=`
    <div class="screen-pad">
      ${S()}
      <div class="section-title">Transport</div>
      ${s.map(n=>`
        <div class="card">
          ${w(t,n.status)} <strong>${r(n.name)}</strong>
          ${n.date?`<p>${r(n.date)}</p>`:""}
          <p>Confidence: ${r(n.confidence)}${n.lastVerified?` &middot; last verified ${r(n.lastVerified)}`:""}</p>
          <p>${r(n.notes)}</p>
        </div>
      `).join("")}
    </div>
  `}async function bt(e){const[t,s]=await Promise.all([M(),ge()]);e.innerHTML=`
    <div class="screen-pad">
      ${S()}
      <div class="section-title">Places to see</div>
      ${s.map(n=>`
        <div class="card">
          ${w(t,n.status)} <strong>${r(n.name)}</strong>
          <p>${r(n.shortDescription)}</p>
          <p style="font-size:0.75rem;">${r(n.routeDistanceNote)}</p>
          <div class="link-row">
            <a class="btn btn-secondary" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n.name)}">Open in Google Maps</a>
          </div>
        </div>
      `).join("")}
    </div>
  `}const kt=[["#/today","Today","What's happening right now, tasks, warnings"],["#/itinerary","Itinerary","Day-by-day plan, 8–18 Oct"],["#/water","Water","Water points and per-day refill planning"],["#/resupply","Resupply","Food, shops, fuel"],["#/sleep","Sleep","Camps and accommodation"],["#/transport","Transport","Flights, dolmuş, ground transport"],["#/places","Places to see","Attractions on or near the route"],["#/emergency","Emergency","112, GPS, bailout info"]];async function Pt(e){const t=await Ue(),s=await Promise.all(t.map(n=>ye(n).then(a=>[n,a])));e.innerHTML=`
    <div class="screen-pad">
      <div class="section-title">Trip</div>
      ${kt.map(([n,a,o])=>`
        <a href="${n}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${r(a)}</h3>
          <p>${r(o)}</p>
        </a>
      `).join("")}

      <div class="section-title">Field guide</div>
      ${s.map(([n,a])=>`
        <a href="#/knowledge/${n}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${r(a.meta.title??n)}</h3>
          <p>Confidence: ${r(a.meta.confidence??"?")} &middot; last verified ${r(a.meta.lastVerified??"?")}</p>
        </a>
      `).join("")}
    </div>
  `}function Mt(e){const t=e.split(`
`);let s="",n=0;for(;n<t.length;){const a=t[n];if(/^\s*$/.test(a)){n++;continue}if(a.startsWith("# ")){s+=`<h2>${_(a.slice(2))}</h2>`,n++;continue}if(a.startsWith("## ")){s+=`<h3>${_(a.slice(3))}</h3>`,n++;continue}if(a.startsWith("**")&&a.match(/^\*\*.+\*\*/),a.startsWith("|")){const c=[];for(;n<t.length&&t[n].startsWith("|");)c.push(t[n]),n++;s+=St(c);continue}if(a.startsWith("- ")){const c=[];for(;n<t.length&&t[n].startsWith("- ");)c.push(t[n].slice(2)),n++;s+=`<ul>${c.map(d=>`<li>${_(d)}</li>`).join("")}</ul>`;continue}const o=[];for(;n<t.length&&!/^\s*$/.test(t[n])&&!t[n].startsWith("|")&&!t[n].startsWith("- ")&&!t[n].startsWith("#");)o.push(t[n]),n++;s+=`<p>${_(o.join(" "))}</p>`}return s}function St(e){e.filter(o=>!/^\|[\s-]+\|$/.test((o.replace(/[^|\s-]/g,""),o)));const s=e.filter(o=>!/^\|(\s*-+\s*\|)+$/.test(o)).map(o=>o.split("|").slice(1,-1).map(c=>c.trim()));if(!s.length)return"";const[n,...a]=s;return`<table class="phrases">
    <tbody>
      ${a.map(o=>`<tr>${o.map(c=>`<td>${_(c)}</td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>`}function _(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\[(.+?)\]\((.+?)\)/g,(t,s,n)=>{const a=n.endsWith(".md");return`<a href="${a?`#/knowledge/${n.replace(/\.md$/,"")}`:n}"${a?"":' target="_blank" rel="noopener"'}>${s}</a>`})}async function Lt(e,{slug:t}){const s=await ye(t);e.innerHTML=`
    <div class="screen-pad">
      <a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge base</a>
      <h2>${r(s.meta.title??t)}</h2>
      <p style="color:var(--text-dim);font-size:0.8rem;">Confidence: ${r(s.meta.confidence??"?")} &middot; last verified ${r(s.meta.lastVerified??"?")}</p>
      <div class="card">${Mt(s.body)}</div>
    </div>
  `}async function xt(e){e.innerHTML=`
    <div class="screen-pad">
      ${S()}
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
  `;const t=e.querySelector("#emergency-gps");V(({position:s,error:n})=>{s?t.innerHTML=`
        <p>${s.lat.toFixed(5)}, ${s.lon.toFixed(5)}</p>
        <p>Accuracy: ±${Math.round(s.accuracy)} m</p>
        <div class="link-row">
          <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lon}">Open in Google Maps</a>
        </div>
      `:n&&(t.innerHTML=`<p>${r(n.message)}</p>`)}),z()}document.getElementById("app").innerHTML=`
  <header class="app-header">
    <div class="app-header__brand">Lycian Way 2026</div>
    <div class="segmented" role="tablist">
      <button class="segmented__btn" data-view="map" role="tab">Map</button>
      <button class="segmented__btn" data-view="kb" role="tab">Knowledge Base</button>
    </div>
  </header>
  <div id="screen"></div>
`;k("#/map",mt);k("#/today",Ze);k("#/itinerary",gt);k("#/itinerary/:dayId",ht);k("#/water",yt);k("#/resupply",vt);k("#/sleep",$t);k("#/transport",wt);k("#/places",bt);k("#/knowledge",Pt);k("#/knowledge/:slug",Lt);k("#/emergency",xt);const Se=document.querySelectorAll(".segmented__btn");Se.forEach(e=>{e.addEventListener("click",()=>{location.hash=e.dataset.view==="map"?"#/map":"#/knowledge"})});We(e=>{const t=e==="#/map"||e==="";document.getElementById("screen").classList.toggle("screen--full-bleed",t),Se.forEach(s=>s.classList.toggle("segmented__btn--active",s.dataset.view==="map"===t))});Ie();He();export{nt as _,j as a,ct as b,rt as c,Pe as g,ot as p,ve as s,Tt as t,At as u};
//# sourceMappingURL=index-Vq4wltqw.js.map
