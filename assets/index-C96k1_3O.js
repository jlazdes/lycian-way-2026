(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const _e="lycian-2026-v2",N="lycian-map-v1";function Bt(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/lycian-way-2026/sw.js").catch(e=>console.warn("SW registration failed",e))})}const Ot=["config","trip","itinerary","routes","places","water","accommodation","food","fuel","transport","alerts","attractions","sources","changelog","trail","pois"],Ht=["before-we-leave","water","food","fuel","sleep","transport","route-decisions","safety","ancient-lycia","turkish-phrases","hiker-reports"];function Gt(){const e=new Set;return document.querySelectorAll("script[src]").forEach(t=>e.add(t.src)),document.querySelectorAll('link[rel="stylesheet"], link[rel="modulepreload"]').forEach(t=>e.add(t.href)),document.querySelectorAll('link[rel="icon"], link[rel="manifest"]').forEach(t=>e.add(t.href)),[...e].filter(t=>t.startsWith(location.origin))}async function Wt(e){if(!("caches"in window))throw new Error("Cache API not supported in this browser.");const t="/lycian-way-2026/",n=[location.origin+t,`${t}index.html`,`${t}manifest.webmanifest`,`${t}vendor/maplibre-gl-worker.mjs`,`${t}vendor/maplibre-gl-shared.mjs`,...Gt(),...Ot.map(o=>`${t}data/${o}.json`),...Ht.map(o=>`${t}content/knowledge/${o}.md`)];navigator.serviceWorker?.controller?.postMessage({type:"precache"});const s=await caches.open(_e);let a=0;for(const o of n){try{const c=await fetch(o,{cache:"reload"});c.ok&&await s.put(o,c)}catch(c){console.warn(`Could not cache ${o}`,c)}a+=1,e?.(a,n.length)}return{cached:a,total:n.length}}async function Rt(){return!("caches"in window)||!await caches.has(_e)?!1:!!await(await caches.open(_e)).match("/lycian-way-2026/data/trail.json")}function Z(e){return`${location.origin}/lycian-way-2026/offline/${e.split("/").map(encodeURIComponent).join("/")}`}async function Ye(){const e=Z("manifest.json");try{const t=await fetch(e,{cache:"no-cache"});if(t.ok)return await t.json()}catch{}if("caches"in window){const t=await(await caches.open(N)).match(e);if(t)return t.json()}return null}async function Nt(){if(!("caches"in window)||!await caches.has(N))return!1;const e=await caches.open(N),t=await e.match(Z("manifest.json"));if(!t)return!1;const{files:n}=await t.json();for(const s of n)if(!await e.match(Z(s.path)))return!1;return!0}async function zt(e){if(!("caches"in window))throw new Error("Этот браузер не поддерживает офлайн-кэш.");const t=await Ye();if(!t)throw new Error("Не удалось получить список файлов карты — нужен интернет.");const n=await caches.open(N);let s=0;for(const a of t.files){const o=Z(a.path),c=await fetch(o,{cache:"no-cache"});if(!c.ok||!c.body)throw new Error(`Ошибка загрузки ${a.path}: ${c.status}`);const f=c.body.getReader(),u=[];let r=0;for(;;){const{done:m,value:h}=await f.read();if(m)break;u.push(h),r+=h.length,e?.(s+r,t.totalBytes)}s+=a.bytes,await n.put(o,new Response(new Blob(u),{headers:{"Content-Type":c.headers.get("Content-Type")??"application/octet-stream"}})),e?.(s,t.totalBytes)}return await n.put(Z("manifest.json"),new Response(JSON.stringify(t),{headers:{"Content-Type":"application/json"}})),t}async function Dt(){"caches"in window&&await caches.delete(N)}async function Zn(){if(!("caches"in window)||!await caches.has(N))return null;const e=await(await caches.open(N)).match(Z("corridor.pmtiles"));return e?new File([await e.blob()],"corridor.pmtiles"):null}function Jn(){return`${location.origin}/lycian-way-2026/offline/`}function ke(e){return e<1024*1024?`${Math.round(e/1024)} КБ`:`${(e/1024/1024).toFixed(1).replace(".",",")} МБ`}const Qe=[];let et=null;const Ut="#/map";function Y(e,t){const n=[],s=e.replace(/:([\w]+)/g,(o,c)=>(n.push(c),"([^/]+)")),a=new RegExp(`^${s}$`);Qe.push({regex:a,paramNames:n,render:t})}function Kt(e){et=e}function Xt(e){for(const t of Qe){const n=e.match(t.regex);if(n){const s={};return t.paramNames.forEach((a,o)=>s[a]=decodeURIComponent(n[o+1])),{render:t.render,params:s}}}return null}async function We(){const e=document.getElementById("screen"),t=location.hash||Ut,n=Xt(t);if(et?.(t),!n){e.innerHTML='<div class="screen-pad"><p>Not found.</p></div>';return}try{await n.render(e,n.params)}catch(s){console.error(s),e.innerHTML='<div class="screen-pad"><p>Something went wrong loading this screen.</p></div>'}}function Vt(){window.addEventListener("hashchange",We),We()}const Zt="modulepreload",Jt=function(e){return"/lycian-way-2026/"+e},Re={},Yt=function(t,n,s){let a=Promise.resolve();if(n&&n.length>0){let c=function(r){return Promise.all(r.map(m=>Promise.resolve(m).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const f=document.querySelector("meta[property=csp-nonce]"),u=f?.nonce||f?.getAttribute("nonce");a=c(n.map(r=>{if(r=Jt(r),r in Re)return;Re[r]=!0;const m=r.endsWith(".css"),h=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${h}`))return;const v=document.createElement("link");if(v.rel=m?"stylesheet":Zt,m||(v.as="script"),v.crossOrigin="",v.href=r,u&&v.setAttribute("nonce",u),document.head.appendChild(v),m)return new Promise((M,k)=>{v.addEventListener("load",M),v.addEventListener("error",()=>k(new Error(`Unable to preload CSS for ${r}`)))})}))}function o(c){const f=new Event("vite:preloadError",{cancelable:!0});if(f.payload=c,window.dispatchEvent(f),!f.defaultPrevented)throw c}return a.then(c=>{for(const f of c||[])f.status==="rejected"&&o(f.reason);return t().catch(o)})},X=new Map;function tt(){return"/lycian-way-2026/"}async function E(e){if(X.has(e))return X.get(e);const t=await fetch(`${tt()}data/${e}.json`);if(!t.ok)throw new Error(`Failed to load data/${e}.json: ${t.status}`);const n=await t.json();return X.set(e,n),n}const Pe=()=>E("config").then(e=>e),Ie=()=>E("itinerary").then(e=>e.days),nt=()=>E("routes").then(e=>e.routes),st=()=>E("places").then(e=>e.places),at=()=>E("water"),ot=()=>E("accommodation").then(e=>e.accommodations),rt=()=>E("food").then(e=>e.foodPlaces),Qt=()=>E("fuel"),it=()=>E("transport").then(e=>e.transportLegs),en=()=>E("alerts").then(e=>e.alerts),tn=()=>E("attractions").then(e=>e.attractions),nn=()=>E("sources").then(e=>e.sources),lt=()=>E("trail"),ct=()=>E("pois"),sn=nn().then(e=>{const t=new Map;for(const n of e)t.set(n.id,n);return t}),an=async e=>(await sn).get(e);async function on(e){return(await Ie()).find(n=>n.id===e)}async function rn(e){return e?(await nt()).find(n=>n.id===e):null}async function Ne(e){return e?(await st()).find(n=>n.id===e):null}async function dt(e){const t=`knowledge:${e}`;if(X.has(t))return X.get(t);const n=await fetch(`${tt()}content/knowledge/${e}.md`);if(!n.ok)throw new Error(`Failed to load knowledge/${e}.md: ${n.status}`);const s=await n.text(),a=ln(s);return X.set(t,a),a}function ln(e){const t=e.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);if(!t)return{meta:{},body:e};const[,n,s]=t,a={};for(const o of n.split(`
`)){const c=o.match(/^(\w+):\s*(.*)$/);if(!c)continue;const[,f,u]=c;u.startsWith("[")&&u.endsWith("]")?a[f]=u.slice(1,-1).split(",").map(r=>r.trim()).filter(Boolean):a[f]=u.trim()}return{meta:a,body:s.trim()}}const ze={neutral:"#AAAAAA",orange:"#FF8800",yellow:"#FFEE00",red:"#FF0000"};function pt(e,t){return e?.status?.[t]?.color??ze[t]??ze.neutral}function cn(e,t){return e?.status?.[t]?.label??t}function O(e,t,{small:n=!1}={}){const s=pt(e,t),a=cn(e,t),o=n?"status-badge status-badge--small":"status-badge",c=t==="orange"||t==="yellow"||t==="red";return`<span class="${o}" style="--status-color:${s}" title="${d(a)}">
    <span class="status-badge__dot"></span>${c?'<span class="status-badge__warn">&#9650;</span>':""}
  </span>`}function ut(){return'<a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge Base</a>'}function d(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function dn([e,t],[n,s]){const o=t*Math.PI/180,c=s*Math.PI/180,f=(s-t)*Math.PI/180,u=(n-e)*Math.PI/180,r=Math.sin(f/2)**2+Math.cos(o)*Math.cos(c)*Math.sin(u/2)**2;return 2*6371e3*Math.asin(Math.sqrt(r))}function z(e){const t=[0];for(let n=1;n<e.length;n++)t.push(t[n-1]+dn(e[n-1],e[n]));return t}function Yn(e){const t=z(e);return t[t.length-1]??0}function ft(e,t){if(t.length<2)return null;const n=z(t);let s=null;for(let a=0;a<t.length-1;a++){const o=t[a],c=t[a+1],{t:f,pt:u,dist:r}=pn(e,o,c),m=n[a]+f*(n[a+1]-n[a]);(!s||r<s.distanceFrom)&&(s={distanceAlong:m,distanceFrom:r,pointOnLine:u,segmentIndex:a})}return s}function pn(e,t,n){const s=(t[1]+n[1])/2*(Math.PI/180),a=([j,g])=>[j*Math.cos(s)*111320,g*111320],[o,c]=a(e),[f,u]=a(t),[r,m]=a(n),h=r-f,v=m-u;let M=h===0&&v===0?0:((o-f)*h+(c-u)*v)/(h*h+v*v);M=Math.max(0,Math.min(1,M));const k=f+M*h,w=u+M*v,S=Math.hypot(o-k,c-w),F=[t[0]+M*(n[0]-t[0]),t[1]+M*(n[1]-t[1])];return{t:M,pt:F,dist:S}}function Se(e,t){const n=z(e),s=n[n.length-1],a=Math.max(0,Math.min(s,t));for(let o=0;o<n.length-1;o++)if(a>=n[o]&&a<=n[o+1]){const c=n[o+1]-n[o],f=c===0?0:(a-n[o])/c,u=e[o],r=e[o+1];return[u[0]+f*(r[0]-u[0]),u[1]+f*(r[1]-u[1])]}return e[e.length-1]}function un(e,t){const n=z(e),s=n[n.length-1];if(t<=0)return{before:[],after:e};if(t>=s)return{before:e,after:[]};const a=Se(e,t);let o=0;for(let u=0;u<n.length-1;u++)if(t>=n[u]&&t<=n[u+1]){o=u;break}const c=[...e.slice(0,o+1),a],f=[a,...e.slice(o+1)];return{before:c,after:f}}const mt="lycian-2026-trail-progress-m",fn=300;function fe(){try{const e=localStorage.getItem(mt);return e?Number(e):0}catch{return 0}}function mn(e){try{localStorage.setItem(mt,String(e))}catch{}}function Qn(e,t){if(!e||t.length<2)return fe();const n=ft(e,t);if(!n||n.distanceFrom>fn)return fe();const s=fe();return n.distanceAlong>s?(mn(n.distanceAlong),n.distanceAlong):s}function hn(e){const t={west:180,south:90,east:-180,north:-90};for(const[n,s]of e)t.west=Math.min(t.west,n),t.east=Math.max(t.east,n),t.south=Math.min(t.south,s),t.north=Math.max(t.north,s);return t}function gn(e,[t,n],s,a,o){return[o+(t-e.west)/(e.east-e.west)*(s-2*o),o+(1-(n-e.south)/(e.north-e.south))*(a-2*o)]}function De(e,t,n=3){return e.length<2?"":`<path d="${e.map((a,o)=>`${o===0?"M":"L"}${a[0].toFixed(1)},${a[1].toFixed(1)}`).join(" ")}" fill="none" stroke="${t}" stroke-width="${n}" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`}function yn(e,{config:t,places:n,master:s,waterList:a,gpsPosition:o}){const r=hn(s.coords),m=g=>gn(r,g,400,640,30),h=t.routeProgress?.untraveled??"#AAAAAA",v=t.routeProgress?.traveled??"#00FF80";let M=De(s.coords.map(m),h);const{before:k}=un(s.coords,fe());k.length>=2&&(M+=De(k.map(m),v));const w=([g,p])=>g>=r.west-.02&&g<=r.east+.02&&p>=r.south-.02&&p<=r.north+.02,S=n.filter(g=>w(g.coordinates)).map(g=>{const[p,P]=m(g.coordinates);return`<circle cx="${p}" cy="${P}" r="5" fill="${pt(t,g.status)}" stroke="#0e1613" stroke-width="1.5"/>
      <text x="${p+8}" y="${P+4}" font-size="10" fill="#eef2ee">${d(g.name)}</text>`}).join(""),F=a.filter(g=>g.kind==="source").map(g=>{const[p,P]=m(g.coordinates);return`<circle cx="${p}" cy="${P}" r="3.5" fill="#00A3FF" stroke="#0e1613" stroke-width="1"/>`}).join(""),j=o&&w([o.lon,o.lat])?(()=>{const[g,p]=m([o.lon,o.lat]);return`<circle cx="${g}" cy="${p}" r="7" fill="${t.gps?.markerColor??"#1A73E8"}" opacity="0.9"/>`})():"";e.innerHTML=`
    <svg viewBox="0 0 400 640" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;background:#182420;">
      ${M}${F}${S}${j}
    </svg>
  `}let re=null,V=null;const xe=new Set;let J=null,W=null,Le=null,ht=7e3;function $n({updateIntervalSeconds:e}={}){e&&(ht=e*1e3)}function Ae(e){return xe.add(e),(J||W)&&e({position:J,error:W}),()=>xe.delete(e)}function Te(){for(const e of xe)e({position:J,error:W})}function Ue(){Le&&(J=Le,W=null,Te()),V=null}function gt(){if(re===null){if(W=null,!("geolocation"in navigator)){W={code:"unsupported",message:"Geolocation not supported in this browser."},Te();return}re=navigator.geolocation.watchPosition(e=>{Le={lat:e.coords.latitude,lon:e.coords.longitude,accuracy:e.coords.accuracy,heading:typeof e.coords.heading=="number"&&!Number.isNaN(e.coords.heading)?e.coords.heading:null,timestamp:e.timestamp},J||Ue(),V===null&&(V=setTimeout(Ue,ht))},e=>{W={code:e.code,message:e.message},Te()},{enableHighAccuracy:!0,maximumAge:5e3,timeout:15e3})}}function vn(){re!==null&&(navigator.geolocation.clearWatch(re),re=null),V!==null&&(clearTimeout(V),V=null)}function se(){return J}function me(e){return String(e??"").replace(/[<>&'"]/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"})[t])}function Ke([e,t],n,s,a){return`  <wpt lat="${t}" lon="${e}"><name>${me(n)}</name>${s?`<desc>${me(s)}</desc>`:""}${a?`<sym>${a}</sym>`:""}</wpt>`}function wn({trail:e,itinerary:t,routes:n,waterList:s,accommodation:a}){const o=new Map(t.map(r=>[r.id,r])),c=new Map(n.map(r=>[r.dayId,r])),f=[];for(const r of s){const m=r.kind==="source"?"Вода: источник":"Вода: купить",h=r.kind==="source"?"В октябре может быть сухим — не рассчитывать как на единственный":r.osmType??"";f.push(Ke(r.coordinates,`${m} — ${r.name}`,h,r.kind==="source"?"Drinking Water":"Shopping Center"))}for(const r of a){if(!r.coordinates||r.status==="red")continue;const m=[r.priceInfo,r.address,r.phone,r.checkIn&&`Check-in ${r.checkIn}`].filter(Boolean).join(" · ");f.push(Ke(r.coordinates,`Ночёвка: ${r.name}`,m,r.type==="hotel"?"Lodging":"Campground"))}const u=e.days.map(r=>{const m=o.get(r.dayId),h=c.get(r.dayId),v=`${m?.date??r.dayId} ${h?.name??`${r.from} → ${r.to}`}`,M=r.coordinates.map(([k,w,S])=>`      <trkpt lat="${w}" lon="${k}"><ele>${S}</ele></trkpt>`).join(`
`);return`  <trk><name>${me(v)}</name><desc>${me(`${r.distanceKm} km, +${r.ascentM}/-${r.descentM} m (по треку)`)}</desc><trkseg>
${M}
    </trkseg></trk>`});return`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Lycian Way 2026" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>Lycian Way 2026 — Ovacık → Xanthos</name><desc>Cleaned track (source: trekkingmania 2024 GPX), water and lodging points. Map data © OpenStreetMap contributors.</desc></metadata>
${f.join(`
`)}
${u.join(`
`)}
</gpx>`}function bn(e,t="lycian-way-2026.gpx"){const n=new Blob([e],{type:"application/gpx+xml"}),s=URL.createObjectURL(n),a=document.createElement("a");a.href=s,a.download=t,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}const he="lycian-2026-checklist-";function Mn(e){try{const t=localStorage.getItem(he+e);return t?JSON.parse(t):null}catch{return null}}function ie(e,t){try{localStorage.setItem(he+e,JSON.stringify(t))}catch{}}let Ee=1;function kn(e){try{return new Set(JSON.parse(localStorage.getItem(`${he}${e}-seeded`)??"null")??[])}catch{return null}}function Xe(e,t){try{localStorage.setItem(`${he}${e}-seeded`,JSON.stringify([...t]))}catch{}}function ge(e){const t=[...e.preTripTasks??[],...e.tasks??[]];let n=Mn(e.id);if(!n)return n=t.map(o=>({id:`seed-${Ee++}`,text:o,done:!1})),ie(e.id,n),Xe(e.id,new Set(t)),n;const s=kn(e.id)??new Set(n.map(o=>o.text)),a=t.filter(o=>!s.has(o)&&!n.some(c=>c.text===o));return a.length&&(n.push(...a.map(o=>({id:`seed-${Date.now()}-${Ee++}`,text:o,done:!1}))),ie(e.id,n)),t.forEach(o=>s.add(o)),Xe(e.id,s),n}function _n(e,t){const n=ge(e);return n.push({id:`custom-${Date.now()}-${Ee++}`,text:t,done:!1}),ie(e.id,n),n}function Sn(e,t){const n=ge(e),s=n.find(a=>a.id===t);return s&&(s.done=!s.done),ie(e.id,n),n}function xn(e){const t=ge(e).filter(n=>!n.done);return ie(e.id,t),t}function yt(e){const t=[],n=[],s=[];for(const o of e.days){const c=o.coordinates,f=t.length>0,u=f?t.length-1:0;for(let r=f?1:0;r<c.length;r++)t.push([c[r][0],c[r][1]]),n.push(c[r][2]);s.push({...o,startIdx:u,endIdx:t.length-1})}const a=z(t);for(const o of s)o.startM=a[o.startIdx],o.endM=a[o.endIdx];return{coords:t,ele:n,cum:a,days:s}}function Ln(e,t){return e.days.find(n=>t>=n.startM-1&&t<=n.endM+1)??null}function ae(e,[t,n]){const s=ft([t,n],e.coords);return s?{alongM:s.distanceAlong,offTrailM:s.distanceFrom,point:s.pointOnLine,day:Ln(e,s.distanceAlong)}:null}function $t(e,{pois:t,water:n,food:s}){const a=[],o=[],c=u=>o.some(r=>Math.abs(r[0]-u[0])<8e-4&&Math.abs(r[1]-u[1])<8e-4),f=u=>{const r=ae(e,u.coordinates);r&&(a.push({...u,alongM:r.alongM,offTrailM:r.offTrailM}),o.push(u.coordinates))};for(const u of n?.waterPoints??[])f({id:u.id,kind:"source",name:u.name,coordinates:u.coordinates,osmType:u.waterType,notes:u.notes,curated:!0});for(const u of s??[])u.coordinates&&f({id:u.id,kind:"buy",name:u.name,coordinates:u.coordinates,osmType:u.category,curated:!0});for(const u of t?.water??[])c(u.coordinates)||f(u);for(const u of t?.buy??[])c(u.coordinates)||f(u);return a.sort((u,r)=>u.alongM-r.alongM)}function Ve(e,t,n){return e.find(s=>s.alongM>t+20&&(!n||s.kind===n))??null}function An(e){let t=0;for(let n=1;n<e.length;n++){const s=e[n-1],a=e[n],o=z([[s[0],s[1]],[a[0],a[1]]])[1];if(o<.5)continue;const c=(a[2]-s[2])/o,f=6*Math.exp(-3.5*Math.abs(c+.05));t+=o/1e3/f}return t}function Tn(e,t=8){const n=e.map(f=>f[2]),s=n.map((f,u)=>{const r=n.slice(Math.max(0,u-1),u+2);return r.reduce((m,h)=>m+h,0)/r.length});let a=0,o=0,c=s[0];for(const f of s)f-c>=t?(a+=f-c,c=f):c-f>=t&&(o+=c-f,c=f);return{ascentM:Math.round(a),descentM:Math.round(o)}}function R(e){const t=e/1e3;return t<10?t.toFixed(1).replace(".",","):String(Math.round(t))}function K(e){return e<1e3?`${Math.round(e/10)*10} м`:`${R(e)} км`}function En(e){const t=Math.floor(e),n=Math.round((e-t)*60);return t?`${t} ч ${String(n).padStart(2,"0")} мин`:`${n} мин`}function vt(e,{width:t=320,height:n=90,marks:s=[],color:a="#7fb3a3"}={}){if(!e||e.length<2)return"";const o=z(e.map(g=>[g[0],g[1]])),c=o.at(-1)||1,f=e.map(g=>g[2]),u=Math.min(...f),r=Math.max(...f),m=8,h=16,v=30,M=Math.max(20,r-u),k=g=>v+g/c*(t-v-4),w=g=>m+(1-(g-u)/M)*(n-m-h),S=e.map((g,p)=>`${p?"L":"M"}${k(o[p]).toFixed(1)},${w(g[2]).toFixed(1)}`).join(" "),F=`${S} L${k(c).toFixed(1)},${n-h} L${v},${n-h} Z`,j=s.map(g=>{const p=k(Math.max(0,Math.min(c,g.m)));return`<line x1="${p}" x2="${p}" y1="${m}" y2="${n-h}" stroke="${g.color??"#00A3FF"}" stroke-width="1.5" stroke-dasharray="2 2"/>`}).join("");return`<svg class="profile-svg" viewBox="0 0 ${t} ${n}" width="100%" role="img" aria-label="Профиль высот">
    <path d="${F}" fill="${a}" opacity="0.25"/>
    <path d="${S}" fill="none" stroke="${a}" stroke-width="1.6"/>
    ${j}
    <text x="2" y="${m+8}" font-size="9" fill="currentColor">${Math.round(r)} м</text>
    <text x="2" y="${n-h}" font-size="9" fill="currentColor">${Math.round(u)} м</text>
    <text x="${v}" y="${n-3}" font-size="9" fill="currentColor">0</text>
    <text x="${t-4}" y="${n-3}" font-size="9" fill="currentColor" text-anchor="end">${R(c)} км</text>
  </svg>`}const Pn={place:"Waypoint",source:"Вода: источник",buy:"Вода: купить",food:"Food / resupply",sleep:"Sleep",transport:"Transport",attraction:"Place to see",hazard:"Watch out",fuel:"Gas",gpx:"Точка из GPX"},wt="lycian-2026-gps-on",In=100,Cn=5e3;function Fn(e,t){const n=new Date().toISOString().slice(0,10),s=t.trip.startDate,a=t.trip.endDate;return n<s?e[0]:n>a?e[e.length-1]:e.find(o=>o.date===n)??e[0]}function jn(e){return"orange"}function qn(){try{return localStorage.getItem(wt)==="1"}catch{return!1}}function Bn(e){try{localStorage.setItem(wt,e?"1":"0")}catch{}}const On=`
  <p><strong>Доступ к геолокации запрещён.</strong> Как включить:</p>
  <p><strong>iPhone (Safari или иконка на главном экране):</strong> Настройки → Конфиденциальность и безопасность → Службы геолокации → включить; ниже «Сайты Safari» → «При использовании». Затем в Safari: «аА» в адресной строке → Настройки веб-сайта → Геопозиция → Разрешить. Перезагрузите страницу.</p>
  <p><strong>Android (Chrome):</strong> опустите шторку и включите «Местоположение». В Chrome: ⋮ → Настройки → Настройки сайтов → Геоданные → разрешить для jlazdes.github.io (или значок замка слева от адреса → Разрешения → Геоданные). Перезагрузите страницу.</p>
  <p style="color:var(--text-dim);font-size:0.75rem;">GPS работает и без интернета — нужен только доступ к геолокации.</p>
`;async function Hn(e){const[t,n,s,a,o,c,f,u,r,m,h,v,M]=await Promise.all([Pe(),st(),nt(),at(),tn(),en(),rt(),Qt(),ot(),it(),Ie(),lt(),ct()]);$n(t.gps);const k=yt(v),w=$t(k,{pois:M,water:a,food:f}),S=new Map(n.map(i=>[i.id,i])),F=new Map(s.map(i=>[i.dayId,i])),j=new Map(h.map(i=>[i.id,i])),g=[];S.get("place-xanthos")&&S.get("place-kas")&&g.push({id:"transport-dolmus-xanthos-kas",coordinates:[S.get("place-xanthos").coordinates,S.get("place-kas").coordinates]});const p=Fn(h,t),P=c.filter(i=>!i.affects?.routeIds?.length);e.innerHTML=`
    <div class="map-screen">
      <div id="map-canvas-wrap"></div>
      <div id="map-fallback-note" class="map-fallback-note" hidden></div>
      <div id="offtrail-banner" class="offtrail-banner" hidden></div>

      <div class="today-widget" id="today-widget">
        <button class="today-widget__header" id="today-widget-toggle">
          <span>${d(p.date)} &middot; Tasks</span>
          <span class="today-widget__chevron" id="today-widget-chevron">&#8964;</span>
        </button>
        <div class="today-widget__body" id="today-widget-body">
          ${P.length?`
            <div class="today-widget__alerts">
              ${P.map(i=>`<div>${O(t,i.status)} ${d(i.title)}</div>`).join("")}
            </div>
          `:""}
          <div class="today-widget__list" id="today-tasks-list"></div>
          <button class="today-widget__add" id="today-add-btn">+ Add item</button>
          <div class="today-widget__completed-header" id="today-completed-header" hidden>
            <span>Completed</span>
            <button id="today-clear-btn" title="Clear completed" aria-label="Clear completed">🗑</button>
          </div>
          <div class="today-widget__list today-widget__list--completed" id="today-completed-list"></div>
          <a href="#/itinerary/${p.id}" class="today-widget__full-day">Full day view &rarr;</a>
        </div>
      </div>

      <button class="map-round-btn" id="locate-btn" title="Где я" aria-label="Где я" aria-pressed="false">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 3h-2.07A7 7 0 0 0 13 5.07V3h-2v2.07A7 7 0 0 0 5.07 11H3v2h2.07A7 7 0 0 0 11 18.93V21h2v-2.07A7 7 0 0 0 18.93 13H21v-2Zm-9 6a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/></svg>
      </button>

      <button class="map-round-btn map-round-btn--layers" id="layers-btn" title="Слои карты" aria-label="Слои карты" aria-expanded="false">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="m12 3 10 5.5-10 5.5L2 8.5 12 3Zm-7.6 9.3L12 16.5l7.6-4.2 2.4 1.3-10 5.5-10-5.5 2.4-1.3Z"/></svg>
      </button>
      <div class="layers-menu" id="layers-menu" hidden>
        <button data-layer="map" aria-pressed="true">Карта</button>
        <button data-layer="topo">Топо <span class="layers-menu__note">нужен интернет</span></button>
        <button data-layer="satellite">Спутник <span class="layers-menu__note">нужен интернет</span></button>
      </div>
      <button class="map-round-btn map-round-btn--measure" id="measure-btn" title="Измерить по тропе" aria-label="Измерить по тропе" aria-pressed="false">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3 17.3 17.3 3 21 6.7 6.7 21 3 17.3Zm3.7 1.3 1-1-1.6-1.6.9-.9 1.6 1.6 1.2-1.2-1-1 .9-.9 1 1 1.2-1.2-1.6-1.6.9-.9 1.6 1.6 1.2-1.2-1-1 .9-.9 1 1 1.2-1.2-1.6-1.6.9-.9 1.6 1.6 1-1-1.3-1.3L5.4 17.3l1.3 1.3Z"/></svg>
      </button>

      <div id="gps-panel" class="gps-panel" hidden></div>
      <div id="measure-panel" class="gps-panel measure-panel" hidden></div>

      <button class="map-fab map-fab--demo" id="demo-btn">▶ Play Demo</button>
      <button class="map-fab map-fab--stop-demo" id="demo-stop-btn" hidden>✕ End Demo</button>
      <button class="map-fab map-fab--water" id="water-only-btn" aria-pressed="false">💧 Только вода</button>
      <button class="map-fab map-fab--gpx" id="gpx-btn" title="Скачать GPX" aria-label="Скачать GPX">GPX</button>

      <div id="poi-panel" class="poi-panel" hidden>
        <button class="poi-panel__close" id="poi-close-btn" aria-label="Close">&times;</button>
        <div id="poi-panel-body"></div>
      </div>
    </div>
  `;const kt=e.querySelector("#today-tasks-list"),_t=e.querySelector("#today-completed-list"),St=e.querySelector("#today-completed-header");function le(){const i=ge(p),l=i.filter($=>!$.done),y=i.filter($=>$.done);kt.innerHTML=l.map($=>`
      <label class="today-widget__item">
        <input type="checkbox" data-id="${$.id}" />
        <span>${d($.text)}</span>
      </label>
    `).join("")||'<p class="empty-state" style="padding:6px 0;">Nothing left — nice.</p>',St.hidden=y.length===0,_t.innerHTML=y.map($=>`
      <label class="today-widget__item today-widget__item--done">
        <input type="checkbox" data-id="${$.id}" checked />
        <span>${d($.text)}</span>
      </label>
    `).join(""),e.querySelectorAll("#today-tasks-list input, #today-completed-list input").forEach($=>{$.addEventListener("change",()=>{Sn(p,$.dataset.id),le()})})}le(),e.querySelector("#today-add-btn").addEventListener("click",()=>{const i=prompt("Add a task");i&&i.trim()&&(_n(p,i.trim()),le())}),e.querySelector("#today-clear-btn").addEventListener("click",()=>{xn(p),le()});const xt=e.querySelector("#today-widget-toggle"),Ce=e.querySelector("#today-widget-body"),Lt=e.querySelector("#today-widget-chevron");xt.addEventListener("click",()=>{const i=Ce.hidden=!Ce.hidden;Lt.style.transform=i?"rotate(-90deg)":"rotate(0deg)"});const ye=e.querySelector("#map-canvas-wrap"),B=e.querySelector("#map-fallback-note"),Q=e.querySelector("#demo-btn"),ce=e.querySelector("#demo-stop-btn"),Fe=e.querySelector("#poi-panel"),At=e.querySelector("#poi-panel-body"),Tt=e.querySelector("#poi-close-btn");function Et(i){const l=ae(k,i);if(!l||l.offTrailM>3e3)return"";const y=l.day;return`<p class="poi-panel__meta">${y?`${d(j.get(y.dayId)?.date??"")}: ${R(l.alongM-y.startM)} км от старта дня`:""}${l.offTrailM>30?` &middot; ${Math.round(l.offTrailM)} м от тропы`:" &middot; на тропе"}</p>`}function Pt(i,l){const[y,$]=i;return`<div class="link-row">
      <a class="btn" target="_blank" rel="noopener" href="${l??`https://www.google.com/maps/search/?api=1&query=${$},${y}`}">Google Maps</a>
      <a class="btn btn-secondary" href="om://map?ll=${$},${y}&n=1">Organic Maps</a>
      <a class="btn btn-secondary" href="mapsme://map?ll=${$},${y}&n=1">maps.me</a>
    </div>`}async function It({kind:i,data:l}){const y=l.coordinates??null;let $=l.status,_="";if(i==="source")$=l.curated?jn():"orange",_=`
        <p class="poi-panel__category">${d(l.osmType??"spring")}${l.osm?` &middot; <a href="https://www.openstreetmap.org/${l.osm}" target="_blank" rel="noopener">OSM</a>`:""}</p>
        <p class="poi-warning">В октябре может быть сухим, не рассчитывать как на единственный.</p>
        ${l.notes?`<p>${d(l.notes)}</p>`:""}`;else if(i==="buy")$="neutral",_=`<p class="poi-panel__category">${d(l.osmType??"")}${l.osm?` &middot; <a href="https://www.openstreetmap.org/${l.osm}" target="_blank" rel="noopener">OSM</a>`:""}</p>
        <p>Купить воду — надёжно (магазин / кафе). Часы работы не проверены.</p>`;else if(i==="food")_=`<p class="poi-panel__category">${d(l.category??"food")}</p>`;else if(i==="fuel")_=`<p class="poi-panel__category">gas &middot; stock of EN417 canisters ${l.canisterStockConfirmed?"confirmed":"not confirmed"}</p>`;else if(i==="sleep")_=`<p class="poi-panel__category">${d(l.type??"camp")}${l.booked?" &middot; <strong>забронировано</strong>":""}</p>
        ${l.address?`<p>${d(l.address)}</p>`:""}
        ${l.phone?`<p><a href="tel:${l.phone.replace(/\s/g,"")}">${d(l.phone)}</a></p>`:""}
        ${l.checkIn?`<p>Заезд: ${d(l.checkIn)}<br>Выезд: ${d(l.checkOut??"")}</p>`:""}
        <p>${d(l.priceInfo??"")}</p>`;else if(i==="transport"){const b=l.details?.segments??(l.details?.flightNo?[l.details]:[]);_=`<p class="poi-panel__category">${d(l.mode??"transport")}${l.date?` &middot; ${d(l.date)}`:""}</p>
        ${b.map(x=>`<p><strong>${d(x.flightNo)}</strong> ${d(x.from)} ${d(x.depart)} → ${d(x.to)} ${d(x.arrive)}</p>`).join("")}`}else if(i==="attraction"){const b=l.category==="ruins"?'<a href="#/knowledge/ancient-lycia">More on Ancient Lycia &rarr;</a>':"";_=`<p class="poi-panel__category">${d(l.category)}</p><p>${d(l.shortDescription??"")}</p>${b?`<p>${b}</p>`:""}`}else i==="hazard"?_='<p><a href="#/knowledge/route-decisions">More on route decisions &rarr;</a> &middot; <a href="#/knowledge/safety">Safety notes &rarr;</a></p>':i==="gpx"&&($="neutral",_=`<p class="poi-panel__category">${d(l.categoryLabel)}</p><p style="color:var(--text-dim);font-size:0.75rem;">Из GPX trekkingmania (2024) — может быть устаревшим.</p>`);const I=await Promise.all((l.sources??[]).map(b=>an(b))),C=y??S.get(l.placeId)?.coordinates;At.innerHTML=`
      <div class="pill-row">${O(t,$??"neutral")}<span class="pill">${d(Pn[i]??i)}</span></div>
      <h3>${d(l.name)}</h3>
      ${C?Et(C):""}
      ${_}
      ${l.notes&&i!=="source"?`<p>${d(l.notes)}</p>`:""}
      ${l.confidence?`<p style="font-size:0.75rem;color:var(--text-dim);">Confidence: ${d(l.confidence)}${l.lastVerified?` &middot; last verified ${d(l.lastVerified)}`:""}</p>`:""}
      ${I.filter(Boolean).length?`<div class="section-title">Sources</div>${I.filter(Boolean).map(b=>b.url?`<p><a href="${b.url}" target="_blank" rel="noopener">${d(b.title)}</a></p>`:`<p>${d(b.title)}</p>`).join("")}`:""}
      ${C?Pt(C,l.googleMapsUrl):""}
    `,Fe.hidden=!1}function $e(){Fe.hidden=!0}Tt.addEventListener("click",$e);function Ct(){B.textContent="Упрощённая схема — карта не запустилась на этом устройстве.",B.hidden=!1,yn(ye,{config:t,places:n,master:k,waterList:w,gpsPosition:se()})}let L=null;try{const{mountMapLibre:i}=await Yt(async()=>{const{mountMapLibre:l}=await import("./map-CJdjZvNt.js");return{mountMapLibre:l}},[]);ye.innerHTML='<div id="maplibre-container" style="width:100%;height:100%;"></div>',L=await i(ye.querySelector("#maplibre-container"),{config:t,places:n,routes:s,food:f,fuel:u,accommodation:r,transport:m,attractions:o,master:k,waterList:w,pois:M,transportLines:g}),L.setOnPoiClick(l=>{if(H&&(l.data.coordinates??S.get(l.data.placeId)?.coordinates)){Ge(l.data.coordinates??S.get(l.data.placeId).coordinates);return}It(l)}),L.mode==="offline-map"?(B.textContent="Офлайн: карта коридора ±2 км",B.hidden=!1):L.mode==="offline-blank"&&(B.innerHTML='Офлайн — подложка не скачана. Трек и точки работают. <a href="#/knowledge">Скачать карту</a>',B.hidden=!1)}catch(i){console.warn("MapLibre failed to load, falling back to the SVG corridor view",i),Ct()}const ve=e.querySelector("#locate-btn"),q=e.querySelector("#gps-panel"),ee=e.querySelector("#offtrail-banner");let te=!1,we=!1,H=!1;function de(i,l){if(!te){q.hidden=!0,ee.hidden=!0;return}if(q.hidden=H,l&&!i){l.code===1?q.innerHTML=`<button class="gps-panel__close" aria-label="Закрыть">&times;</button>${On}`:q.innerHTML=`<button class="gps-panel__close" aria-label="Закрыть">&times;</button><p>Не удаётся определить местоположение: ${d(l.message)}. Выйдите на открытое место и подождите.</p>`,q.querySelector(".gps-panel__close").addEventListener("click",()=>ne(!1)),ee.hidden=!0;return}if(!i){q.innerHTML="<p>Ищем GPS…</p>";return}const y=ae(k,[i.lon,i.lat]),$=`±${Math.round(i.accuracy??0)} м`;if(!y||y.offTrailM>Cn){ee.hidden=!0,q.innerHTML=`<p><strong>Вы далеко от маршрута</strong> — ${R(y?.offTrailM??0)} км до тропы. <span class="gps-panel__acc">${$}</span></p>`;return}ee.hidden=y.offTrailM<=In,ee.textContent=`Вы в ${Math.round(y.offTrailM)} м от тропы`;const _=y.day??k.days.at(-1),I=Math.max(0,_.endM-y.alongM),C=F.get(_.dayId),b=Ve(w,y.alongM,"source"),x=Ve(w,y.alongM,"buy");q.innerHTML=`
      <div class="gps-panel__row"><span>До финиша дня${C?` (${d(_.to)})`:""}</span><strong>${K(I)}</strong></div>
      <div class="gps-panel__row"><span>💧 Источник впереди${b?` — ${d(b.name)}`:""}</span><strong>${b?K(b.alongM-y.alongM):"—"}</strong></div>
      <div class="gps-panel__row"><span>🛒 Купить воду${x?` — ${d(x.name)}`:""}</span><strong>${x?K(x.alongM-y.alongM):"—"}</strong></div>
      <div class="gps-panel__foot">по тропе &middot; точность ${$}</div>
    `}function ne(i){te=i,Bn(i),ve.classList.toggle("map-round-btn--active",i),ve.setAttribute("aria-pressed",String(i)),i?(we=!1,gt(),de(se(),null)):(vn(),de(null,null))}ve.addEventListener("click",()=>{if(!te){ne(!0);return}const i=se();i&&L?L.flyTo([i.lon,i.lat]):ne(!1)}),Ae(({position:i,error:l})=>{te&&(i&&L&&(L.setGpsPosition(i),we||(we=!0,L.flyTo([i.lon,i.lat],14))),de(i,l))}),qn()&&ne(!0);const je=e.querySelector("#layers-btn"),G=e.querySelector("#layers-menu");je.addEventListener("click",()=>{G.hidden=!G.hidden,je.setAttribute("aria-expanded",String(!G.hidden)),G.querySelectorAll("[data-layer]").forEach(i=>{i.disabled=i.dataset.layer!=="map"&&!navigator.onLine})}),G.querySelectorAll("[data-layer]").forEach(i=>{i.addEventListener("click",async()=>{if(!L)return;G.querySelectorAll("[data-layer]").forEach(y=>y.setAttribute("aria-pressed",String(y===i))),G.hidden=!0,(await L.setLayer(i.dataset.layer)).startsWith("offline")&&i.dataset.layer!=="map"&&(B.textContent="Нет интернета — показана офлайн-карта.",B.hidden=!1)})});const be=e.querySelector("#measure-btn"),D=e.querySelector("#measure-panel"),qe=300;let A=null,T=null,pe=!1;function Be(i,l){const{coords:y,ele:$,cum:_}=k,I=b=>{let x=_.findIndex(qt=>qt>=b);if(x<=0)return $[0];const jt=(b-_[x-1])/Math.max(1,_[x]-_[x-1]);return $[x-1]+jt*($[x]-$[x-1])},C=[[...Se(y,i),I(i)]];for(let b=0;b<y.length;b++)_[b]>i&&_[b]<l&&C.push([y[b][0],y[b][1],$[b]]);return C.push([...Se(y,l),I(l)]),C}function Ft([i,l]){return`<div class="link-row">
      <span style="font-size:0.72rem;color:var(--text-dim);align-self:center;">Открыть Б в:</span>
      <a class="btn btn-secondary" href="om://map?ll=${l},${i}&n=1">Organic Maps</a>
      <a class="btn btn-secondary" href="mapsme://map?ll=${l},${i}&n=1">maps.me</a>
      <a class="btn btn-secondary" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${l},${i}">Google Maps</a>
    </div>
    <p class="gps-panel__foot">Только по нашему треку. Маршрут вне тропы не прокладывается — для этого откройте точку в приложении (нужен интернет или офлайн-карты в приложении).</p>`}function Me(i){if(!H){D.hidden=!0;return}D.hidden=!1,q.hidden=!0;const l='<button class="gps-panel__close" id="measure-close" aria-label="Закрыть">&times;</button><strong>Измерить по тропе</strong>',y='<div class="link-row"><button class="btn btn-secondary" id="measure-from-me">📍 От меня</button><button class="btn btn-secondary" id="measure-reset">Сбросить</button></div>';let $;if(i)$=`<p>${i}</p>`;else if(!A)$="<p>Тапните точку A на треке — или «От меня».</p>";else if(!T)$=`<p>A: ${R(A.alongM)} км по тропе${A.fromMe?" (вы)":""}. Теперь тапните точку Б.</p>`;else{const _=T.alongM>=A.alongM;let I=Be(Math.min(A.alongM,T.alongM),Math.max(A.alongM,T.alongM));_||(I=I.reverse());const{ascentM:C,descentM:b}=Tn(I),x=Math.abs(T.alongM-A.alongM);$=`
        <div class="gps-panel__row"><span>Расстояние по тропе</span><strong>${K(x)}</strong></div>
        <div class="gps-panel__row"><span>Набор / сброс</span><strong>+${C} / −${b} м</strong></div>
        <div class="gps-panel__row"><span>Время (оценка, формула Тоблера)</span><strong>≈ ${En(An(I))}</strong></div>
        ${vt(I,{height:70})}
        ${Ft(T.point)}`}D.innerHTML=`${l}${$}${y}`,D.querySelector("#measure-close").addEventListener("click",()=>He(!1)),D.querySelector("#measure-reset").addEventListener("click",()=>{A=T=null,U()}),D.querySelector("#measure-from-me").addEventListener("click",()=>{const _=se();if(_){Oe(_);return}pe=!0,te||ne(!0),Me("Ждём GPS…")})}function U(i){L?.setMeasurePoints([A,T].filter(Boolean).map(l=>l.point)),A&&T?L?.setMeasureLine(Be(Math.min(A.alongM,T.alongM),Math.max(A.alongM,T.alongM)).map(l=>[l[0],l[1]])):L?.setMeasureLine(null),Me(i)}function Oe(i){pe=!1;const l=ae(k,[i.lon,i.lat]);if(!l||l.offTrailM>qe){U(`Вы в ${K(l?.offTrailM??0)} от тропы — «От меня» работает только рядом с треком.`);return}A={alongM:l.alongM,point:l.point,fromMe:!0},T=null,U()}function He(i){if(H=i,be.classList.toggle("map-round-btn--active",i),be.setAttribute("aria-pressed",String(i)),e.querySelector(".map-screen").classList.toggle("map-screen--measuring",i),!i){A=T=null,pe=!1,U(),de(se(),null);return}$e(),U()}be.addEventListener("click",()=>He(!H)),L?.setOnMapClick(i=>{H&&Ge(i)});function Ge(i){const l=ae(k,i);if(!l||l.offTrailM>qe){Me(`Тапните ближе к треку (сейчас ${K(l?.offTrailM??0)} от него).`);return}const y={alongM:l.alongM,point:l.point};!A||A&&T?(A=y,T=null):T=y,U()}Ae(({position:i})=>{H&&pe&&i&&Oe(i)});const ue=e.querySelector("#water-only-btn");ue.addEventListener("click",()=>{const i=ue.getAttribute("aria-pressed")!=="true";ue.setAttribute("aria-pressed",String(i)),ue.classList.toggle("map-fab--active",i),L?.setWaterOnly(i)}),e.querySelector("#gpx-btn").addEventListener("click",()=>{bn(wn({trail:v,itinerary:h,routes:s,waterList:w,accommodation:r}))}),L?(Q.addEventListener("click",()=>{$e(),Q.hidden=!0,ce.hidden=!1,L.playDemo(()=>{Q.hidden=!1,ce.hidden=!0})}),ce.addEventListener("click",()=>{L.stopDemo(),Q.hidden=!1,ce.hidden=!0})):Q.hidden=!0}const Ze=.15;function Je(e,t){return!e&&!t?"":` <a href="${t??`https://www.google.com/maps/search/?api=1&query=${e[1]},${e[0]}`}" target="_blank" rel="noopener">карта&nbsp;↗</a>`}function Gn(e,t,n,s,a,o){const c=t.allTrails,f=t.metrics.find(w=>w.source==="user_itinerary"),u=c?.distanceKm??f?.distanceKm,r=c?.ascentM??f?.ascentM,m=c?"AllTrails":"план",h=(w,S)=>w&&S?Math.abs(w-S)/S:0,v=a&&h(a.distanceKm,u)>Ze,M=a&&r&&h(a.ascentM,r)>Ze,k=o.map(w=>({m:w.alongM-a.startM,color:w.kind==="source"?"#00A3FF":"#2EC4B6"}));return`
    <div class="card">
      <h3>Route</h3>
      <p>${n?d(n.name):"?"} &rarr; ${s?d(s.name):"?"}</p>
      <div class="metric-grid">
        <div class="metric"><div class="metric__value">${String(u??"—").replace(".",",")} км</div><div class="metric__label">${m}</div></div>
        <div class="metric"><div class="metric__value">${r!=null?`+${r} м`:"—"}</div><div class="metric__label">набор, ${m}</div></div>
      </div>
      ${c?.links?.length?`<p>${c.links.map((w,S)=>`<a href="${w}" target="_blank" rel="noopener">AllTrails${c.links.length>1?` ${S+1}`:""}&nbsp;↗</a>`).join(" &middot; ")}</p>`:""}
      ${a?`
        <p style="font-size:0.75rem;">По нашему треку: ${R(a.distanceKm*1e3)} км, +${a.ascentM} / −${a.descentM} м, ${a.minEleM}–${a.maxEleM} м над уровнем моря${v||M?" — <strong>расходится с AllTrails больше чем на 15%, ориентируйтесь на AllTrails</strong>":""}.</p>
        ${vt(a.coordinates,{marks:k})}
        <p style="font-size:0.7rem;">Метки на профиле: <span style="color:#00A3FF">источники</span>, <span style="color:#2EC4B6">купить воду</span>.</p>
      `:""}
      ${t.variants?.length?t.variants.map(w=>`
        <p>${O(e,w.status)} <strong>${d(w.name)}</strong> — ${d(w.notes)}</p>
      `).join(""):""}
      ${t.notes?`<p><em>${d(t.notes)}</em></p>`:""}
    </div>`}function Wn(e,t){return t?e.length?`
    <div class="section-title">Вода на участке</div>
    <div class="card">
      <ul class="water-list">
        ${e.map(n=>`
          <li>
            <span class="water-list__km">${R(Math.max(0,n.alongM-t.startM))} км</span>
            <span class="water-list__name">${n.kind==="source"?"💧":"🛒"} ${d(n.name)}${n.kind==="source"?' <span style="color:var(--status-orange);font-size:0.72rem;">(может быть сухим)</span>':""}</span>
            <span class="water-list__off">${n.offTrailM>40?`${Math.round(n.offTrailM)} м от тропы`:"на тропе"}</span>
          </li>`).join("")}
      </ul>
      <p style="font-size:0.72rem;">💧 источник — в октябре может быть сухим, не рассчитывать как на единственный. 🛒 купить — магазин/кафе (надёжно, часы не проверены). Расстояние — от старта дня по тропе.</p>
    </div>`:'<div class="section-title">Вода на участке</div><div class="card"><p>Точек воды на участке не найдено — несите запас на весь день.</p></div>':""}async function Rn(e){const[t,n]=await Promise.all([Pe(),Ie()]);e.innerHTML=`
    <div class="screen-pad">
      ${ut()}
      <div class="section-title">Itinerary</div>
      ${n.map(s=>`
        <a href="#/itinerary/${s.id}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <div class="pill-row"><span class="pill">${d(s.date)}</span>${O(t,s.status)}</div>
          <h3>${d(s.title)}</h3>
          <p>${d(s.summary)}</p>
        </a>
      `).join("")}
    </div>
  `}async function Nn(e,{dayId:t}){const[n,s]=await Promise.all([Pe(),on(t)]);if(!s){e.innerHTML='<div class="screen-pad"><p>Day not found.</p></div>';return}const[a,o,c,f,u]=await Promise.all([rn(s.routeId),Promise.resolve(s.accommodationIds??[]),rt(),at(),it()]),r=(await ot()).filter(p=>s.accommodationIds?.includes(p.id)),[m,h]=await Promise.all([lt(),ct()]),v=yt(m),M=v.days.find(p=>p.dayId===s.id)??null,k=M?$t(v,{pois:h,water:f,food:c}).filter(p=>p.alongM>=M.startM-50&&p.alongM<=M.endM+50&&p.offTrailM<=1e3):[],w=c.filter(p=>s.foodIds?.includes(p.id)),S=f.waterPoints.filter(p=>s.waterIds?.includes(p.id)),F=u.filter(p=>s.transportIds?.includes(p.id));let j=null,g=null;a&&([j,g]=await Promise.all([Ne(a.fromPlaceId),Ne(a.toPlaceId)])),e.innerHTML=`
    <div class="screen-pad">
      <a href="#/itinerary" class="btn-secondary btn" style="margin-bottom:12px;display:inline-block;">&larr; All days</a>
      <div class="pill-row"><span class="pill">${d(s.date)}</span>${O(n,s.status)}</div>
      <h2 style="margin:6px 0;">${d(s.title)}</h2>
      <p>${d(s.summary)}</p>

      ${a?Gn(n,a,j,g,M,k):""}
      ${Wn(k,M)}

      ${s.tasks?.length?`<div class="section-title">Tasks</div><div class="card"><ul>${s.tasks.map(p=>`<li>${d(p)}</li>`).join("")}</ul></div>`:""}
      ${s.preTripTasks?.length?`<div class="section-title">Pre-trip tasks</div><div class="card"><ul>${s.preTripTasks.map(p=>`<li>${d(p)}</li>`).join("")}</ul></div>`:""}

      ${S.length?`<div class="section-title">Water</div>${S.map(p=>`
        <div class="card"><h3>${d(p.name)}</h3><p>${d(p.waterType)} &middot; ${d(p.status)} &middot; ${d(p.treatment)}</p><p>${d(p.notes)}</p></div>
      `).join("")}`:""}

      ${w.length?`<div class="section-title">Food</div>${w.map(p=>`
        <div class="card">${O(n,p.status)} <strong>${d(p.name)}</strong>${Je(p.coordinates,p.googleMapsUrl)} <p>${d(p.notes)}</p></div>
      `).join("")}`:""}

      ${r.length?`<div class="section-title">Sleep</div>${r.map(p=>`
        <div class="card">${O(n,p.status)} <strong>${d(p.name)}</strong>${p.booked?' <span class="pill">забронировано</span>':""}${Je(p.coordinates,p.googleMapsUrl)}
          ${p.address?`<p>${d(p.address)}</p>`:""}
          ${p.phone?`<p><a href="tel:${p.phone.replace(/\s/g,"")}">${d(p.phone)}</a></p>`:""}
          ${p.checkIn?`<p>Заезд: ${d(p.checkIn)} &middot; Выезд: ${d(p.checkOut??"")}</p>`:""}
          <p>${d(p.priceInfo)}</p><p>${d(p.notes)}</p></div>
      `).join("")}`:""}

      ${F.length?`<div class="section-title">Transport</div>${F.map(p=>`
        <div class="card">${O(n,p.status)} <strong>${d(p.name)}</strong>
          ${(p.details?.segments??(p.details?.flightNo?[p.details]:[])).map(P=>`<p><strong>${d(P.flightNo)}</strong> ${d(P.from)} ${d(P.depart)} → ${d(P.to)} ${d(P.arrive)}</p>`).join("")}
          <p>${d(p.notes)}</p></div>
      `).join("")}`:""}

      ${s.highlights?.length?`<div class="section-title">Highlights</div><div class="card"><ul>${s.highlights.map(p=>`<li>${d(p)}</li>`).join("")}</ul></div>`:""}
      ${s.watchOut?.length?`<div class="section-title">Watch out</div><ul class="warn-list">${s.watchOut.map(p=>`<li>${d(p)}</li>`).join("")}</ul>`:""}
      ${s.backupPlan?`<div class="section-title">Backup plan</div><div class="card">${d(s.backupPlan)}</div>`:""}
      ${s.notes?`<p style="color:var(--text-dim);font-size:0.8rem;">${d(s.notes)}</p>`:""}
    </div>
  `}const zn=[["#/itinerary","Itinerary","Day-by-day plan, 8–18 Oct"],["#/emergency","Emergency","112, GPS, bailout info"]],Dn=["before-we-leave","turkish-phrases","hiker-reports"];async function bt(e){const[t,n,s,a]=await Promise.all([Rt(),Nt(),Ye(),Promise.all(Dn.map(r=>dt(r).then(m=>[r,m])))]);e.innerHTML=`
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
        <p id="map-offline-status">${n?"✓ Карта скачана — работает без интернета.":s?`Размер загрузки: <strong>${ke(s.totalBytes)}</strong> (${s.files.length} файлов).`:"Нужен интернет, чтобы узнать размер и скачать."}</p>
        <div class="progress" id="map-progress" hidden><div class="progress__bar" id="map-progress-bar"></div></div>
        <div class="link-row">
          <button class="btn" id="map-download-btn" ${s?"":"disabled"}>${n?"Обновить карту":"Скачать карту маршрута"}</button>
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
      ${zn.map(([r,m,h])=>`
        <a href="${r}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${d(m)}</h3>
          <p>${d(h)}</p>
        </a>
      `).join("")}

      <div class="section-title">Field guide</div>
      <p style="color:var(--text-dim);font-size:0.78rem;margin-top:-4px;">Water, food, sleep, transport, safety, and places to see now live as markers on the Map tab — tap a pin for details.</p>
      ${a.map(([r,m])=>`
        <a href="#/knowledge/${r}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${d(m.meta.title??r)}</h3>
          <p>Confidence: ${d(m.meta.confidence??"?")} &middot; last verified ${d(m.meta.lastVerified??"?")}</p>
        </a>
      `).join("")}
    </div>
  `;const o=e.querySelector("#map-download-btn"),c=e.querySelector("#map-offline-status"),f=e.querySelector("#map-progress"),u=e.querySelector("#map-progress-bar");o.addEventListener("click",async()=>{if(s){o.disabled=!0,f.hidden=!1;try{await zt((r,m)=>{const h=Math.min(100,Math.round(r/m*100));u.style.width=`${h}%`,c.textContent=`Загрузка: ${ke(r)} из ${ke(m)} (${h}%)`}),u.style.width="100%",c.textContent="✓ Карта скачана — работает без интернета.",o.textContent="Обновить карту"}catch(r){console.warn(r),c.textContent=`Не получилось: ${r.message}. Проверьте интернет и попробуйте ещё раз.`}finally{o.disabled=!1}}}),e.querySelector("#map-delete-btn")?.addEventListener("click",async()=>{await Dt(),bt(e)}),e.querySelector("#save-offline-btn").addEventListener("click",async r=>{const m=r.currentTarget;m.disabled=!0,m.textContent="Saving…";try{await Wt((h,v)=>m.textContent=`Saving ${h}/${v}…`),e.querySelector("#offline-status").textContent="Trip data saved for offline use.",m.textContent="Saved"}catch(h){m.textContent="Save failed — retry",m.disabled=!1,console.error(h)}})}function Un(e){const t=e.split(`
`);let n="",s=0;for(;s<t.length;){const a=t[s];if(/^\s*$/.test(a)){s++;continue}if(a.startsWith("# ")){n+=`<h2>${oe(a.slice(2))}</h2>`,s++;continue}if(a.startsWith("## ")){n+=`<h3>${oe(a.slice(3))}</h3>`,s++;continue}if(a.startsWith("**")&&a.match(/^\*\*.+\*\*/),a.startsWith("|")){const c=[];for(;s<t.length&&t[s].startsWith("|");)c.push(t[s]),s++;n+=Kn(c);continue}if(a.startsWith("- ")){const c=[];for(;s<t.length&&t[s].startsWith("- ");)c.push(t[s].slice(2)),s++;n+=`<ul>${c.map(f=>`<li>${oe(f)}</li>`).join("")}</ul>`;continue}const o=[];for(;s<t.length&&!/^\s*$/.test(t[s])&&!t[s].startsWith("|")&&!t[s].startsWith("- ")&&!t[s].startsWith("#");)o.push(t[s]),s++;n+=`<p>${oe(o.join(" "))}</p>`}return n}function Kn(e){e.filter(o=>!/^\|[\s-]+\|$/.test((o.replace(/[^|\s-]/g,""),o)));const n=e.filter(o=>!/^\|(\s*-+\s*\|)+$/.test(o)).map(o=>o.split("|").slice(1,-1).map(c=>c.trim()));if(!n.length)return"";const[s,...a]=n;return`<table class="phrases">
    <tbody>
      ${a.map(o=>`<tr>${o.map(c=>`<td>${oe(c)}</td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>`}function oe(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\[(.+?)\]\((.+?)\)/g,(t,n,s)=>{const a=s.endsWith(".md");return`<a href="${a?`#/knowledge/${s.replace(/\.md$/,"")}`:s}"${a?"":' target="_blank" rel="noopener"'}>${n}</a>`})}async function Xn(e,{slug:t}){const n=await dt(t);e.innerHTML=`
    <div class="screen-pad">
      <a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge base</a>
      <h2>${d(n.meta.title??t)}</h2>
      <p style="color:var(--text-dim);font-size:0.8rem;">Confidence: ${d(n.meta.confidence??"?")} &middot; last verified ${d(n.meta.lastVerified??"?")}</p>
      <div class="card">${Un(n.body)}</div>
    </div>
  `}async function Vn(e){e.innerHTML=`
    <div class="screen-pad">
      ${ut()}
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
  `;const t=e.querySelector("#emergency-gps");Ae(({position:n,error:s})=>{n?t.innerHTML=`
        <p>${n.lat.toFixed(5)}, ${n.lon.toFixed(5)}</p>
        <p>Accuracy: ±${Math.round(n.accuracy)} m</p>
        <div class="link-row">
          <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${n.lat},${n.lon}">Open in Google Maps</a>
        </div>
      `:s&&(t.innerHTML=`<p>${d(s.message)}</p>`)}),gt()}document.getElementById("app").innerHTML=`
  <header class="app-header">
    <div class="app-header__brand">Lycian Way 2026</div>
    <div class="segmented" role="tablist">
      <button class="segmented__btn" data-view="map" role="tab">Map</button>
      <button class="segmented__btn" data-view="kb" role="tab">Knowledge Base</button>
    </div>
  </header>
  <div id="screen"></div>
`;Y("#/map",Hn);Y("#/itinerary",Rn);Y("#/itinerary/:dayId",Nn);Y("#/knowledge",bt);Y("#/knowledge/:slug",Xn);Y("#/emergency",Vn);const Mt=document.querySelectorAll(".segmented__btn");Mt.forEach(e=>{e.addEventListener("click",()=>{location.hash=e.dataset.view==="map"?"#/map":"#/knowledge"})});Kt(e=>{const t=e==="#/map"||e==="";document.getElementById("screen").classList.toggle("screen--full-bleed",t),Mt.forEach(n=>n.classList.toggle("segmented__btn--active",n.dataset.view==="map"===t))});Bt();Vt();export{Yt as _,Zn as a,un as b,fe as g,Jn as o,Se as p,pt as s,Yn as t,Qn as u};
//# sourceMappingURL=index-C96k1_3O.js.map
