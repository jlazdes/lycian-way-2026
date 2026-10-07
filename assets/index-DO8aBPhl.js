(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();const fe="lycian-2026-v2",j="lycian-map-v1";function yt(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/lycian-way-2026/sw.js").catch(e=>console.warn("SW registration failed",e))})}const $t=["config","trip","itinerary","routes","places","water","accommodation","food","fuel","transport","alerts","attractions","sources","changelog","trail","pois"],vt=["before-we-leave","water","food","fuel","sleep","transport","route-decisions","safety","ancient-lycia","turkish-phrases","hiker-reports"];function wt(){const e=new Set;return document.querySelectorAll("script[src]").forEach(t=>e.add(t.src)),document.querySelectorAll('link[rel="stylesheet"], link[rel="modulepreload"]').forEach(t=>e.add(t.href)),document.querySelectorAll('link[rel="icon"], link[rel="manifest"]').forEach(t=>e.add(t.href)),[...e].filter(t=>t.startsWith(location.origin))}async function bt(e){if(!("caches"in window))throw new Error("Cache API not supported in this browser.");const t="/lycian-way-2026/",n=[location.origin+t,`${t}index.html`,`${t}manifest.webmanifest`,`${t}vendor/maplibre-gl-worker.mjs`,`${t}vendor/maplibre-gl-shared.mjs`,...wt(),...$t.map(a=>`${t}data/${a}.json`),...vt.map(a=>`${t}content/knowledge/${a}.md`)];navigator.serviceWorker?.controller?.postMessage({type:"precache"});const o=await caches.open(fe);let s=0;for(const a of n){try{const l=await fetch(a,{cache:"reload"});l.ok&&await o.put(a,l)}catch(l){console.warn(`Could not cache ${a}`,l)}s+=1,e?.(s,n.length)}return{cached:s,total:n.length}}async function Mt(){return!("caches"in window)||!await caches.has(fe)?!1:!!await(await caches.open(fe)).match("/lycian-way-2026/data/trail.json")}function G(e){return`${location.origin}/lycian-way-2026/offline/${e.split("/").map(encodeURIComponent).join("/")}`}async function je(){const e=G("manifest.json");try{const t=await fetch(e,{cache:"no-cache"});if(t.ok)return await t.json()}catch{}if("caches"in window){const t=await(await caches.open(j)).match(e);if(t)return t.json()}return null}async function kt(){if(!("caches"in window)||!await caches.has(j))return!1;const e=await caches.open(j),t=await e.match(G("manifest.json"));if(!t)return!1;const{files:n}=await t.json();for(const o of n)if(!await e.match(G(o.path)))return!1;return!0}async function _t(e){if(!("caches"in window))throw new Error("Этот браузер не поддерживает офлайн-кэш.");const t=await je();if(!t)throw new Error("Не удалось получить список файлов карты — нужен интернет.");const n=await caches.open(j);let o=0;for(const s of t.files){const a=G(s.path),l=await fetch(a,{cache:"no-cache"});if(!l.ok||!l.body)throw new Error(`Ошибка загрузки ${s.path}: ${l.status}`);const f=l.body.getReader(),d=[];let r=0;for(;;){const{done:m,value:h}=await f.read();if(m)break;d.push(h),r+=h.length,e?.(o+r,t.totalBytes)}o+=s.bytes,await n.put(a,new Response(new Blob(d),{headers:{"Content-Type":l.headers.get("Content-Type")??"application/octet-stream"}})),e?.(o,t.totalBytes)}return await n.put(G("manifest.json"),new Response(JSON.stringify(t),{headers:{"Content-Type":"application/json"}})),t}async function St(){"caches"in window&&await caches.delete(j)}async function Tn(){if(!("caches"in window)||!await caches.has(j))return null;const e=await(await caches.open(j)).match(G("corridor.pmtiles"));return e?new File([await e.blob()],"corridor.pmtiles"):null}function Pn(){return`${location.origin}/lycian-way-2026/offline/`}function de(e){return e<1024*1024?`${Math.round(e/1024)} КБ`:`${(e/1024/1024).toFixed(1).replace(".",",")} МБ`}const Oe=[];let Be=null;const xt="#/map";function N(e,t){const n=[],o=e.replace(/:([\w]+)/g,(a,l)=>(n.push(l),"([^/]+)")),s=new RegExp(`^${o}$`);Oe.push({regex:s,paramNames:n,render:t})}function Lt(e){Be=e}function At(e){for(const t of Oe){const n=e.match(t.regex);if(n){const o={};return t.paramNames.forEach((s,a)=>o[s]=decodeURIComponent(n[a+1])),{render:t.render,params:o}}}return null}async function _e(){const e=document.getElementById("screen"),t=location.hash||xt,n=At(t);if(Be?.(t),!n){e.innerHTML='<div class="screen-pad"><p>Not found.</p></div>';return}try{await n.render(e,n.params)}catch(o){console.error(o),e.innerHTML='<div class="screen-pad"><p>Something went wrong loading this screen.</p></div>'}}function Tt(){window.addEventListener("hashchange",_e),_e()}const Pt="modulepreload",Et=function(e){return"/lycian-way-2026/"+e},Se={},It=function(t,n,o){let s=Promise.resolve();if(n&&n.length>0){let l=function(r){return Promise.all(r.map(m=>Promise.resolve(m).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const f=document.querySelector("meta[property=csp-nonce]"),d=f?.nonce||f?.getAttribute("nonce");s=l(n.map(r=>{if(r=Et(r),r in Se)return;Se[r]=!0;const m=r.endsWith(".css"),h=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${h}`))return;const y=document.createElement("link");if(y.rel=m?"stylesheet":Pt,m||(y.as="script"),y.crossOrigin="",y.href=r,d&&y.setAttribute("nonce",d),document.head.appendChild(y),m)return new Promise((v,b)=>{y.addEventListener("load",v),y.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${r}`)))})}))}function a(l){const f=new Event("vite:preloadError",{cancelable:!0});if(f.payload=l,window.dispatchEvent(f),!f.defaultPrevented)throw l}return s.then(l=>{for(const f of l||[])f.status==="rejected"&&a(f.reason);return t().catch(a)})},q=new Map;function qe(){return"/lycian-way-2026/"}async function x(e){if(q.has(e))return q.get(e);const t=await fetch(`${qe()}data/${e}.json`);if(!t.ok)throw new Error(`Failed to load data/${e}.json: ${t.status}`);const n=await t.json();return q.set(e,n),n}const ve=()=>x("config").then(e=>e),we=()=>x("itinerary").then(e=>e.days),He=()=>x("routes").then(e=>e.routes),Ge=()=>x("places").then(e=>e.places),Re=()=>x("water"),We=()=>x("accommodation").then(e=>e.accommodations),Ne=()=>x("food").then(e=>e.foodPlaces),Ct=()=>x("fuel"),ze=()=>x("transport").then(e=>e.transportLegs),Ft=()=>x("alerts").then(e=>e.alerts),jt=()=>x("attractions").then(e=>e.attractions),Ot=()=>x("sources").then(e=>e.sources),De=()=>x("trail"),Ue=()=>x("pois"),Bt=Ot().then(e=>{const t=new Map;for(const n of e)t.set(n.id,n);return t}),qt=async e=>(await Bt).get(e);async function Ht(e){return(await we()).find(n=>n.id===e)}async function Gt(e){return e?(await He()).find(n=>n.id===e):null}async function xe(e){return e?(await Ge()).find(n=>n.id===e):null}async function Ke(e){const t=`knowledge:${e}`;if(q.has(t))return q.get(t);const n=await fetch(`${qe()}content/knowledge/${e}.md`);if(!n.ok)throw new Error(`Failed to load knowledge/${e}.md: ${n.status}`);const o=await n.text(),s=Rt(o);return q.set(t,s),s}function Rt(e){const t=e.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);if(!t)return{meta:{},body:e};const[,n,o]=t,s={};for(const a of n.split(`
`)){const l=a.match(/^(\w+):\s*(.*)$/);if(!l)continue;const[,f,d]=l;d.startsWith("[")&&d.endsWith("]")?s[f]=d.slice(1,-1).split(",").map(r=>r.trim()).filter(Boolean):s[f]=d.trim()}return{meta:s,body:o.trim()}}const Le={neutral:"#AAAAAA",orange:"#FF8800",yellow:"#FFEE00",red:"#FF0000"};function Xe(e,t){return e?.status?.[t]?.color??Le[t]??Le.neutral}function Wt(e,t){return e?.status?.[t]?.label??t}function C(e,t,{small:n=!1}={}){const o=Xe(e,t),s=Wt(e,t),a=n?"status-badge status-badge--small":"status-badge",l=t==="orange"||t==="yellow"||t==="red";return`<span class="${a}" style="--status-color:${o}" title="${i(s)}">
    <span class="status-badge__dot"></span>${l?'<span class="status-badge__warn">&#9650;</span>':""}
  </span>`}function Ve(){return'<a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge Base</a>'}function i(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Nt([e,t],[n,o]){const a=t*Math.PI/180,l=o*Math.PI/180,f=(o-t)*Math.PI/180,d=(n-e)*Math.PI/180,r=Math.sin(f/2)**2+Math.cos(a)*Math.cos(l)*Math.sin(d/2)**2;return 2*6371e3*Math.asin(Math.sqrt(r))}function z(e){const t=[0];for(let n=1;n<e.length;n++)t.push(t[n-1]+Nt(e[n-1],e[n]));return t}function En(e){const t=z(e);return t[t.length-1]??0}function Je(e,t){if(t.length<2)return null;const n=z(t);let o=null;for(let s=0;s<t.length-1;s++){const a=t[s],l=t[s+1],{t:f,pt:d,dist:r}=zt(e,a,l),m=n[s]+f*(n[s+1]-n[s]);(!o||r<o.distanceFrom)&&(o={distanceAlong:m,distanceFrom:r,pointOnLine:d,segmentIndex:s})}return o}function zt(e,t,n){const o=(t[1]+n[1])/2*(Math.PI/180),s=([P,g])=>[P*Math.cos(o)*111320,g*111320],[a,l]=s(e),[f,d]=s(t),[r,m]=s(n),h=r-f,y=m-d;let v=h===0&&y===0?0:((a-f)*h+(l-d)*y)/(h*h+y*y);v=Math.max(0,Math.min(1,v));const b=f+v*h,$=d+v*y,k=Math.hypot(a-b,l-$),T=[t[0]+v*(n[0]-t[0]),t[1]+v*(n[1]-t[1])];return{t:v,pt:T,dist:k}}function Dt(e,t){const n=z(e),o=n[n.length-1],s=Math.max(0,Math.min(o,t));for(let a=0;a<n.length-1;a++)if(s>=n[a]&&s<=n[a+1]){const l=n[a+1]-n[a],f=l===0?0:(s-n[a])/l,d=e[a],r=e[a+1];return[d[0]+f*(r[0]-d[0]),d[1]+f*(r[1]-d[1])]}return e[e.length-1]}function Ut(e,t){const n=z(e),o=n[n.length-1];if(t<=0)return{before:[],after:e};if(t>=o)return{before:e,after:[]};const s=Dt(e,t);let a=0;for(let d=0;d<n.length-1;d++)if(t>=n[d]&&t<=n[d+1]){a=d;break}const l=[...e.slice(0,a+1),s],f=[s,...e.slice(a+1)];return{before:l,after:f}}const Ye="lycian-2026-trail-progress-m",Kt=300;function ne(){try{const e=localStorage.getItem(Ye);return e?Number(e):0}catch{return 0}}function Xt(e){try{localStorage.setItem(Ye,String(e))}catch{}}function In(e,t){if(!e||t.length<2)return ne();const n=Je(e,t);if(!n||n.distanceFrom>Kt)return ne();const o=ne();return n.distanceAlong>o?(Xt(n.distanceAlong),n.distanceAlong):o}function Vt(e){const t={west:180,south:90,east:-180,north:-90};for(const[n,o]of e)t.west=Math.min(t.west,n),t.east=Math.max(t.east,n),t.south=Math.min(t.south,o),t.north=Math.max(t.north,o);return t}function Jt(e,[t,n],o,s,a){return[a+(t-e.west)/(e.east-e.west)*(o-2*a),a+(1-(n-e.south)/(e.north-e.south))*(s-2*a)]}function Ae(e,t,n=3){return e.length<2?"":`<path d="${e.map((s,a)=>`${a===0?"M":"L"}${s[0].toFixed(1)},${s[1].toFixed(1)}`).join(" ")}" fill="none" stroke="${t}" stroke-width="${n}" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`}function Yt(e,{config:t,places:n,master:o,waterList:s,gpsPosition:a}){const r=Vt(o.coords),m=g=>Jt(r,g,400,640,30),h=t.routeProgress?.untraveled??"#AAAAAA",y=t.routeProgress?.traveled??"#00FF80";let v=Ae(o.coords.map(m),h);const{before:b}=Ut(o.coords,ne());b.length>=2&&(v+=Ae(b.map(m),y));const $=([g,c])=>g>=r.west-.02&&g<=r.east+.02&&c>=r.south-.02&&c<=r.north+.02,k=n.filter(g=>$(g.coordinates)).map(g=>{const[c,L]=m(g.coordinates);return`<circle cx="${c}" cy="${L}" r="5" fill="${Xe(t,g.status)}" stroke="#0e1613" stroke-width="1.5"/>
      <text x="${c+8}" y="${L+4}" font-size="10" fill="#eef2ee">${i(g.name)}</text>`}).join(""),T=s.filter(g=>g.kind==="source").map(g=>{const[c,L]=m(g.coordinates);return`<circle cx="${c}" cy="${L}" r="3.5" fill="#00A3FF" stroke="#0e1613" stroke-width="1"/>`}).join(""),P=a&&$([a.lon,a.lat])?(()=>{const[g,c]=m([a.lon,a.lat]);return`<circle cx="${g}" cy="${c}" r="7" fill="${t.gps?.markerColor??"#1A73E8"}" opacity="0.9"/>`})():"";e.innerHTML=`
    <svg viewBox="0 0 400 640" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;background:#182420;">
      ${v}${T}${k}${P}
    </svg>
  `}let X=null,H=null;const me=new Set;let R=null,F=null,he=null,Ze=7e3;function Zt({updateIntervalSeconds:e}={}){e&&(Ze=e*1e3)}function Qe(e){return me.add(e),(R||F)&&e({position:R,error:F}),()=>me.delete(e)}function ge(){for(const e of me)e({position:R,error:F})}function Te(){he&&(R=he,F=null,ge()),H=null}function et(){if(X===null){if(F=null,!("geolocation"in navigator)){F={code:"unsupported",message:"Geolocation not supported in this browser."},ge();return}X=navigator.geolocation.watchPosition(e=>{he={lat:e.coords.latitude,lon:e.coords.longitude,accuracy:e.coords.accuracy,heading:typeof e.coords.heading=="number"&&!Number.isNaN(e.coords.heading)?e.coords.heading:null,timestamp:e.timestamp},R||Te(),H===null&&(H=setTimeout(Te,Ze))},e=>{F={code:e.code,message:e.message},ge()},{enableHighAccuracy:!0,maximumAge:5e3,timeout:15e3})}}function Qt(){X!==null&&(navigator.geolocation.clearWatch(X),X=null),H!==null&&(clearTimeout(H),H=null)}function pe(){return R}function oe(e){return String(e??"").replace(/[<>&'"]/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"})[t])}function Pe([e,t],n,o,s){return`  <wpt lat="${t}" lon="${e}"><name>${oe(n)}</name>${o?`<desc>${oe(o)}</desc>`:""}${s?`<sym>${s}</sym>`:""}</wpt>`}function en({trail:e,itinerary:t,routes:n,waterList:o,accommodation:s}){const a=new Map(t.map(r=>[r.id,r])),l=new Map(n.map(r=>[r.dayId,r])),f=[];for(const r of o){const m=r.kind==="source"?"Вода: источник":"Вода: купить",h=r.kind==="source"?"В октябре может быть сухим — не рассчитывать как на единственный":r.osmType??"";f.push(Pe(r.coordinates,`${m} — ${r.name}`,h,r.kind==="source"?"Drinking Water":"Shopping Center"))}for(const r of s){if(!r.coordinates||r.status==="red")continue;const m=[r.priceInfo,r.address,r.phone,r.checkIn&&`Check-in ${r.checkIn}`].filter(Boolean).join(" · ");f.push(Pe(r.coordinates,`Ночёвка: ${r.name}`,m,r.type==="hotel"?"Lodging":"Campground"))}const d=e.days.map(r=>{const m=a.get(r.dayId),h=l.get(r.dayId),y=`${m?.date??r.dayId} ${h?.name??`${r.from} → ${r.to}`}`,v=r.coordinates.map(([b,$,k])=>`      <trkpt lat="${$}" lon="${b}"><ele>${k}</ele></trkpt>`).join(`
`);return`  <trk><name>${oe(y)}</name><desc>${oe(`${r.distanceKm} km, +${r.ascentM}/-${r.descentM} m (по треку)`)}</desc><trkseg>
${v}
    </trkseg></trk>`});return`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Lycian Way 2026" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>Lycian Way 2026 — Ovacık → Xanthos</name><desc>Cleaned track (source: trekkingmania 2024 GPX), water and lodging points. Map data © OpenStreetMap contributors.</desc></metadata>
${f.join(`
`)}
${d.join(`
`)}
</gpx>`}function tn(e,t="lycian-way-2026.gpx"){const n=new Blob([e],{type:"application/gpx+xml"}),o=URL.createObjectURL(n),s=document.createElement("a");s.href=o,s.download=t,document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(o),1e3)}const se="lycian-2026-checklist-";function nn(e){try{const t=localStorage.getItem(se+e);return t?JSON.parse(t):null}catch{return null}}function V(e,t){try{localStorage.setItem(se+e,JSON.stringify(t))}catch{}}let ye=1;function on(e){try{return new Set(JSON.parse(localStorage.getItem(`${se}${e}-seeded`)??"null")??[])}catch{return null}}function Ee(e,t){try{localStorage.setItem(`${se}${e}-seeded`,JSON.stringify([...t]))}catch{}}function ae(e){const t=[...e.preTripTasks??[],...e.tasks??[]];let n=nn(e.id);if(!n)return n=t.map(a=>({id:`seed-${ye++}`,text:a,done:!1})),V(e.id,n),Ee(e.id,new Set(t)),n;const o=on(e.id)??new Set(n.map(a=>a.text)),s=t.filter(a=>!o.has(a)&&!n.some(l=>l.text===a));return s.length&&(n.push(...s.map(a=>({id:`seed-${Date.now()}-${ye++}`,text:a,done:!1}))),V(e.id,n)),t.forEach(a=>o.add(a)),Ee(e.id,o),n}function sn(e,t){const n=ae(e);return n.push({id:`custom-${Date.now()}-${ye++}`,text:t,done:!1}),V(e.id,n),n}function an(e,t){const n=ae(e),o=n.find(s=>s.id===t);return o&&(o.done=!o.done),V(e.id,n),n}function rn(e){const t=ae(e).filter(n=>!n.done);return V(e.id,t),t}function tt(e){const t=[],n=[],o=[];for(const a of e.days){const l=a.coordinates,f=t.length>0,d=f?t.length-1:0;for(let r=f?1:0;r<l.length;r++)t.push([l[r][0],l[r][1]]),n.push(l[r][2]);o.push({...a,startIdx:d,endIdx:t.length-1})}const s=z(t);for(const a of o)a.startM=s[a.startIdx],a.endM=s[a.endIdx];return{coords:t,ele:n,cum:s,days:o}}function ln(e,t){return e.days.find(n=>t>=n.startM-1&&t<=n.endM+1)??null}function $e(e,[t,n]){const o=Je([t,n],e.coords);return o?{alongM:o.distanceAlong,offTrailM:o.distanceFrom,point:o.pointOnLine,day:ln(e,o.distanceAlong)}:null}function nt(e,{pois:t,water:n,food:o}){const s=[],a=[],l=d=>a.some(r=>Math.abs(r[0]-d[0])<8e-4&&Math.abs(r[1]-d[1])<8e-4),f=d=>{const r=$e(e,d.coordinates);r&&(s.push({...d,alongM:r.alongM,offTrailM:r.offTrailM}),a.push(d.coordinates))};for(const d of n?.waterPoints??[])f({id:d.id,kind:"source",name:d.name,coordinates:d.coordinates,osmType:d.waterType,notes:d.notes,curated:!0});for(const d of o??[])d.coordinates&&f({id:d.id,kind:"buy",name:d.name,coordinates:d.coordinates,osmType:d.category,curated:!0});for(const d of t?.water??[])l(d.coordinates)||f(d);for(const d of t?.buy??[])l(d.coordinates)||f(d);return s.sort((d,r)=>d.alongM-r.alongM)}function Ie(e,t,n){return e.find(o=>o.alongM>t+20&&(!n||o.kind===n))??null}function W(e){const t=e/1e3;return t<10?t.toFixed(1).replace(".",","):String(Math.round(t))}function ue(e){return e<1e3?`${Math.round(e/10)*10} м`:`${W(e)} км`}function cn(e,{width:t=320,height:n=90,marks:o=[],color:s="#7fb3a3"}={}){if(!e||e.length<2)return"";const a=z(e.map(g=>[g[0],g[1]])),l=a.at(-1)||1,f=e.map(g=>g[2]),d=Math.min(...f),r=Math.max(...f),m=8,h=16,y=30,v=Math.max(20,r-d),b=g=>y+g/l*(t-y-4),$=g=>m+(1-(g-d)/v)*(n-m-h),k=e.map((g,c)=>`${c?"L":"M"}${b(a[c]).toFixed(1)},${$(g[2]).toFixed(1)}`).join(" "),T=`${k} L${b(l).toFixed(1)},${n-h} L${y},${n-h} Z`,P=o.map(g=>{const c=b(Math.max(0,Math.min(l,g.m)));return`<line x1="${c}" x2="${c}" y1="${m}" y2="${n-h}" stroke="${g.color??"#00A3FF"}" stroke-width="1.5" stroke-dasharray="2 2"/>`}).join("");return`<svg class="profile-svg" viewBox="0 0 ${t} ${n}" width="100%" role="img" aria-label="Профиль высот">
    <path d="${T}" fill="${s}" opacity="0.25"/>
    <path d="${k}" fill="none" stroke="${s}" stroke-width="1.6"/>
    ${P}
    <text x="2" y="${m+8}" font-size="9" fill="currentColor">${Math.round(r)} м</text>
    <text x="2" y="${n-h}" font-size="9" fill="currentColor">${Math.round(d)} м</text>
    <text x="${y}" y="${n-3}" font-size="9" fill="currentColor">0</text>
    <text x="${t-4}" y="${n-3}" font-size="9" fill="currentColor" text-anchor="end">${W(l)} км</text>
  </svg>`}const dn={place:"Waypoint",source:"Вода: источник",buy:"Вода: купить",food:"Food / resupply",sleep:"Sleep",transport:"Transport",attraction:"Place to see",hazard:"Watch out",fuel:"Gas",gpx:"Точка из GPX"},ot="lycian-2026-gps-on",pn=100,un=5e3;function fn(e,t){const n=new Date().toISOString().slice(0,10),o=t.trip.startDate,s=t.trip.endDate;return n<o?e[0]:n>s?e[e.length-1]:e.find(a=>a.date===n)??e[0]}function mn(e){return"orange"}function hn(){try{return localStorage.getItem(ot)==="1"}catch{return!1}}function gn(e){try{localStorage.setItem(ot,e?"1":"0")}catch{}}const yn=`
  <p><strong>Доступ к геолокации запрещён.</strong> Как включить:</p>
  <p><strong>iPhone (Safari или иконка на главном экране):</strong> Настройки → Конфиденциальность и безопасность → Службы геолокации → включить; ниже «Сайты Safari» → «При использовании». Затем в Safari: «аА» в адресной строке → Настройки веб-сайта → Геопозиция → Разрешить. Перезагрузите страницу.</p>
  <p><strong>Android (Chrome):</strong> опустите шторку и включите «Местоположение». В Chrome: ⋮ → Настройки → Настройки сайтов → Геоданные → разрешить для jlazdes.github.io (или значок замка слева от адреса → Разрешения → Геоданные). Перезагрузите страницу.</p>
  <p style="color:var(--text-dim);font-size:0.75rem;">GPS работает и без интернета — нужен только доступ к геолокации.</p>
`;async function $n(e){const[t,n,o,s,a,l,f,d,r,m,h,y,v]=await Promise.all([ve(),Ge(),He(),Re(),jt(),Ft(),Ne(),Ct(),We(),ze(),we(),De(),Ue()]);Zt(t.gps);const b=tt(y),$=nt(b,{pois:v,water:s,food:f}),k=new Map(n.map(p=>[p.id,p])),T=new Map(o.map(p=>[p.dayId,p])),P=new Map(h.map(p=>[p.id,p])),g=[];k.get("place-xanthos")&&k.get("place-kas")&&g.push({id:"transport-dolmus-xanthos-kas",coordinates:[k.get("place-xanthos").coordinates,k.get("place-kas").coordinates]});const c=fn(h,t),L=l.filter(p=>!p.affects?.routeIds?.length);e.innerHTML=`
    <div class="map-screen">
      <div id="map-canvas-wrap"></div>
      <div id="map-fallback-note" class="map-fallback-note" hidden></div>
      <div id="offtrail-banner" class="offtrail-banner" hidden></div>

      <div class="today-widget" id="today-widget">
        <button class="today-widget__header" id="today-widget-toggle">
          <span>${i(c.date)} &middot; Tasks</span>
          <span class="today-widget__chevron" id="today-widget-chevron">&#8964;</span>
        </button>
        <div class="today-widget__body" id="today-widget-body">
          ${L.length?`
            <div class="today-widget__alerts">
              ${L.map(p=>`<div>${C(t,p.status)} ${i(p.title)}</div>`).join("")}
            </div>
          `:""}
          <div class="today-widget__list" id="today-tasks-list"></div>
          <button class="today-widget__add" id="today-add-btn">+ Add item</button>
          <div class="today-widget__completed-header" id="today-completed-header" hidden>
            <span>Completed</span>
            <button id="today-clear-btn" title="Clear completed" aria-label="Clear completed">🗑</button>
          </div>
          <div class="today-widget__list today-widget__list--completed" id="today-completed-list"></div>
          <a href="#/itinerary/${c.id}" class="today-widget__full-day">Full day view &rarr;</a>
        </div>
      </div>

      <button class="map-round-btn" id="locate-btn" title="Где я" aria-label="Где я" aria-pressed="false">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 3h-2.07A7 7 0 0 0 13 5.07V3h-2v2.07A7 7 0 0 0 5.07 11H3v2h2.07A7 7 0 0 0 11 18.93V21h2v-2.07A7 7 0 0 0 18.93 13H21v-2Zm-9 6a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/></svg>
      </button>

      <div id="gps-panel" class="gps-panel" hidden></div>

      <button class="map-fab map-fab--demo" id="demo-btn">▶ Play Demo</button>
      <button class="map-fab map-fab--stop-demo" id="demo-stop-btn" hidden>✕ End Demo</button>
      <button class="map-fab map-fab--water" id="water-only-btn" aria-pressed="false">💧 Только вода</button>
      <button class="map-fab map-fab--gpx" id="gpx-btn" title="Скачать GPX" aria-label="Скачать GPX">GPX</button>

      <div id="poi-panel" class="poi-panel" hidden>
        <button class="poi-panel__close" id="poi-close-btn" aria-label="Close">&times;</button>
        <div id="poi-panel-body"></div>
      </div>
    </div>
  `;const rt=e.querySelector("#today-tasks-list"),it=e.querySelector("#today-completed-list"),lt=e.querySelector("#today-completed-header");function J(){const p=ae(c),u=p.filter(w=>!w.done),M=p.filter(w=>w.done);rt.innerHTML=u.map(w=>`
      <label class="today-widget__item">
        <input type="checkbox" data-id="${w.id}" />
        <span>${i(w.text)}</span>
      </label>
    `).join("")||'<p class="empty-state" style="padding:6px 0;">Nothing left — nice.</p>',lt.hidden=M.length===0,it.innerHTML=M.map(w=>`
      <label class="today-widget__item today-widget__item--done">
        <input type="checkbox" data-id="${w.id}" checked />
        <span>${i(w.text)}</span>
      </label>
    `).join(""),e.querySelectorAll("#today-tasks-list input, #today-completed-list input").forEach(w=>{w.addEventListener("change",()=>{an(c,w.dataset.id),J()})})}J(),e.querySelector("#today-add-btn").addEventListener("click",()=>{const p=prompt("Add a task");p&&p.trim()&&(sn(c,p.trim()),J())}),e.querySelector("#today-clear-btn").addEventListener("click",()=>{rn(c),J()});const ct=e.querySelector("#today-widget-toggle"),be=e.querySelector("#today-widget-body"),dt=e.querySelector("#today-widget-chevron");ct.addEventListener("click",()=>{const p=be.hidden=!be.hidden;dt.style.transform=p?"rotate(-90deg)":"rotate(0deg)"});const re=e.querySelector("#map-canvas-wrap"),O=e.querySelector("#map-fallback-note"),D=e.querySelector("#demo-btn"),Y=e.querySelector("#demo-stop-btn"),Me=e.querySelector("#poi-panel"),pt=e.querySelector("#poi-panel-body"),ut=e.querySelector("#poi-close-btn");function ft(p){const u=$e(b,p);if(!u||u.offTrailM>3e3)return"";const M=u.day;return`<p class="poi-panel__meta">${M?`${i(P.get(M.dayId)?.date??"")}: ${W(u.alongM-M.startM)} км от старта дня`:""}${u.offTrailM>30?` &middot; ${Math.round(u.offTrailM)} м от тропы`:" &middot; на тропе"}</p>`}function mt(p,u){const[M,w]=p;return`<div class="link-row">
      <a class="btn" target="_blank" rel="noopener" href="${u??`https://www.google.com/maps/search/?api=1&query=${w},${M}`}">Google Maps</a>
      <a class="btn btn-secondary" href="om://map?ll=${w},${M}&n=1">Organic Maps</a>
      <a class="btn btn-secondary" href="mapsme://map?ll=${w},${M}&n=1">maps.me</a>
    </div>`}async function ht({kind:p,data:u}){const M=u.coordinates??null;let w=u.status,S="";if(p==="source")w=u.curated?mn():"orange",S=`
        <p class="poi-panel__category">${i(u.osmType??"spring")}${u.osm?` &middot; <a href="https://www.openstreetmap.org/${u.osm}" target="_blank" rel="noopener">OSM</a>`:""}</p>
        <p class="poi-warning">В октябре может быть сухим, не рассчитывать как на единственный.</p>
        ${u.notes?`<p>${i(u.notes)}</p>`:""}`;else if(p==="buy")w="neutral",S=`<p class="poi-panel__category">${i(u.osmType??"")}${u.osm?` &middot; <a href="https://www.openstreetmap.org/${u.osm}" target="_blank" rel="noopener">OSM</a>`:""}</p>
        <p>Купить воду — надёжно (магазин / кафе). Часы работы не проверены.</p>`;else if(p==="food")S=`<p class="poi-panel__category">${i(u.category??"food")}</p>`;else if(p==="fuel")S=`<p class="poi-panel__category">gas &middot; stock of EN417 canisters ${u.canisterStockConfirmed?"confirmed":"not confirmed"}</p>`;else if(p==="sleep")S=`<p class="poi-panel__category">${i(u.type??"camp")}${u.booked?" &middot; <strong>забронировано</strong>":""}</p>
        ${u.address?`<p>${i(u.address)}</p>`:""}
        ${u.phone?`<p><a href="tel:${u.phone.replace(/\s/g,"")}">${i(u.phone)}</a></p>`:""}
        ${u.checkIn?`<p>Заезд: ${i(u.checkIn)}<br>Выезд: ${i(u.checkOut??"")}</p>`:""}
        <p>${i(u.priceInfo??"")}</p>`;else if(p==="transport"){const _=u.details?.segments??(u.details?.flightNo?[u.details]:[]);S=`<p class="poi-panel__category">${i(u.mode??"transport")}${u.date?` &middot; ${i(u.date)}`:""}</p>
        ${_.map(E=>`<p><strong>${i(E.flightNo)}</strong> ${i(E.from)} ${i(E.depart)} → ${i(E.to)} ${i(E.arrive)}</p>`).join("")}`}else if(p==="attraction"){const _=u.category==="ruins"?'<a href="#/knowledge/ancient-lycia">More on Ancient Lycia &rarr;</a>':"";S=`<p class="poi-panel__category">${i(u.category)}</p><p>${i(u.shortDescription??"")}</p>${_?`<p>${_}</p>`:""}`}else p==="hazard"?S='<p><a href="#/knowledge/route-decisions">More on route decisions &rarr;</a> &middot; <a href="#/knowledge/safety">Safety notes &rarr;</a></p>':p==="gpx"&&(w="neutral",S=`<p class="poi-panel__category">${i(u.categoryLabel)}</p><p style="color:var(--text-dim);font-size:0.75rem;">Из GPX trekkingmania (2024) — может быть устаревшим.</p>`);const te=await Promise.all((u.sources??[]).map(_=>qt(_))),B=M??k.get(u.placeId)?.coordinates;pt.innerHTML=`
      <div class="pill-row">${C(t,w??"neutral")}<span class="pill">${i(dn[p]??p)}</span></div>
      <h3>${i(u.name)}</h3>
      ${B?ft(B):""}
      ${S}
      ${u.notes&&p!=="source"?`<p>${i(u.notes)}</p>`:""}
      ${u.confidence?`<p style="font-size:0.75rem;color:var(--text-dim);">Confidence: ${i(u.confidence)}${u.lastVerified?` &middot; last verified ${i(u.lastVerified)}`:""}</p>`:""}
      ${te.filter(Boolean).length?`<div class="section-title">Sources</div>${te.filter(Boolean).map(_=>_.url?`<p><a href="${_.url}" target="_blank" rel="noopener">${i(_.title)}</a></p>`:`<p>${i(_.title)}</p>`).join("")}`:""}
      ${B?mt(B,u.googleMapsUrl):""}
    `,Me.hidden=!1}function ke(){Me.hidden=!0}ut.addEventListener("click",ke);function gt(){O.textContent="Упрощённая схема — карта не запустилась на этом устройстве.",O.hidden=!1,Yt(re,{config:t,places:n,master:b,waterList:$,gpsPosition:pe()})}let A=null;try{const{mountMapLibre:p}=await It(async()=>{const{mountMapLibre:u}=await import("./map-BksrU8qH.js");return{mountMapLibre:u}},[]);re.innerHTML='<div id="maplibre-container" style="width:100%;height:100%;"></div>',A=await p(re.querySelector("#maplibre-container"),{config:t,places:n,routes:o,food:f,fuel:d,accommodation:r,transport:m,attractions:a,master:b,waterList:$,pois:v,transportLines:g}),A.setOnPoiClick(ht),A.mode==="offline-map"?(O.textContent="Офлайн: карта коридора ±2 км",O.hidden=!1):A.mode==="offline-blank"&&(O.innerHTML='Офлайн — подложка не скачана. Трек и точки работают. <a href="#/knowledge">Скачать карту</a>',O.hidden=!1)}catch(p){console.warn("MapLibre failed to load, falling back to the SVG corridor view",p),gt()}const ie=e.querySelector("#locate-btn"),I=e.querySelector("#gps-panel"),U=e.querySelector("#offtrail-banner");let Z=!1,le=!1;function ce(p,u){if(!Z){I.hidden=!0,U.hidden=!0;return}if(I.hidden=!1,u&&!p){u.code===1?I.innerHTML=`<button class="gps-panel__close" aria-label="Закрыть">&times;</button>${yn}`:I.innerHTML=`<button class="gps-panel__close" aria-label="Закрыть">&times;</button><p>Не удаётся определить местоположение: ${i(u.message)}. Выйдите на открытое место и подождите.</p>`,I.querySelector(".gps-panel__close").addEventListener("click",()=>Q(!1)),U.hidden=!0;return}if(!p){I.innerHTML="<p>Ищем GPS…</p>";return}const M=$e(b,[p.lon,p.lat]),w=`±${Math.round(p.accuracy??0)} м`;if(!M||M.offTrailM>un){U.hidden=!0,I.innerHTML=`<p><strong>Вы далеко от маршрута</strong> — ${W(M?.offTrailM??0)} км до тропы. <span class="gps-panel__acc">${w}</span></p>`;return}U.hidden=M.offTrailM<=pn,U.textContent=`Вы в ${Math.round(M.offTrailM)} м от тропы`;const S=M.day??b.days.at(-1),te=Math.max(0,S.endM-M.alongM),B=T.get(S.dayId),_=Ie($,M.alongM,"source"),E=Ie($,M.alongM,"buy");I.innerHTML=`
      <div class="gps-panel__row"><span>До финиша дня${B?` (${i(S.to)})`:""}</span><strong>${ue(te)}</strong></div>
      <div class="gps-panel__row"><span>💧 Источник впереди${_?` — ${i(_.name)}`:""}</span><strong>${_?ue(_.alongM-M.alongM):"—"}</strong></div>
      <div class="gps-panel__row"><span>🛒 Купить воду${E?` — ${i(E.name)}`:""}</span><strong>${E?ue(E.alongM-M.alongM):"—"}</strong></div>
      <div class="gps-panel__foot">по тропе &middot; точность ${w}</div>
    `}function Q(p){Z=p,gn(p),ie.classList.toggle("map-round-btn--active",p),ie.setAttribute("aria-pressed",String(p)),p?(le=!1,et(),ce(pe(),null)):(Qt(),ce(null,null))}ie.addEventListener("click",()=>{if(!Z){Q(!0);return}const p=pe();p&&A?A.flyTo([p.lon,p.lat]):Q(!1)}),Qe(({position:p,error:u})=>{Z&&(p&&A&&(A.setGpsPosition(p),le||(le=!0,A.flyTo([p.lon,p.lat],14))),ce(p,u))}),hn()&&Q(!0);const ee=e.querySelector("#water-only-btn");ee.addEventListener("click",()=>{const p=ee.getAttribute("aria-pressed")!=="true";ee.setAttribute("aria-pressed",String(p)),ee.classList.toggle("map-fab--active",p),A?.setWaterOnly(p)}),e.querySelector("#gpx-btn").addEventListener("click",()=>{tn(en({trail:y,itinerary:h,routes:o,waterList:$,accommodation:r}))}),A?(D.addEventListener("click",()=>{ke(),D.hidden=!0,Y.hidden=!1,A.playDemo(()=>{D.hidden=!1,Y.hidden=!0})}),Y.addEventListener("click",()=>{A.stopDemo(),D.hidden=!1,Y.hidden=!0})):D.hidden=!0}const Ce=.15;function Fe(e,t){return!e&&!t?"":` <a href="${t??`https://www.google.com/maps/search/?api=1&query=${e[1]},${e[0]}`}" target="_blank" rel="noopener">карта&nbsp;↗</a>`}function vn(e,t,n,o,s,a){const l=t.allTrails,f=t.metrics.find($=>$.source==="user_itinerary"),d=l?.distanceKm??f?.distanceKm,r=l?.ascentM??f?.ascentM,m=l?"AllTrails":"план",h=($,k)=>$&&k?Math.abs($-k)/k:0,y=s&&h(s.distanceKm,d)>Ce,v=s&&r&&h(s.ascentM,r)>Ce,b=a.map($=>({m:$.alongM-s.startM,color:$.kind==="source"?"#00A3FF":"#2EC4B6"}));return`
    <div class="card">
      <h3>Route</h3>
      <p>${n?i(n.name):"?"} &rarr; ${o?i(o.name):"?"}</p>
      <div class="metric-grid">
        <div class="metric"><div class="metric__value">${String(d??"—").replace(".",",")} км</div><div class="metric__label">${m}</div></div>
        <div class="metric"><div class="metric__value">${r!=null?`+${r} м`:"—"}</div><div class="metric__label">набор, ${m}</div></div>
      </div>
      ${l?.links?.length?`<p>${l.links.map(($,k)=>`<a href="${$}" target="_blank" rel="noopener">AllTrails${l.links.length>1?` ${k+1}`:""}&nbsp;↗</a>`).join(" &middot; ")}</p>`:""}
      ${s?`
        <p style="font-size:0.75rem;">По нашему треку: ${W(s.distanceKm*1e3)} км, +${s.ascentM} / −${s.descentM} м, ${s.minEleM}–${s.maxEleM} м над уровнем моря${y||v?" — <strong>расходится с AllTrails больше чем на 15%, ориентируйтесь на AllTrails</strong>":""}.</p>
        ${cn(s.coordinates,{marks:b})}
        <p style="font-size:0.7rem;">Метки на профиле: <span style="color:#00A3FF">источники</span>, <span style="color:#2EC4B6">купить воду</span>.</p>
      `:""}
      ${t.variants?.length?t.variants.map($=>`
        <p>${C(e,$.status)} <strong>${i($.name)}</strong> — ${i($.notes)}</p>
      `).join(""):""}
      ${t.notes?`<p><em>${i(t.notes)}</em></p>`:""}
    </div>`}function wn(e,t){return t?e.length?`
    <div class="section-title">Вода на участке</div>
    <div class="card">
      <ul class="water-list">
        ${e.map(n=>`
          <li>
            <span class="water-list__km">${W(Math.max(0,n.alongM-t.startM))} км</span>
            <span class="water-list__name">${n.kind==="source"?"💧":"🛒"} ${i(n.name)}${n.kind==="source"?' <span style="color:var(--status-orange);font-size:0.72rem;">(может быть сухим)</span>':""}</span>
            <span class="water-list__off">${n.offTrailM>40?`${Math.round(n.offTrailM)} м от тропы`:"на тропе"}</span>
          </li>`).join("")}
      </ul>
      <p style="font-size:0.72rem;">💧 источник — в октябре может быть сухим, не рассчитывать как на единственный. 🛒 купить — магазин/кафе (надёжно, часы не проверены). Расстояние — от старта дня по тропе.</p>
    </div>`:'<div class="section-title">Вода на участке</div><div class="card"><p>Точек воды на участке не найдено — несите запас на весь день.</p></div>':""}async function bn(e){const[t,n]=await Promise.all([ve(),we()]);e.innerHTML=`
    <div class="screen-pad">
      ${Ve()}
      <div class="section-title">Itinerary</div>
      ${n.map(o=>`
        <a href="#/itinerary/${o.id}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <div class="pill-row"><span class="pill">${i(o.date)}</span>${C(t,o.status)}</div>
          <h3>${i(o.title)}</h3>
          <p>${i(o.summary)}</p>
        </a>
      `).join("")}
    </div>
  `}async function Mn(e,{dayId:t}){const[n,o]=await Promise.all([ve(),Ht(t)]);if(!o){e.innerHTML='<div class="screen-pad"><p>Day not found.</p></div>';return}const[s,a,l,f,d]=await Promise.all([Gt(o.routeId),Promise.resolve(o.accommodationIds??[]),Ne(),Re(),ze()]),r=(await We()).filter(c=>o.accommodationIds?.includes(c.id)),[m,h]=await Promise.all([De(),Ue()]),y=tt(m),v=y.days.find(c=>c.dayId===o.id)??null,b=v?nt(y,{pois:h,water:f,food:l}).filter(c=>c.alongM>=v.startM-50&&c.alongM<=v.endM+50&&c.offTrailM<=1e3):[],$=l.filter(c=>o.foodIds?.includes(c.id)),k=f.waterPoints.filter(c=>o.waterIds?.includes(c.id)),T=d.filter(c=>o.transportIds?.includes(c.id));let P=null,g=null;s&&([P,g]=await Promise.all([xe(s.fromPlaceId),xe(s.toPlaceId)])),e.innerHTML=`
    <div class="screen-pad">
      <a href="#/itinerary" class="btn-secondary btn" style="margin-bottom:12px;display:inline-block;">&larr; All days</a>
      <div class="pill-row"><span class="pill">${i(o.date)}</span>${C(n,o.status)}</div>
      <h2 style="margin:6px 0;">${i(o.title)}</h2>
      <p>${i(o.summary)}</p>

      ${s?vn(n,s,P,g,v,b):""}
      ${wn(b,v)}

      ${o.tasks?.length?`<div class="section-title">Tasks</div><div class="card"><ul>${o.tasks.map(c=>`<li>${i(c)}</li>`).join("")}</ul></div>`:""}
      ${o.preTripTasks?.length?`<div class="section-title">Pre-trip tasks</div><div class="card"><ul>${o.preTripTasks.map(c=>`<li>${i(c)}</li>`).join("")}</ul></div>`:""}

      ${k.length?`<div class="section-title">Water</div>${k.map(c=>`
        <div class="card"><h3>${i(c.name)}</h3><p>${i(c.waterType)} &middot; ${i(c.status)} &middot; ${i(c.treatment)}</p><p>${i(c.notes)}</p></div>
      `).join("")}`:""}

      ${$.length?`<div class="section-title">Food</div>${$.map(c=>`
        <div class="card">${C(n,c.status)} <strong>${i(c.name)}</strong>${Fe(c.coordinates,c.googleMapsUrl)} <p>${i(c.notes)}</p></div>
      `).join("")}`:""}

      ${r.length?`<div class="section-title">Sleep</div>${r.map(c=>`
        <div class="card">${C(n,c.status)} <strong>${i(c.name)}</strong>${c.booked?' <span class="pill">забронировано</span>':""}${Fe(c.coordinates,c.googleMapsUrl)}
          ${c.address?`<p>${i(c.address)}</p>`:""}
          ${c.phone?`<p><a href="tel:${c.phone.replace(/\s/g,"")}">${i(c.phone)}</a></p>`:""}
          ${c.checkIn?`<p>Заезд: ${i(c.checkIn)} &middot; Выезд: ${i(c.checkOut??"")}</p>`:""}
          <p>${i(c.priceInfo)}</p><p>${i(c.notes)}</p></div>
      `).join("")}`:""}

      ${T.length?`<div class="section-title">Transport</div>${T.map(c=>`
        <div class="card">${C(n,c.status)} <strong>${i(c.name)}</strong>
          ${(c.details?.segments??(c.details?.flightNo?[c.details]:[])).map(L=>`<p><strong>${i(L.flightNo)}</strong> ${i(L.from)} ${i(L.depart)} → ${i(L.to)} ${i(L.arrive)}</p>`).join("")}
          <p>${i(c.notes)}</p></div>
      `).join("")}`:""}

      ${o.highlights?.length?`<div class="section-title">Highlights</div><div class="card"><ul>${o.highlights.map(c=>`<li>${i(c)}</li>`).join("")}</ul></div>`:""}
      ${o.watchOut?.length?`<div class="section-title">Watch out</div><ul class="warn-list">${o.watchOut.map(c=>`<li>${i(c)}</li>`).join("")}</ul>`:""}
      ${o.backupPlan?`<div class="section-title">Backup plan</div><div class="card">${i(o.backupPlan)}</div>`:""}
      ${o.notes?`<p style="color:var(--text-dim);font-size:0.8rem;">${i(o.notes)}</p>`:""}
    </div>
  `}const kn=[["#/itinerary","Itinerary","Day-by-day plan, 8–18 Oct"],["#/emergency","Emergency","112, GPS, bailout info"]],_n=["before-we-leave","turkish-phrases","hiker-reports"];async function st(e){const[t,n,o,s]=await Promise.all([Mt(),kt(),je(),Promise.all(_n.map(r=>Ke(r).then(m=>[r,m])))]);e.innerHTML=`
    <div class="screen-pad">
      <div class="section-title">Save for offline</div>
      <div class="card">
        <p id="offline-status">${t?"Trip data is saved for offline use.":"Trip data is not yet saved for offline use."}</p>
        <p style="font-size:0.75rem;">Трек по дням, все маркеры, карточки дней, профили высот и статьи сохраняются автоматически после первого открытия онлайн. Кнопка ниже обновляет их вручную.</p>
        <button class="btn" id="save-offline-btn">Save for offline</button>
      </div>

      <div class="card">
        <h3>Карта маршрута офлайн</h3>
        <p>Подложка для коридора ±2 км вокруг тропы (Ovacık → Xanthos) + Ölüdeniz, Gelemiş, Kaş. Зумы до 15 — видны тропинки, сёла и дороги. Источник: OpenStreetMap / Protomaps, хранится на нашем сайте.</p>
        <p id="map-offline-status">${n?"✓ Карта скачана — работает без интернета.":o?`Размер загрузки: <strong>${de(o.totalBytes)}</strong> (${o.files.length} файлов).`:"Нужен интернет, чтобы узнать размер и скачать."}</p>
        <div class="progress" id="map-progress" hidden><div class="progress__bar" id="map-progress-bar"></div></div>
        <div class="link-row">
          <button class="btn" id="map-download-btn" ${o?"":"disabled"}>${n?"Обновить карту":"Скачать карту маршрута"}</button>
          ${n?'<button class="btn btn-secondary" id="map-delete-btn">Удалить</button>':""}
        </div>
        <p style="font-size:0.72rem;">Спутник и онлайн-карта вне коридора требуют интернета.</p>
      </div>

      <div class="card">
        <h3>Добавить на главный экран</h3>
        <p><strong>iPhone, Safari:</strong></p>
        <ol class="install-steps">
          <li>Откройте сайт в Safari (не в Chrome/Telegram).</li>
          <li>Нажмите «Поделиться» (квадрат со стрелкой вверх).</li>
          <li>«На экран «Домой»» → «Добавить».</li>
          <li>Откройте приложение с иконки один раз при интернете — после этого оно работает офлайн.</li>
        </ol>
        <p><strong>Android, Chrome:</strong></p>
        <ol class="install-steps">
          <li>Откройте сайт в Chrome.</li>
          <li>⋮ (меню справа сверху) → «Добавить на гл. экран» или «Установить приложение».</li>
          <li>Подтвердите «Установить».</li>
          <li>Откройте с иконки один раз при интернете.</li>
        </ol>
        <p style="font-size:0.72rem;">Важно: на iPhone данные иконки на главном экране и вкладки Safari хранятся отдельно — скачайте карту именно в том, чем будете пользоваться в походе.</p>
      </div>

      <div class="section-title">Trip</div>
      ${kn.map(([r,m,h])=>`
        <a href="${r}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${i(m)}</h3>
          <p>${i(h)}</p>
        </a>
      `).join("")}

      <div class="section-title">Field guide</div>
      <p style="color:var(--text-dim);font-size:0.78rem;margin-top:-4px;">Water, food, sleep, transport, safety, and places to see now live as markers on the Map tab — tap a pin for details.</p>
      ${s.map(([r,m])=>`
        <a href="#/knowledge/${r}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${i(m.meta.title??r)}</h3>
          <p>Confidence: ${i(m.meta.confidence??"?")} &middot; last verified ${i(m.meta.lastVerified??"?")}</p>
        </a>
      `).join("")}
    </div>
  `;const a=e.querySelector("#map-download-btn"),l=e.querySelector("#map-offline-status"),f=e.querySelector("#map-progress"),d=e.querySelector("#map-progress-bar");a.addEventListener("click",async()=>{if(o){a.disabled=!0,f.hidden=!1;try{await _t((r,m)=>{const h=Math.min(100,Math.round(r/m*100));d.style.width=`${h}%`,l.textContent=`Загрузка: ${de(r)} из ${de(m)} (${h}%)`}),d.style.width="100%",l.textContent="✓ Карта скачана — работает без интернета.",a.textContent="Обновить карту"}catch(r){console.warn(r),l.textContent=`Не получилось: ${r.message}. Проверьте интернет и попробуйте ещё раз.`}finally{a.disabled=!1}}}),e.querySelector("#map-delete-btn")?.addEventListener("click",async()=>{await St(),st(e)}),e.querySelector("#save-offline-btn").addEventListener("click",async r=>{const m=r.currentTarget;m.disabled=!0,m.textContent="Saving…";try{await bt((h,y)=>m.textContent=`Saving ${h}/${y}…`),e.querySelector("#offline-status").textContent="Trip data saved for offline use.",m.textContent="Saved"}catch(h){m.textContent="Save failed — retry",m.disabled=!1,console.error(h)}})}function Sn(e){const t=e.split(`
`);let n="",o=0;for(;o<t.length;){const s=t[o];if(/^\s*$/.test(s)){o++;continue}if(s.startsWith("# ")){n+=`<h2>${K(s.slice(2))}</h2>`,o++;continue}if(s.startsWith("## ")){n+=`<h3>${K(s.slice(3))}</h3>`,o++;continue}if(s.startsWith("**")&&s.match(/^\*\*.+\*\*/),s.startsWith("|")){const l=[];for(;o<t.length&&t[o].startsWith("|");)l.push(t[o]),o++;n+=xn(l);continue}if(s.startsWith("- ")){const l=[];for(;o<t.length&&t[o].startsWith("- ");)l.push(t[o].slice(2)),o++;n+=`<ul>${l.map(f=>`<li>${K(f)}</li>`).join("")}</ul>`;continue}const a=[];for(;o<t.length&&!/^\s*$/.test(t[o])&&!t[o].startsWith("|")&&!t[o].startsWith("- ")&&!t[o].startsWith("#");)a.push(t[o]),o++;n+=`<p>${K(a.join(" "))}</p>`}return n}function xn(e){e.filter(a=>!/^\|[\s-]+\|$/.test((a.replace(/[^|\s-]/g,""),a)));const n=e.filter(a=>!/^\|(\s*-+\s*\|)+$/.test(a)).map(a=>a.split("|").slice(1,-1).map(l=>l.trim()));if(!n.length)return"";const[o,...s]=n;return`<table class="phrases">
    <tbody>
      ${s.map(a=>`<tr>${a.map(l=>`<td>${K(l)}</td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>`}function K(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\[(.+?)\]\((.+?)\)/g,(t,n,o)=>{const s=o.endsWith(".md");return`<a href="${s?`#/knowledge/${o.replace(/\.md$/,"")}`:o}"${s?"":' target="_blank" rel="noopener"'}>${n}</a>`})}async function Ln(e,{slug:t}){const n=await Ke(t);e.innerHTML=`
    <div class="screen-pad">
      <a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge base</a>
      <h2>${i(n.meta.title??t)}</h2>
      <p style="color:var(--text-dim);font-size:0.8rem;">Confidence: ${i(n.meta.confidence??"?")} &middot; last verified ${i(n.meta.lastVerified??"?")}</p>
      <div class="card">${Sn(n.body)}</div>
    </div>
  `}async function An(e){e.innerHTML=`
    <div class="screen-pad">
      ${Ve()}
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
  `;const t=e.querySelector("#emergency-gps");Qe(({position:n,error:o})=>{n?t.innerHTML=`
        <p>${n.lat.toFixed(5)}, ${n.lon.toFixed(5)}</p>
        <p>Accuracy: ±${Math.round(n.accuracy)} m</p>
        <div class="link-row">
          <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${n.lat},${n.lon}">Open in Google Maps</a>
        </div>
      `:o&&(t.innerHTML=`<p>${i(o.message)}</p>`)}),et()}document.getElementById("app").innerHTML=`
  <header class="app-header">
    <div class="app-header__brand">Lycian Way 2026</div>
    <div class="segmented" role="tablist">
      <button class="segmented__btn" data-view="map" role="tab">Map</button>
      <button class="segmented__btn" data-view="kb" role="tab">Knowledge Base</button>
    </div>
  </header>
  <div id="screen"></div>
`;N("#/map",$n);N("#/itinerary",bn);N("#/itinerary/:dayId",Mn);N("#/knowledge",st);N("#/knowledge/:slug",Ln);N("#/emergency",An);const at=document.querySelectorAll(".segmented__btn");at.forEach(e=>{e.addEventListener("click",()=>{location.hash=e.dataset.view==="map"?"#/map":"#/knowledge"})});Lt(e=>{const t=e==="#/map"||e==="";document.getElementById("screen").classList.toggle("screen--full-bleed",t),at.forEach(n=>n.classList.toggle("segmented__btn--active",n.dataset.view==="map"===t))});yt();Tt();export{It as _,Tn as a,Ut as b,ne as g,Pn as o,Dt as p,Xe as s,En as t,In as u};
//# sourceMappingURL=index-DO8aBPhl.js.map
