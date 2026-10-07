(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const it="lycian-2026-lang";function Zt(){try{return localStorage.getItem(it)==="ru"?"ru":"en"}catch{return"en"}}const N=Zt();document.documentElement.lang=N;function a(e,t){return N==="ru"?t:e}function Vt(e){try{localStorage.setItem(it,e)}catch{}location.reload()}const Xt={"Ксанфа руины":"Xanthos ruins","Летоон руины":"Letoon ruins","Село. Магазин, отель":"Village: shop, hotel","Село. Кафе, магазин, отель":"Village: café, shop, hotel","Развилка - спуск к деревне или траверсом в обход":"Fork: down to the village or traverse around","Село. Магазин, кемпинги, кафе, отели":"Village: shop, camps, cafés, hotels","Тропа к долине Бабочек":"Path to Butterfly Valley","Пляж в Долине Бабочек":"Butterfly Valley beach","Село. Кафе, отели":"Village: cafés, hotels","Село. Кафе":"Village: café","Тропа к Олюденизу":"Path to Ölüdeniz","Олюдениз. Есть всё":"Ölüdeniz: everything","Старт/финиш западной части тропы":"Start/finish of the western Lycian Way"};function da(e){return N==="ru"?e:Xt[e]??e}const Pe="lycian-2026-v2",U="lycian-map-v1";function Yt(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/lycian-way-2026/sw.js").catch(e=>console.warn("SW registration failed",e))})}const Jt=["config","trip","itinerary","routes","places","water","accommodation","food","fuel","transport","alerts","attractions","sources","changelog","trail","pois"],Qt=["before-we-leave","water","food","fuel","sleep","transport","route-decisions","safety","ancient-lycia","turkish-phrases","hiker-reports"];function en(){const e=new Set;return document.querySelectorAll("script[src]").forEach(t=>e.add(t.src)),document.querySelectorAll('link[rel="stylesheet"], link[rel="modulepreload"]').forEach(t=>e.add(t.href)),document.querySelectorAll('link[rel="icon"], link[rel="manifest"]').forEach(t=>e.add(t.href)),[...e].filter(t=>t.startsWith(location.origin))}async function tn(e){if(!("caches"in window))throw new Error("Cache API not supported in this browser.");const t="/lycian-way-2026/",n=[location.origin+t,`${t}index.html`,`${t}manifest.webmanifest`,`${t}vendor/maplibre-gl-worker.mjs`,`${t}vendor/maplibre-gl-shared.mjs`,...en(),...Jt.map(r=>`${t}data/${r}.json`),...Qt.map(r=>`${t}content/knowledge/${r}.md`)];navigator.serviceWorker?.controller?.postMessage({type:"precache"});const o=await caches.open(Pe);let s=0;for(const r of n){try{const d=await fetch(r,{cache:"reload"});d.ok&&await o.put(r,d)}catch(d){console.warn(`Could not cache ${r}`,d)}s+=1,e?.(s,n.length)}return{cached:s,total:n.length}}async function nn(){return!("caches"in window)||!await caches.has(Pe)?!1:!!await(await caches.open(Pe)).match("/lycian-way-2026/data/trail.json")}function J(e){return`${location.origin}/lycian-way-2026/offline/${e.split("/").map(encodeURIComponent).join("/")}`}async function lt(){const e=J("manifest.json");try{const t=await fetch(e,{cache:"no-cache"});if(t.ok)return await t.json()}catch{}if("caches"in window){const t=await(await caches.open(U)).match(e);if(t)return t.json()}return null}async function an(){if(!("caches"in window)||!await caches.has(U))return!1;const e=await caches.open(U),t=await e.match(J("manifest.json"));if(!t)return!1;const{files:n}=await t.json();for(const o of n)if(!await e.match(J(o.path)))return!1;return!0}async function on(e){if(!("caches"in window))throw new Error(a("This browser has no offline cache.","Этот браузер не поддерживает офлайн-кэш."));const t=await lt();if(!t)throw new Error(a("Couldn't get the map file list — needs internet.","Не удалось получить список файлов карты — нужен интернет."));const n=await caches.open(U);let o=0;for(const s of t.files){const r=J(s.path),d=await fetch(r,{cache:"no-cache"});if(!d.ok||!d.body)throw new Error(`${a("Download error","Ошибка загрузки")} ${s.path}: ${d.status}`);const h=d.body.getReader(),f=[];let i=0;for(;;){const{done:m,value:g}=await h.read();if(m)break;f.push(g),i+=g.length,e?.(o+i,t.totalBytes)}o+=s.bytes,await n.put(r,new Response(new Blob(f),{headers:{"Content-Type":d.headers.get("Content-Type")??"application/octet-stream"}})),e?.(o,t.totalBytes)}return await n.put(J("manifest.json"),new Response(JSON.stringify(t),{headers:{"Content-Type":"application/json"}})),t}async function sn(){"caches"in window&&await caches.delete(U)}async function pa(){if(!("caches"in window)||!await caches.has(U))return null;const e=await(await caches.open(U)).match(J("corridor.pmtiles"));return e?new File([await e.blob()],"corridor.pmtiles"):null}function ua(){return`${location.origin}/lycian-way-2026/offline/`}function Te(e){if(e<1024*1024)return`${Math.round(e/1024)} ${a("KB","КБ")}`;const t=(e/1024/1024).toFixed(1);return`${N==="ru"?t.replace(".",","):t} ${a("MB","МБ")}`}const ct=[];let dt=null;const rn="#/map";function ee(e,t){const n=[],o=e.replace(/:([\w]+)/g,(r,d)=>(n.push(d),"([^/]+)")),s=new RegExp(`^${o}$`);ct.push({regex:s,paramNames:n,render:t})}function ln(e){dt=e}function cn(e){for(const t of ct){const n=e.match(t.regex);if(n){const o={};return t.paramNames.forEach((s,r)=>o[s]=decodeURIComponent(n[r+1])),{render:t.render,params:o}}}return null}async function Ze(){const e=document.getElementById("screen"),t=location.hash||rn,n=cn(t);if(dt?.(t),!n){e.innerHTML='<div class="screen-pad"><p>Not found.</p></div>';return}try{await n.render(e,n.params)}catch(o){console.error(o),e.innerHTML='<div class="screen-pad"><p>Something went wrong loading this screen.</p></div>'}}function dn(){window.addEventListener("hashchange",Ze),Ze()}const pn="modulepreload",un=function(e){return"/lycian-way-2026/"+e},Ve={},fn=function(t,n,o){let s=Promise.resolve();if(n&&n.length>0){let d=function(i){return Promise.all(i.map(m=>Promise.resolve(m).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};document.getElementsByTagName("link");const h=document.querySelector("meta[property=csp-nonce]"),f=h?.nonce||h?.getAttribute("nonce");s=d(n.map(i=>{if(i=un(i),i in Ve)return;Ve[i]=!0;const m=i.endsWith(".css"),g=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${g}`))return;const w=document.createElement("link");if(w.rel=m?"stylesheet":pn,m||(w.as="script"),w.crossOrigin="",w.href=i,f&&w.setAttribute("nonce",f),document.head.appendChild(w),m)return new Promise((M,k)=>{w.addEventListener("load",M),w.addEventListener("error",()=>k(new Error(`Unable to preload CSS for ${i}`)))})}))}function r(d){const h=new Event("vite:preloadError",{cancelable:!0});if(h.payload=d,window.dispatchEvent(h),!h.defaultPrevented)throw d}return s.then(d=>{for(const h of d||[])h.status==="rejected"&&r(h.reason);return t().catch(r)})},X=new Map;function pt(){return"/lycian-way-2026/"}async function I(e){if(X.has(e))return X.get(e);const t=await fetch(`${pt()}data/${e}.json`);if(!t.ok)throw new Error(`Failed to load data/${e}.json: ${t.status}`);const n=await t.json();return X.set(e,n),n}const je=()=>I("config").then(e=>e),Ge=()=>I("itinerary").then(e=>e.days),ut=()=>I("routes").then(e=>e.routes),ft=()=>I("places").then(e=>e.places),ht=()=>I("water"),mt=()=>I("accommodation").then(e=>e.accommodations),gt=()=>I("food").then(e=>e.foodPlaces),hn=()=>I("fuel"),$t=()=>I("transport").then(e=>e.transportLegs),mn=()=>I("alerts").then(e=>e.alerts),gn=()=>I("attractions").then(e=>e.attractions),$n=()=>I("sources").then(e=>e.sources),yt=()=>I("trail"),wt=()=>I("pois"),yn=$n().then(e=>{const t=new Map;for(const n of e)t.set(n.id,n);return t}),wn=async e=>(await yn).get(e);async function vn(e){return(await Ge()).find(n=>n.id===e)}async function bn(e){return e?(await ut()).find(n=>n.id===e):null}async function Xe(e){return e?(await ft()).find(n=>n.id===e):null}async function vt(e){const t=`knowledge:${e}`;if(X.has(t))return X.get(t);const n=await fetch(`${pt()}content/knowledge/${e}.md`);if(!n.ok)throw new Error(`Failed to load knowledge/${e}.md: ${n.status}`);const o=await n.text(),s=Mn(o);return X.set(t,s),s}function Mn(e){const t=e.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);if(!t)return{meta:{},body:e};const[,n,o]=t,s={};for(const r of n.split(`
`)){const d=r.match(/^(\w+):\s*(.*)$/);if(!d)continue;const[,h,f]=d;f.startsWith("[")&&f.endsWith("]")?s[h]=f.slice(1,-1).split(",").map(i=>i.trim()).filter(Boolean):s[h]=f.trim()}return{meta:s,body:o.trim()}}const Ye={neutral:"#AAAAAA",orange:"#FF8800",yellow:"#FFEE00",red:"#FF0000"};function kn(e,t){return e?.status?.[t]?.color??Ye[t]??Ye.neutral}const Je='<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 2.5 1.5 21h21L12 2.5Z" fill="#FFC400" stroke="#000" stroke-width="1" stroke-linejoin="round"/><path d="M11 9h2v6h-2zM11 16.5h2v2h-2z" fill="#000"/></svg>',Sn='<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="#E53935"/><rect x="6" y="10.5" width="12" height="3" rx="1" fill="#fff"/></svg>';function H(e,t){return t==="red"?`<span class="status-chip status-chip--red">${Sn}${a("Closed","Закрыто")}</span>`:t==="orange"?`<span class="status-chip status-chip--warn">${Je}${a("Unverified","Не проверено")}</span>`:t==="yellow"?`<span class="status-chip status-chip--warn">${Je}${a("Partly an issue","Частично проблема")}</span>`:""}function bt(){return`<a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; ${a("Knowledge Base","База знаний")}</a>`}function u(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function _n([e,t],[n,o]){const r=t*Math.PI/180,d=o*Math.PI/180,h=(o-t)*Math.PI/180,f=(n-e)*Math.PI/180,i=Math.sin(h/2)**2+Math.cos(r)*Math.cos(d)*Math.sin(f/2)**2;return 2*6371e3*Math.asin(Math.sqrt(i))}function K(e){const t=[0];for(let n=1;n<e.length;n++)t.push(t[n-1]+_n(e[n-1],e[n]));return t}function fa(e){const t=K(e);return t[t.length-1]??0}function Mt(e,t){if(t.length<2)return null;const n=K(t);let o=null;for(let s=0;s<t.length-1;s++){const r=t[s],d=t[s+1],{t:h,pt:f,dist:i}=xn(e,r,d),m=n[s]+h*(n[s+1]-n[s]);(!o||i<o.distanceFrom)&&(o={distanceAlong:m,distanceFrom:i,pointOnLine:f,segmentIndex:s})}return o}function xn(e,t,n){const o=(t[1]+n[1])/2*(Math.PI/180),s=([j,S])=>[j*Math.cos(o)*111320,S*111320],[r,d]=s(e),[h,f]=s(t),[i,m]=s(n),g=i-h,w=m-f;let M=g===0&&w===0?0:((r-h)*g+(d-f)*w)/(g*g+w*w);M=Math.max(0,Math.min(1,M));const k=h+M*g,v=f+M*w,x=Math.hypot(r-k,d-v),q=[t[0]+M*(n[0]-t[0]),t[1]+M*(n[1]-t[1])];return{t:M,pt:q,dist:x}}function Ee(e,t){const n=K(e),o=n[n.length-1],s=Math.max(0,Math.min(o,t));for(let r=0;r<n.length-1;r++)if(s>=n[r]&&s<=n[r+1]){const d=n[r+1]-n[r],h=d===0?0:(s-n[r])/d,f=e[r],i=e[r+1];return[f[0]+h*(i[0]-f[0]),f[1]+h*(i[1]-f[1])]}return e[e.length-1]}function Ln(e,t){const n=K(e),o=n[n.length-1];if(t<=0)return{before:[],after:e};if(t>=o)return{before:e,after:[]};const s=Ee(e,t);let r=0;for(let f=0;f<n.length-1;f++)if(t>=n[f]&&t<=n[f+1]){r=f;break}const d=[...e.slice(0,r+1),s],h=[s,...e.slice(r+1)];return{before:d,after:h}}const kt="lycian-2026-trail-progress-m",An=300;function ge(){try{const e=localStorage.getItem(kt);return e?Number(e):0}catch{return 0}}function Tn(e){try{localStorage.setItem(kt,String(e))}catch{}}function ha(e,t){if(!e||t.length<2)return ge();const n=Mt(e,t);if(!n||n.distanceFrom>An)return ge();const o=ge();return n.distanceAlong>o?(Tn(n.distanceAlong),n.distanceAlong):o}function Pn(e){const t={west:180,south:90,east:-180,north:-90};for(const[n,o]of e)t.west=Math.min(t.west,n),t.east=Math.max(t.east,n),t.south=Math.min(t.south,o),t.north=Math.max(t.north,o);return t}function En(e,[t,n],o,s,r){return[r+(t-e.west)/(e.east-e.west)*(o-2*r),r+(1-(n-e.south)/(e.north-e.south))*(s-2*r)]}function Qe(e,t,n=3){return e.length<2?"":`<path d="${e.map((s,r)=>`${r===0?"M":"L"}${s[0].toFixed(1)},${s[1].toFixed(1)}`).join(" ")}" fill="none" stroke="${t}" stroke-width="${n}" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`}function Cn(e,{config:t,places:n,master:o,waterList:s,gpsPosition:r}){const i=Pn(o.coords),m=S=>En(i,S,400,640,30),g=t.routeProgress?.untraveled??"#AAAAAA",w=t.routeProgress?.traveled??"#00FF80";let M=Qe(o.coords.map(m),g);const{before:k}=Ln(o.coords,ge());k.length>=2&&(M+=Qe(k.map(m),w));const v=([S,p])=>S>=i.west-.02&&S<=i.east+.02&&p>=i.south-.02&&p<=i.north+.02,x=n.filter(S=>v(S.coordinates)).map(S=>{const[p,A]=m(S.coordinates);return`<circle cx="${p}" cy="${A}" r="5" fill="${kn(t,S.status)}" stroke="#0e1613" stroke-width="1.5"/>
      <text x="${p+8}" y="${A+4}" font-size="10" fill="#eef2ee">${u(S.name)}</text>`}).join(""),q=s.filter(S=>S.kind==="source").map(S=>{const[p,A]=m(S.coordinates);return`<circle cx="${p}" cy="${A}" r="3.5" fill="#00A3FF" stroke="#0e1613" stroke-width="1"/>`}).join(""),j=r&&v([r.lon,r.lat])?(()=>{const[S,p]=m([r.lon,r.lat]);return`<circle cx="${S}" cy="${p}" r="7" fill="${t.gps?.markerColor??"#1A73E8"}" opacity="0.9"/>`})():"";e.innerHTML=`
    <svg viewBox="0 0 400 640" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;background:#182420;">
      ${M}${q}${x}${j}
    </svg>
  `}let ie=null,Y=null;const Ce=new Set;let Q=null,z=null,Ie=null,St=7e3;function In({updateIntervalSeconds:e}={}){e&&(St=e*1e3)}function Be(e){return Ce.add(e),(Q||z)&&e({position:Q,error:z}),()=>Ce.delete(e)}function Oe(){for(const e of Ce)e({position:Q,error:z})}function et(){Ie&&(Q=Ie,z=null,Oe()),Y=null}function _t(){if(ie===null){if(z=null,!("geolocation"in navigator)){z={code:"unsupported",message:"Geolocation not supported in this browser."},Oe();return}ie=navigator.geolocation.watchPosition(e=>{Ie={lat:e.coords.latitude,lon:e.coords.longitude,accuracy:e.coords.accuracy,heading:typeof e.coords.heading=="number"&&!Number.isNaN(e.coords.heading)?e.coords.heading:null,timestamp:e.timestamp},Q||et(),Y===null&&(Y=setTimeout(et,St))},e=>{z={code:e.code,message:e.message},Oe()},{enableHighAccuracy:!0,maximumAge:5e3,timeout:15e3})}}function Bn(){ie!==null&&(navigator.geolocation.clearWatch(ie),ie=null),Y!==null&&(clearTimeout(Y),Y=null)}function oe(){return Q}function $e(e){return String(e??"").replace(/[<>&'"]/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"})[t])}function tt([e,t],n,o,s){return`  <wpt lat="${t}" lon="${e}"><name>${$e(n)}</name>${o?`<desc>${$e(o)}</desc>`:""}${s?`<sym>${s}</sym>`:""}</wpt>`}function On({trail:e,itinerary:t,routes:n,waterList:o,accommodation:s}){const r=new Map(t.map(i=>[i.id,i])),d=new Map(n.map(i=>[i.dayId,i])),h=[];for(const i of o){const m=i.kind==="source"?a("Water: spring/tap","Вода: источник"):a("Water: buy","Вода: купить"),g=i.kind==="source"?a("May be dry in October — not your only source","В октябре может быть сухим — не рассчитывать как на единственный"):i.osmType??"";h.push(tt(i.coordinates,`${m} — ${i.name}`,g,i.kind==="source"?"Drinking Water":"Shopping Center"))}for(const i of s){if(!i.coordinates||i.status==="red")continue;const m=[i.priceInfo,i.address,i.phone,i.checkIn&&`Check-in ${i.checkIn}`].filter(Boolean).join(" · ");h.push(tt(i.coordinates,`${a("Sleep","Ночёвка")}: ${i.name}`,m,i.type==="hotel"?"Lodging":"Campground"))}const f=e.days.map(i=>{const m=r.get(i.dayId),g=d.get(i.dayId),w=`${m?.date??i.dayId} ${g?.name??`${i.from} → ${i.to}`}`,M=i.coordinates.map(([k,v,x])=>`      <trkpt lat="${v}" lon="${k}"><ele>${x}</ele></trkpt>`).join(`
`);return`  <trk><name>${$e(w)}</name><desc>${$e(`${i.distanceKm} km, +${i.ascentM}/-${i.descentM} m (track)`)}</desc><trkseg>
${M}
    </trkseg></trk>`});return`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Lycian Way 2026" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>Lycian Way 2026 — Ovacık → Xanthos</name><desc>Cleaned track (source: trekkingmania 2024 GPX), water and lodging points. Map data © OpenStreetMap contributors.</desc></metadata>
${h.join(`
`)}
${f.join(`
`)}
</gpx>`}function Fn(e,t="lycian-way-2026.gpx"){const n=new Blob([e],{type:"application/gpx+xml"}),o=URL.createObjectURL(n),s=document.createElement("a");s.href=o,s.download=t,document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(o),1e3)}const ye="lycian-2026-checklist-";function qn(e){try{const t=localStorage.getItem(ye+e);return t?JSON.parse(t):null}catch{return null}}function ce(e,t){try{localStorage.setItem(ye+e,JSON.stringify(t))}catch{}}let Fe=1;function jn(e){try{return new Set(JSON.parse(localStorage.getItem(`${ye}${e}-seeded`)??"null")??[])}catch{return null}}function nt(e,t){try{localStorage.setItem(`${ye}${e}-seeded`,JSON.stringify([...t]))}catch{}}function we(e){const t=[...e.preTripTasks??[],...e.tasks??[]];let n=qn(e.id);if(!n)return n=t.map(r=>({id:`seed-${Fe++}`,text:r,done:!1})),ce(e.id,n),nt(e.id,new Set(t)),n;const o=jn(e.id)??new Set(n.map(r=>r.text)),s=t.filter(r=>!o.has(r)&&!n.some(d=>d.text===r));return s.length&&(n.push(...s.map(r=>({id:`seed-${Date.now()}-${Fe++}`,text:r,done:!1}))),ce(e.id,n)),t.forEach(r=>o.add(r)),nt(e.id,o),n}function Gn(e,t){const n=we(e);return n.push({id:`custom-${Date.now()}-${Fe++}`,text:t,done:!1}),ce(e.id,n),n}function Wn(e,t){const n=we(e),o=n.find(s=>s.id===t);return o&&(o.done=!o.done),ce(e.id,n),n}function Hn(e){const t=we(e).filter(n=>!n.done);return ce(e.id,t),t}function xt(e){const t=[],n=[],o=[];for(const r of e.days){const d=r.coordinates,h=t.length>0,f=h?t.length-1:0;for(let i=h?1:0;i<d.length;i++)t.push([d[i][0],d[i][1]]),n.push(d[i][2]);o.push({...r,startIdx:f,endIdx:t.length-1})}const s=K(t);for(const r of o)r.startM=s[r.startIdx],r.endM=s[r.endIdx];return{coords:t,ele:n,cum:s,days:o}}function Nn(e,t){return e.days.find(n=>t>=n.startM-1&&t<=n.endM+1)??null}function se(e,[t,n]){const o=Mt([t,n],e.coords);return o?{alongM:o.distanceAlong,offTrailM:o.distanceFrom,point:o.pointOnLine,day:Nn(e,o.distanceAlong)}:null}function Lt(e,{pois:t,water:n,food:o}){const s=[],r=[],d=f=>r.some(i=>Math.abs(i[0]-f[0])<8e-4&&Math.abs(i[1]-f[1])<8e-4),h=f=>{const i=se(e,f.coordinates);i&&(s.push({...f,alongM:i.alongM,offTrailM:i.offTrailM}),r.push(f.coordinates))};for(const f of n?.waterPoints??[])h({id:f.id,kind:"source",name:f.name,coordinates:f.coordinates,osmType:f.waterType,notes:f.notes,curated:!0});for(const f of o??[])f.coordinates&&h({id:f.id,kind:"buy",name:f.name,coordinates:f.coordinates,osmType:f.category,curated:!0});for(const f of t?.water??[])d(f.coordinates)||h(f);for(const f of t?.buy??[])d(f.coordinates)||h(f);return s.sort((f,i)=>f.alongM-i.alongM)}function at(e,t,n){return e.find(o=>o.alongM>t+20&&(!n||o.kind===n))??null}function Rn(e){let t=0;for(let n=1;n<e.length;n++){const o=e[n-1],s=e[n],r=K([[o[0],o[1]],[s[0],s[1]]])[1];if(r<.5)continue;const d=(s[2]-o[2])/r,h=6*Math.exp(-3.5*Math.abs(d+.05));t+=r/1e3/h}return t}function Dn(e,t=8){const n=e.map(h=>h[2]),o=n.map((h,f)=>{const i=n.slice(Math.max(0,f-1),f+2);return i.reduce((m,g)=>m+g,0)/i.length});let s=0,r=0,d=o[0];for(const h of o)h-d>=t?(s+=h-d,d=h):d-h>=t&&(r+=d-h,d=h);return{ascentM:Math.round(s),descentM:Math.round(r)}}function At(e){const t=e/1e3,n=t<10?t.toFixed(1):String(Math.round(t));return N==="ru"?n.replace(".",","):n}function C(e){return e<1e3?`${Math.round(e/10)*10} ${a("m","м")}`:`${At(e)} ${a("km","км")}`}function zn(e){const t=Math.floor(e),n=Math.round((e-t)*60);return t?`${t} ${a("h","ч")} ${String(n).padStart(2,"0")} ${a("min","мин")}`:`${n} ${a("min","мин")}`}function Tt(e,{width:t=320,height:n=90,marks:o=[],color:s="#4BD947"}={}){if(!e||e.length<2)return"";const r=K(e.map(p=>[p[0],p[1]])),d=r.at(-1)||1,h=e.map(p=>p[2]),f=Math.min(...h),i=Math.max(...h),m=8,g=16,w=30,M=Math.max(20,i-f),k=p=>w+p/d*(t-w-4),v=p=>m+(1-(p-f)/M)*(n-m-g),x=e.map((p,A)=>`${A?"L":"M"}${k(r[A]).toFixed(1)},${v(p[2]).toFixed(1)}`).join(" "),q=`${x} L${k(d).toFixed(1)},${n-g} L${w},${n-g} Z`,j=o.map(p=>{const A=k(Math.max(0,Math.min(d,p.m)));return`<line x1="${A}" x2="${A}" y1="${m}" y2="${n-g}" stroke="${p.color??"#00A3FF"}" stroke-width="1.5" stroke-dasharray="2 2"/>`}).join(""),S=`pg${Math.random().toString(36).slice(2,8)}`;return`<svg class="profile-svg" viewBox="0 0 ${t} ${n}" width="100%" role="img" aria-label="${a("Elevation profile","Профиль высот")}">
    <defs><linearGradient id="${S}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${s}" stop-opacity="0.45"/><stop offset="1" stop-color="#000" stop-opacity="0.1"/></linearGradient></defs>
    <path d="${q}" fill="url(#${S})"/>
    <path d="${x}" fill="none" stroke="${s}" stroke-width="2"/>
    ${j}
    <text x="2" y="${m+8}" font-size="9" fill="currentColor">${Math.round(i)} ${a("m","м")}</text>
    <text x="2" y="${n-g}" font-size="9" fill="currentColor">${Math.round(f)} ${a("m","м")}</text>
    <text x="${w}" y="${n-3}" font-size="9" fill="currentColor">0</text>
    <text x="${t-4}" y="${n-3}" font-size="9" fill="currentColor" text-anchor="end">${At(d)} ${a("km","км")}</text>
  </svg>`}const Un={place:a("Waypoint","Точка"),source:a("Water: spring/tap","Вода: источник"),buy:a("Water: buy","Вода: купить"),food:a("Food / resupply","Еда / магазин"),sleep:a("Sleep","Ночёвка"),transport:a("Transport","Транспорт"),attraction:a("Place to see","Достопримечательность"),hazard:a("Watch out","Внимание"),fuel:a("Gas","Газ"),gpx:a("GPX waypoint","Точка из GPX")},Pt="lycian-2026-gps-on",ot=100,Kn=5e3;function Zn(e,t){const n=new Date().toISOString().slice(0,10),o=t.trip.startDate,s=t.trip.endDate;return n<o?e[0]:n>s?e[e.length-1]:e.find(r=>r.date===n)??e[0]}function Vn(e){return"orange"}function Xn(){try{return localStorage.getItem(Pt)==="1"}catch{return!1}}function Yn(e){try{localStorage.setItem(Pt,e?"1":"0")}catch{}}const Jn=a(`
  <p><strong>Location access is blocked.</strong> To turn it on:</p>
  <p><strong>iPhone (Safari or home-screen icon):</strong> Settings → Privacy &amp; Security → Location Services → on; below, "Safari Websites" → "While Using the App". Then in Safari: "aA" in the address bar → Website Settings → Location → Allow. Reload the page.</p>
  <p><strong>Android (Chrome):</strong> pull down the quick settings and turn on Location. In Chrome: ⋮ → Settings → Site settings → Location → allow jlazdes.github.io (or the lock icon left of the address → Permissions → Location). Reload the page.</p>
  <p style="color:var(--text-dim);font-size:0.75rem;">GPS works without internet — it only needs location access.</p>
`,`
  <p><strong>Доступ к геолокации запрещён.</strong> Как включить:</p>
  <p><strong>iPhone (Safari или иконка на главном экране):</strong> Настройки → Конфиденциальность и безопасность → Службы геолокации → включить; ниже «Сайты Safari» → «При использовании». Затем в Safari: «аА» в адресной строке → Настройки веб-сайта → Геопозиция → Разрешить. Перезагрузите страницу.</p>
  <p><strong>Android (Chrome):</strong> опустите шторку и включите «Местоположение». В Chrome: ⋮ → Настройки → Настройки сайтов → Геоданные → разрешить для jlazdes.github.io (или значок замка слева от адреса → Разрешения → Геоданные). Перезагрузите страницу.</p>
  <p style="color:var(--text-dim);font-size:0.75rem;">GPS работает и без интернета — нужен только доступ к геолокации.</p>
`);async function Qn(e){const[t,n,o,s,r,d,h,f,i,m,g,w,M]=await Promise.all([je(),ft(),ut(),ht(),gn(),mn(),gt(),hn(),mt(),$t(),Ge(),yt(),wt()]);In(t.gps);const k=xt(w),v=Lt(k,{pois:M,water:s,food:h}),x=new Map(n.map(l=>[l.id,l])),q=new Map(o.map(l=>[l.dayId,l])),j=new Map(g.map(l=>[l.id,l])),S=[];x.get("place-xanthos")&&x.get("place-kas")&&S.push({id:"transport-dolmus-xanthos-kas",coordinates:[x.get("place-xanthos").coordinates,x.get("place-kas").coordinates]});const p=Zn(g,t),A=d.filter(l=>!l.affects?.routeIds?.length);e.innerHTML=`
    <div class="map-screen">
      <div id="map-canvas-wrap"></div>
      <div id="map-fallback-note" class="map-fallback-note notice" hidden><span class="notice__text"></span><button class="notice__close" aria-label="${a("Close","Закрыть")}">&times;</button></div>
      <div id="offtrail-banner" class="offtrail-banner notice" hidden><span class="notice__text"></span><button class="notice__close" aria-label="${a("Close","Закрыть")}">&times;</button></div>

      <div class="today-widget" id="today-widget">
        <button class="today-widget__header" id="today-widget-toggle">
          <span>${u(p.date)} &middot; ${a("Tasks","Задачи")}</span>
          <span class="today-widget__chevron" id="today-widget-chevron">&#8964;</span>
        </button>
        <div class="today-widget__body" id="today-widget-body">
          ${A.length?`
            <div class="today-widget__alerts">
              ${A.map(l=>`<div>${H(t,l.status)} ${u(l.title)}</div>`).join("")}
            </div>
          `:""}
          <div class="today-widget__list" id="today-tasks-list"></div>
          <button class="today-widget__add" id="today-add-btn">${a("+ Add item","+ Добавить")}</button>
          <div class="today-widget__completed-header" id="today-completed-header" hidden>
            <span>${a("Completed","Сделано")}</span>
            <button id="today-clear-btn" title="${a("Clear completed","Очистить")}" aria-label="${a("Clear completed","Очистить")}">🗑</button>
          </div>
          <div class="today-widget__list today-widget__list--completed" id="today-completed-list"></div>
          <a href="#/itinerary/${p.id}" class="today-widget__full-day">${a("Full day view","Весь день")} &rarr;</a>
        </div>
      </div>

      <button class="map-round-btn" id="locate-btn" title="${a("Where am I","Где я")}" aria-label="${a("Where am I","Где я")}" aria-pressed="false">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 3h-2.07A7 7 0 0 0 13 5.07V3h-2v2.07A7 7 0 0 0 5.07 11H3v2h2.07A7 7 0 0 0 11 18.93V21h2v-2.07A7 7 0 0 0 18.93 13H21v-2Zm-9 6a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/></svg>
      </button>

      <button class="map-round-btn map-round-btn--layers" id="layers-btn" title="${a("Map layers","Слои карты")}" aria-label="${a("Map layers","Слои карты")}" aria-expanded="false">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="m12 3 10 5.5-10 5.5L2 8.5 12 3Zm-7.6 9.3L12 16.5l7.6-4.2 2.4 1.3-10 5.5-10-5.5 2.4-1.3Z"/></svg>
      </button>
      <div class="layers-menu" id="layers-menu" hidden>
        <button data-layer="topo" aria-pressed="true">${a("Topo","Топо")} <span class="layers-menu__note">${a("offline: corridor map","офлайн: карта коридора")}</span></button>
        <button data-layer="map">${a("Map","Карта")} <span class="layers-menu__note">${a("needs internet","нужен интернет")}</span></button>
        <button data-layer="satellite">${a("Satellite","Спутник")} <span class="layers-menu__note">${a("needs internet","нужен интернет")}</span></button>
      </div>
      <button class="map-round-btn map-round-btn--measure" id="measure-btn" title="${a("Measure along the trail","Измерить по тропе")}" aria-label="${a("Measure along the trail","Измерить по тропе")}" aria-pressed="false">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3 17.3 17.3 3 21 6.7 6.7 21 3 17.3Zm3.7 1.3 1-1-1.6-1.6.9-.9 1.6 1.6 1.2-1.2-1-1 .9-.9 1 1 1.2-1.2-1.6-1.6.9-.9 1.6 1.6 1.2-1.2-1-1 .9-.9 1 1 1.2-1.2-1.6-1.6.9-.9 1.6 1.6 1-1-1.3-1.3L5.4 17.3l1.3 1.3Z"/></svg>
      </button>

      <div id="gps-panel" class="gps-panel" hidden></div>
      <div id="measure-panel" class="gps-panel measure-panel" hidden></div>

      <button class="map-fab map-fab--demo" id="demo-btn">${a("▶ Play Demo","▶ Демо")}</button>
      <button class="map-fab map-fab--stop-demo" id="demo-stop-btn" hidden>${a("✕ End Demo","✕ Стоп")}</button>
      <button class="map-fab map-fab--water" id="water-only-btn" aria-pressed="false">💧 ${a("Water only","Только вода")}</button>
      <button class="map-fab map-fab--gpx" id="gpx-btn" title="${a("Download GPX","Скачать GPX")}" aria-label="${a("Download GPX","Скачать GPX")}">GPX</button>

      <div id="poi-panel" class="poi-panel" hidden>
        <button class="poi-panel__close" id="poi-close-btn" aria-label="Close">&times;</button>
        <div id="poi-panel-body"></div>
      </div>
    </div>
  `;const It=e.querySelector("#today-tasks-list"),Bt=e.querySelector("#today-completed-list"),Ot=e.querySelector("#today-completed-header");function de(){const l=we(p),c=l.filter(y=>!y.done),$=l.filter(y=>y.done);It.innerHTML=c.map(y=>`
      <label class="today-widget__item">
        <input type="checkbox" data-id="${y.id}" />
        <span>${u(y.text)}</span>
      </label>
    `).join("")||`<p class="empty-state" style="padding:6px 0;">${a("Nothing left — nice.","Всё сделано!")}</p>`,Ot.hidden=$.length===0,Bt.innerHTML=$.map(y=>`
      <label class="today-widget__item today-widget__item--done">
        <input type="checkbox" data-id="${y.id}" checked />
        <span>${u(y.text)}</span>
      </label>
    `).join(""),e.querySelectorAll("#today-tasks-list input, #today-completed-list input").forEach(y=>{y.addEventListener("change",()=>{Wn(p,y.dataset.id),de()})})}de(),e.querySelector("#today-add-btn").addEventListener("click",()=>{const l=prompt(a("Add a task","Новая задача"));l&&l.trim()&&(Gn(p,l.trim()),de())}),e.querySelector("#today-clear-btn").addEventListener("click",()=>{Hn(p),de()});const Ft=e.querySelector("#today-widget-toggle"),We=e.querySelector("#today-widget-body"),qt=e.querySelector("#today-widget-chevron");Ft.addEventListener("click",()=>{const l=We.hidden=!We.hidden;qt.style.transform=l?"rotate(-90deg)":"rotate(0deg)"});const ve=e.querySelector("#map-canvas-wrap"),te=e.querySelector("#map-fallback-note"),G={set textContent(l){te.querySelector(".notice__text").textContent=l},set innerHTML(l){te.querySelector(".notice__text").innerHTML=l},set hidden(l){te.hidden=l}};te.querySelector(".notice__close").addEventListener("click",()=>{te.hidden=!0});const ne=e.querySelector("#demo-btn"),pe=e.querySelector("#demo-stop-btn"),He=e.querySelector("#poi-panel"),jt=e.querySelector("#poi-panel-body"),Gt=e.querySelector("#poi-close-btn");function Wt(l){const c=se(k,l);if(!c||c.offTrailM>3e3)return"";const $=c.day;return`<p class="poi-panel__meta">${$?`${u(j.get($.dayId)?.date??"")}: ${C(c.alongM-$.startM)} ${a("from the day start","от старта дня")}`:""}${c.offTrailM>30?` &middot; ${C(c.offTrailM)} ${a("off the trail","от тропы")}`:` &middot; ${a("on the trail","на тропе")}`}</p>`}function Ht(l,c){const[$,y]=l;return`<div class="link-row">
      <a class="btn" target="_blank" rel="noopener" href="${c??`https://www.google.com/maps/search/?api=1&query=${y},${$}`}">Google Maps</a>
      <a class="btn btn-secondary" href="om://map?ll=${y},${$}&n=1">Organic Maps</a>
      <a class="btn btn-secondary" href="mapsme://map?ll=${y},${$}&n=1">maps.me</a>
    </div>`}async function Nt({kind:l,data:c}){const $=c.coordinates??null;let y=c.status,_="";if(l==="source")y=c.curated?Vn():"orange",_=`
        <p class="poi-panel__category">${u(c.osmType??"spring")}${c.osm?` &middot; <a href="https://www.openstreetmap.org/${c.osm}" target="_blank" rel="noopener">OSM</a>`:""}</p>
        <p class="poi-warning">${a("May be dry in October — don't rely on it as your only source.","В октябре может быть сухим, не рассчитывать как на единственный.")}</p>
        ${c.notes?`<p>${u(c.notes)}</p>`:""}`;else if(l==="buy")y="neutral",_=`<p class="poi-panel__category">${u(c.osmType??"")}${c.osm?` &middot; <a href="https://www.openstreetmap.org/${c.osm}" target="_blank" rel="noopener">OSM</a>`:""}</p>
        <p>${a("Buy water — reliable (shop / café). Opening hours not checked.","Купить воду — надёжно (магазин / кафе). Часы работы не проверены.")}</p>`;else if(l==="food")_=`<p class="poi-panel__category">${u(c.category??"food")}</p>`;else if(l==="fuel")_=`<p class="poi-panel__category">gas &middot; stock of EN417 canisters ${c.canisterStockConfirmed?"confirmed":"not confirmed"}</p>`;else if(l==="sleep")_=`<p class="poi-panel__category">${u(c.type??"camp")}${c.booked?` &middot; <strong>${a("booked","забронировано")}</strong>`:""}</p>
        ${c.address?`<p>${u(c.address)}</p>`:""}
        ${c.phone?`<p><a href="tel:${c.phone.replace(/\s/g,"")}">${u(c.phone)}</a></p>`:""}
        ${c.checkIn?`<p>${a("Check-in","Заезд")}: ${u(c.checkIn)}<br>${a("Check-out","Выезд")}: ${u(c.checkOut??"")}</p>`:""}
        <p>${u(c.priceInfo??"")}</p>`;else if(l==="transport"){const b=c.details?.segments??(c.details?.flightNo?[c.details]:[]);_=`<p class="poi-panel__category">${u(c.mode??"transport")}${c.date?` &middot; ${u(c.date)}`:""}</p>
        ${b.map(L=>`<p><strong>${u(L.flightNo)}</strong> ${u(L.from)} ${u(L.depart)} → ${u(L.to)} ${u(L.arrive)}</p>`).join("")}`}else if(l==="attraction"){const b=c.category==="ruins"?`<a href="#/knowledge/ancient-lycia">${a("More on Ancient Lycia","Подробнее о Ликии")} &rarr;</a>`:"";_=`<p class="poi-panel__category">${u(c.category)}</p><p>${u(c.shortDescription??"")}</p>${b?`<p>${b}</p>`:""}`}else l==="hazard"?_=`<p><a href="#/knowledge/route-decisions">${a("Route decisions","Решения по маршруту")} &rarr;</a> &middot; <a href="#/knowledge/safety">${a("Safety notes","Безопасность")} &rarr;</a></p>`:l==="gpx"&&(y="neutral",_=`<p class="poi-panel__category">${u(c.categoryLabel)}</p><p style="color:var(--text-dim);font-size:0.75rem;">${a("From the trekkingmania GPX (2024) — may be outdated.","Из GPX trekkingmania (2024) — может быть устаревшим.")}</p>`);const B=await Promise.all((c.sources??[]).map(b=>wn(b))),F=$??x.get(c.placeId)?.coordinates;jt.innerHTML=`
      <div class="pill-row">${H(t,y??"neutral")}<span class="pill">${u(Un[l]??l)}</span></div>
      <h3>${u(c.name)}</h3>
      ${F?Wt(F):""}
      ${_}
      ${c.notes&&l!=="source"?`<p>${u(c.notes)}</p>`:""}
      ${c.confidence?`<p style="font-size:0.75rem;color:var(--text-dim);">${a("Confidence","Достоверность")}: ${u(c.confidence)}${c.lastVerified?` &middot; ${a("last verified","проверено")} ${u(c.lastVerified)}`:""}</p>`:""}
      ${B.filter(Boolean).length?`<div class="section-title">${a("Sources","Источники")}</div>${B.filter(Boolean).map(b=>b.url?`<p><a href="${b.url}" target="_blank" rel="noopener">${u(b.title)}</a></p>`:`<p>${u(b.title)}</p>`).join("")}`:""}
      ${F?Ht(F,c.googleMapsUrl):""}
    `,He.hidden=!1}function be(){He.hidden=!0}Gt.addEventListener("click",be);function Rt(){G.textContent=a("Simplified view — the map could not start on this device.","Упрощённая схема — карта не запустилась на этом устройстве."),G.hidden=!1,Cn(ve,{config:t,places:n,master:k,waterList:v,gpsPosition:oe()})}let T=null;try{const{mountMapLibre:l}=await fn(async()=>{const{mountMapLibre:c}=await import("./map-yKfOEkIA.js");return{mountMapLibre:c}},[]);ve.innerHTML='<div id="maplibre-container" style="width:100%;height:100%;"></div>',T=await l(ve.querySelector("#maplibre-container"),{config:t,places:n,routes:o,food:h,fuel:f,accommodation:i,transport:m,attractions:r,master:k,waterList:v,pois:M,transportLines:S}),T.setOnPoiClick(c=>{if(R&&(c.data.coordinates??x.get(c.data.placeId)?.coordinates)){Ke(c.data.coordinates??x.get(c.data.placeId).coordinates);return}Nt(c)}),T.mode==="offline-map"?(G.textContent=a("Offline: corridor map ±2 km","Офлайн: карта коридора ±2 км"),G.hidden=!1):T.mode==="offline-blank"&&(G.innerHTML=a('Offline — base map not downloaded. Trail and points still work. <a href="#/knowledge">Download map</a>','Офлайн — подложка не скачана. Трек и точки работают. <a href="#/knowledge">Скачать карту</a>'),G.hidden=!1)}catch(l){console.warn("MapLibre failed to load, falling back to the SVG corridor view",l),Rt()}const Me=e.querySelector("#locate-btn"),O=e.querySelector("#gps-panel"),W=e.querySelector("#offtrail-banner");let ae=!1,ke=!1,R=!1,Se=!1,_e=!1;const Dt=W.querySelector(".notice__text");W.querySelector(".notice__close").addEventListener("click",()=>{_e=!0,W.hidden=!0});const xe=()=>`<button class="gps-panel__close" data-dismiss aria-label="${a("Close","Закрыть")}">&times;</button>`;O.addEventListener("click",l=>{l.target.closest("[data-dismiss]")&&(Se=!0,O.hidden=!0)});function ue(l,c){if(!ae){O.hidden=!0,W.hidden=!0;return}if(O.hidden=R||Se,c&&!l){c.code===1?O.innerHTML=`<button class="gps-panel__close" data-dismiss aria-label="${a("Close","Закрыть")}">&times;</button>${Jn}`:O.innerHTML=`<button class="gps-panel__close" data-dismiss aria-label="${a("Close","Закрыть")}">&times;</button><p>${a("Can't get a location fix","Не удаётся определить местоположение")}: ${u(c.message)}. ${a("Move to open ground and wait.","Выйдите на открытое место и подождите.")}</p>`,W.hidden=!0;return}if(!l){O.innerHTML=`${xe()}<p>${a("Finding GPS…","Ищем GPS…")}</p>`;return}const $=se(k,[l.lon,l.lat]),y=`±${Math.round(l.accuracy??0)} ${a("m","м")}`;if(!$||$.offTrailM>Kn){W.hidden=!0,O.innerHTML=`${xe()}<p><strong>${a("You are far from the route","Вы далеко от маршрута")}</strong> — ${C($?.offTrailM??0)} ${a("to the trail","до тропы")}. <span class="gps-panel__acc">${y}</span></p>`;return}$.offTrailM<=ot&&(_e=!1),W.hidden=$.offTrailM<=ot||_e,Dt.textContent=a(`You are ${Math.round($.offTrailM)} m off the trail`,`Вы в ${Math.round($.offTrailM)} м от тропы`),requestAnimationFrame(()=>{W.style.bottom=innerWidth<720&&!O.hidden?`${O.getBoundingClientRect().height+126}px`:""});const _=$.day??k.days.at(-1),B=Math.max(0,_.endM-$.alongM),F=q.get(_.dayId),b=at(v,$.alongM,"source"),L=at(v,$.alongM,"buy");O.innerHTML=`${xe()}
      <div class="gps-panel__row"><span>${a("To the day's finish","До финиша дня")}${F?` (${u(_.to)})`:""}</span><strong>${C(B)}</strong></div>
      <div class="gps-panel__row"><span>💧 ${a("Next spring/tap","Источник впереди")}${b?` — ${u(b.name)}`:""}</span><strong>${b?C(b.alongM-$.alongM):"—"}</strong></div>
      <div class="gps-panel__row"><span>🛒 ${a("Buy water","Купить воду")}${L?` — ${u(L.name)}`:""}</span><strong>${L?C(L.alongM-$.alongM):"—"}</strong></div>
      <div class="gps-panel__foot">${a("along the trail","по тропе")} &middot; ${a("accuracy","точность")} ${y}</div>
    `}function fe(l){ae=l,Yn(l),Me.classList.toggle("map-round-btn--active",l),Me.setAttribute("aria-pressed",String(l)),l?(ke=!1,_t(),ue(oe(),null)):(Bn(),ue(null,null))}Me.addEventListener("click",()=>{if(Se=!1,!ae){fe(!0);return}const l=oe();l&&T?T.flyTo([l.lon,l.lat]):fe(!1)}),Be(({position:l,error:c})=>{ae&&(l&&T&&(T.setGpsPosition(l),ke||(ke=!0,T.flyTo([l.lon,l.lat],14))),ue(l,c))}),Xn()&&fe(!0);const Ne=e.querySelector("#layers-btn"),D=e.querySelector("#layers-menu");Ne.addEventListener("click",()=>{D.hidden=!D.hidden,Ne.setAttribute("aria-expanded",String(!D.hidden)),D.querySelectorAll("[data-layer]").forEach(l=>{l.disabled=l.dataset.layer!=="topo"&&!navigator.onLine})}),D.querySelectorAll("[data-layer]").forEach(l=>{l.addEventListener("click",async()=>{if(!T)return;D.querySelectorAll("[data-layer]").forEach($=>$.setAttribute("aria-pressed",String($===l))),D.hidden=!0,(await T.setLayer(l.dataset.layer)).startsWith("offline")&&l.dataset.layer!=="topo"&&(G.textContent=a("No internet — showing the offline map.","Нет интернета — показана офлайн-карта."),G.hidden=!1)})});const Le=e.querySelector("#measure-btn"),Z=e.querySelector("#measure-panel"),Re=300;let P=null,E=null,he=!1;function De(l,c){const{coords:$,ele:y,cum:_}=k,B=b=>{let L=_.findIndex(Kt=>Kt>=b);if(L<=0)return y[0];const Ut=(b-_[L-1])/Math.max(1,_[L]-_[L-1]);return y[L-1]+Ut*(y[L]-y[L-1])},F=[[...Ee($,l),B(l)]];for(let b=0;b<$.length;b++)_[b]>l&&_[b]<c&&F.push([$[b][0],$[b][1],y[b]]);return F.push([...Ee($,c),B(c)]),F}function zt([l,c]){return`<div class="link-row">
      <span style="font-size:0.72rem;color:var(--text-dim);align-self:center;">${a("Open B in:","Открыть Б в:")}</span>
      <a class="btn btn-secondary" href="om://map?ll=${c},${l}&n=1">Organic Maps</a>
      <a class="btn btn-secondary" href="mapsme://map?ll=${c},${l}&n=1">maps.me</a>
      <a class="btn btn-secondary" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${c},${l}">Google Maps</a>
    </div>
    <p class="gps-panel__foot">${a("Along our track only. No off-trail routing — open the point in an app for that (needs internet or the app's offline maps).","Только по нашему треку. Маршрут вне тропы не прокладывается — для этого откройте точку в приложении (нужен интернет или офлайн-карты в приложении).")}</p>`}function Ae(l){if(!R){Z.hidden=!0;return}Z.hidden=!1,O.hidden=!0;const c=`<button class="gps-panel__close" id="measure-close" aria-label="${a("Close","Закрыть")}">&times;</button><strong>${a("Measure along the trail","Измерить по тропе")}</strong>`,$=`<div class="link-row"><button class="btn btn-secondary" id="measure-from-me">📍 ${a("From me","От меня")}</button><button class="btn btn-secondary" id="measure-reset">${a("Reset","Сбросить")}</button></div>`;let y;if(l)y=`<p>${l}</p>`;else if(!P)y=`<p>${a("Tap point A on the trail — or “From me”.","Тапните точку A на треке — или «От меня».")}</p>`;else if(!E)y=`<p>A: ${C(P.alongM)} ${a("along the trail","по тропе")}${P.fromMe?a(" (you)"," (вы)"):""}. ${a("Now tap point B.","Теперь тапните точку Б.")}</p>`;else{const _=E.alongM>=P.alongM;let B=De(Math.min(P.alongM,E.alongM),Math.max(P.alongM,E.alongM));_||(B=B.reverse());const{ascentM:F,descentM:b}=Dn(B),L=Math.abs(E.alongM-P.alongM);y=`
        <div class="gps-panel__row"><span>${a("Distance along the trail","Расстояние по тропе")}</span><strong>${C(L)}</strong></div>
        <div class="gps-panel__row"><span>${a("Gain / loss","Набор / сброс")}</span><strong>+${F} / −${b} ${a("m","м")}</strong></div>
        <div class="gps-panel__row"><span>${a("Time (estimate, Tobler)","Время (оценка, формула Тоблера)")}</span><strong>≈ ${zn(Rn(B))}</strong></div>
        ${Tt(B,{height:70})}
        ${zt(E.point)}`}Z.innerHTML=`${c}${y}${$}`,Z.querySelector("#measure-close").addEventListener("click",()=>Ue(!1)),Z.querySelector("#measure-reset").addEventListener("click",()=>{P=E=null,V()}),Z.querySelector("#measure-from-me").addEventListener("click",()=>{const _=oe();if(_){ze(_);return}he=!0,ae||fe(!0),Ae(a("Waiting for GPS…","Ждём GPS…"))})}function V(l){T?.setMeasurePoints([P,E].filter(Boolean).map(c=>c.point)),P&&E?T?.setMeasureLine(De(Math.min(P.alongM,E.alongM),Math.max(P.alongM,E.alongM)).map(c=>[c[0],c[1]])):T?.setMeasureLine(null),Ae(l)}function ze(l){he=!1;const c=se(k,[l.lon,l.lat]);if(!c||c.offTrailM>Re){V(a(`You are ${C(c?.offTrailM??0)} off the trail — “From me” only works near the track.`,`Вы в ${C(c?.offTrailM??0)} от тропы — «От меня» работает только рядом с треком.`));return}P={alongM:c.alongM,point:c.point,fromMe:!0},E=null,V()}function Ue(l){if(R=l,Le.classList.toggle("map-round-btn--active",l),Le.setAttribute("aria-pressed",String(l)),e.querySelector(".map-screen").classList.toggle("map-screen--measuring",l),!l){P=E=null,he=!1,V(),ue(oe(),null);return}be(),V()}Le.addEventListener("click",()=>Ue(!R)),T?.setOnMapClick(l=>{R&&Ke(l)});function Ke(l){const c=se(k,l);if(!c||c.offTrailM>Re){Ae(a(`Tap closer to the trail (now ${C(c?.offTrailM??0)} away).`,`Тапните ближе к треку (сейчас ${C(c?.offTrailM??0)} от него).`));return}const $={alongM:c.alongM,point:c.point};!P||P&&E?(P=$,E=null):E=$,V()}Be(({position:l})=>{R&&he&&l&&ze(l)});const me=e.querySelector("#water-only-btn");me.addEventListener("click",()=>{const l=me.getAttribute("aria-pressed")!=="true";me.setAttribute("aria-pressed",String(l)),me.classList.toggle("map-fab--active",l),T?.setWaterOnly(l)}),e.querySelector("#gpx-btn").addEventListener("click",()=>{Fn(On({trail:w,itinerary:g,routes:o,waterList:v,accommodation:i}))}),T?(ne.addEventListener("click",()=>{be(),ne.hidden=!0,pe.hidden=!1,T.playDemo(()=>{ne.hidden=!1,pe.hidden=!0})}),pe.addEventListener("click",()=>{T.stopDemo(),ne.hidden=!1,pe.hidden=!0})):ne.hidden=!0}const st=.15;function rt(e,t){return!e&&!t?"":` <a href="${t??`https://www.google.com/maps/search/?api=1&query=${e[1]},${e[0]}`}" target="_blank" rel="noopener">${a("map","карта")}&nbsp;↗</a>`}function ea(e,t,n,o,s,r){const d=t.allTrails,h=t.metrics.find(v=>v.source==="user_itinerary"),f=d?.distanceKm??h?.distanceKm,i=d?.ascentM??h?.ascentM,m=d?"AllTrails":a("plan","план"),g=(v,x)=>v&&x?Math.abs(v-x)/x:0,w=s&&g(s.distanceKm,f)>st,M=s&&i&&g(s.ascentM,i)>st,k=r.map(v=>({m:v.alongM-s.startM,color:v.kind==="source"?"#00A3FF":"#2EC4B6"}));return`
    <div class="card">
      <h3>${a("Route","Маршрут")}</h3>
      <p>${n?u(n.name):"?"} &rarr; ${o?u(o.name):"?"}</p>
      <div class="metric-grid">
        <div class="metric"><div class="metric__value">${f??"—"} ${a("km","км")}</div><div class="metric__label">${m}</div></div>
        <div class="metric"><div class="metric__value">${i!=null?`+${i} ${a("m","м")}`:"—"}</div><div class="metric__label">${a("gain","набор")}, ${m}</div></div>
      </div>
      ${d?.links?.length?`<p>${d.links.map((v,x)=>`<a href="${v}" target="_blank" rel="noopener">AllTrails${d.links.length>1?` ${x+1}`:""}&nbsp;↗</a>`).join(" &middot; ")}</p>`:""}
      ${s?`
        <p style="font-size:0.75rem;">${a("Our track","По нашему треку")}: ${C(s.distanceKm*1e3)}, +${s.ascentM} / −${s.descentM} ${a("m","м")}, ${s.minEleM}–${s.maxEleM} ${a("m above sea level","м над уровнем моря")}${w||M?` — <strong>${a("differs from AllTrails by more than 15%, go by AllTrails","расходится с AllTrails больше чем на 15%, ориентируйтесь на AllTrails")}</strong>`:""}.</p>
        ${Tt(s.coordinates,{marks:k})}
        <p style="font-size:0.7rem;">${a("Profile marks","Метки на профиле")}: <span style="color:#00A3FF">${a("springs/taps","источники")}</span>, <span style="color:#2EC4B6">${a("buy water","купить воду")}</span>.</p>
      `:""}
      ${t.variants?.length?t.variants.map(v=>`
        <p>${H(e,v.status)} <strong>${u(v.name)}</strong> — ${u(v.notes)}</p>
      `).join(""):""}
      ${t.notes?`<p><em>${u(t.notes)}</em></p>`:""}
    </div>`}function ta(e,t){return t?e.length?`
    <div class="section-title">${a("Water on this stage","Вода на участке")}</div>
    <div class="card">
      <ul class="water-list">
        ${e.map(n=>`
          <li>
            <span class="water-list__km">${C(Math.max(0,n.alongM-t.startM))}</span>
            <span class="water-list__name">${n.kind==="source"?"💧":"🛒"} ${u(n.name)}${n.kind==="source"?` <span style="color:var(--status-orange);font-size:0.72rem;">(${a("may be dry","может быть сухим")})</span>`:""}</span>
            <span class="water-list__off">${n.offTrailM>40?`${Math.round(n.offTrailM)} ${a("m off trail","м от тропы")}`:a("on the trail","на тропе")}</span>
          </li>`).join("")}
      </ul>
      <p style="font-size:0.72rem;">${a("💧 spring/tap — may be dry in October, don't rely on it as the only source. 🛒 buy — shop/café (reliable, hours not checked). Distance — from the day start along the trail.","💧 источник — в октябре может быть сухим, не рассчитывать как на единственный. 🛒 купить — магазин/кафе (надёжно, часы не проверены). Расстояние — от старта дня по тропе.")}</p>
    </div>`:`<div class="section-title">${a("Water on this stage","Вода на участке")}</div><div class="card"><p>${a("No water points found — carry enough for the whole day.","Точек воды на участке не найдено — несите запас на весь день.")}</p></div>`:""}async function na(e){const[t,n]=await Promise.all([je(),Ge()]);e.innerHTML=`
    <div class="screen-pad">
      ${bt()}
      <div class="section-title">${a("Itinerary","План по дням")}</div>
      ${n.map(o=>`
        <a href="#/itinerary/${o.id}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <div class="pill-row"><span class="pill">${u(o.date)}</span>${H(t,o.status)}</div>
          <h3>${u(o.title)}</h3>
          <p>${u(o.summary)}</p>
        </a>
      `).join("")}
    </div>
  `}async function aa(e,{dayId:t}){const[n,o]=await Promise.all([je(),vn(t)]);if(!o){e.innerHTML=`<div class="screen-pad"><p>${a("Day not found.","День не найден.")}</p></div>`;return}const[s,r,d,h,f]=await Promise.all([bn(o.routeId),Promise.resolve(o.accommodationIds??[]),gt(),ht(),$t()]),i=(await mt()).filter(p=>o.accommodationIds?.includes(p.id)),[m,g]=await Promise.all([yt(),wt()]),w=xt(m),M=w.days.find(p=>p.dayId===o.id)??null,k=M?Lt(w,{pois:g,water:h,food:d}).filter(p=>p.alongM>=M.startM-50&&p.alongM<=M.endM+50&&p.offTrailM<=1e3):[],v=d.filter(p=>o.foodIds?.includes(p.id)),x=h.waterPoints.filter(p=>o.waterIds?.includes(p.id)),q=f.filter(p=>o.transportIds?.includes(p.id));let j=null,S=null;s&&([j,S]=await Promise.all([Xe(s.fromPlaceId),Xe(s.toPlaceId)])),e.innerHTML=`
    <div class="screen-pad">
      <a href="#/itinerary" class="btn-secondary btn" style="margin-bottom:12px;display:inline-block;">&larr; ${a("All days","Все дни")}</a>
      <div class="pill-row"><span class="pill">${u(o.date)}</span>${H(n,o.status)}</div>
      <h2 style="margin:6px 0;">${u(o.title)}</h2>
      <p>${u(o.summary)}</p>

      ${s?ea(n,s,j,S,M,k):""}
      ${ta(k,M)}

      ${o.tasks?.length?`<div class="section-title">${a("Tasks","Задачи")}</div><div class="card"><ul>${o.tasks.map(p=>`<li>${u(p)}</li>`).join("")}</ul></div>`:""}
      ${o.preTripTasks?.length?`<div class="section-title">${a("Pre-trip tasks","До поездки")}</div><div class="card"><ul>${o.preTripTasks.map(p=>`<li>${u(p)}</li>`).join("")}</ul></div>`:""}

      ${x.length?`<div class="section-title">${a("Water","Вода")}</div>${x.map(p=>`
        <div class="card"><h3>${u(p.name)}</h3><p>${u(p.waterType)} &middot; ${u(p.status)} &middot; ${u(p.treatment)}</p><p>${u(p.notes)}</p></div>
      `).join("")}`:""}

      ${v.length?`<div class="section-title">${a("Food","Еда")}</div>${v.map(p=>`
        <div class="card">${H(n,p.status)} <strong>${u(p.name)}</strong>${rt(p.coordinates,p.googleMapsUrl)} <p>${u(p.notes)}</p></div>
      `).join("")}`:""}

      ${i.length?`<div class="section-title">${a("Sleep","Ночёвка")}</div>${i.map(p=>`
        <div class="card">${H(n,p.status)} <strong>${u(p.name)}</strong>${p.booked?` <span class="pill">${a("booked","забронировано")}</span>`:""}${rt(p.coordinates,p.googleMapsUrl)}
          ${p.address?`<p>${u(p.address)}</p>`:""}
          ${p.phone?`<p><a href="tel:${p.phone.replace(/\s/g,"")}">${u(p.phone)}</a></p>`:""}
          ${p.checkIn?`<p>${a("Check-in","Заезд")}: ${u(p.checkIn)} &middot; ${a("Check-out","Выезд")}: ${u(p.checkOut??"")}</p>`:""}
          <p>${u(p.priceInfo)}</p><p>${u(p.notes)}</p></div>
      `).join("")}`:""}

      ${q.length?`<div class="section-title">${a("Transport","Транспорт")}</div>${q.map(p=>`
        <div class="card">${H(n,p.status)} <strong>${u(p.name)}</strong>
          ${(p.details?.segments??(p.details?.flightNo?[p.details]:[])).map(A=>`<p><strong>${u(A.flightNo)}</strong> ${u(A.from)} ${u(A.depart)} → ${u(A.to)} ${u(A.arrive)}</p>`).join("")}
          <p>${u(p.notes)}</p></div>
      `).join("")}`:""}

      ${o.highlights?.length?`<div class="section-title">${a("Highlights","Главное")}</div><div class="card"><ul>${o.highlights.map(p=>`<li>${u(p)}</li>`).join("")}</ul></div>`:""}
      ${o.watchOut?.length?`<div class="section-title">${a("Watch out","Внимание")}</div><ul class="warn-list">${o.watchOut.map(p=>`<li>${u(p)}</li>`).join("")}</ul>`:""}
      ${o.backupPlan?`<div class="section-title">${a("Backup plan","Запасной план")}</div><div class="card">${u(o.backupPlan)}</div>`:""}
      ${o.notes?`<p style="color:var(--text-dim);font-size:0.8rem;">${u(o.notes)}</p>`:""}
    </div>
  `}const oa=[["#/itinerary",a("Itinerary","План по дням"),a("Day-by-day plan, 8–18 Oct","План по дням, 8–18 окт")],["#/emergency",a("Emergency","Экстренное"),a("112, GPS, bailout info","112, GPS, как сойти с маршрута")]],sa=["before-we-leave","turkish-phrases","hiker-reports"];async function Et(e){const[t,n,o,s]=await Promise.all([nn(),an(),lt(),Promise.all(sa.map(i=>vt(i).then(m=>[i,m])))]);e.innerHTML=`
    <div class="screen-pad">
      <div class="section-title">${a("Save for offline","Офлайн")}</div>
      <div class="card">
        <p id="offline-status">${t?a("Trip data is saved for offline use.","Данные поездки сохранены для офлайна."):a("Trip data is not yet saved for offline use.","Данные поездки ещё не сохранены для офлайна.")}</p>
        <p style="font-size:0.75rem;">${a("The daily track, all markers, day cards, elevation profiles and articles are saved automatically after the first online visit. The button below refreshes them.","Трек по дням, все маркеры, карточки дней, профили высот и статьи сохраняются автоматически после первого открытия онлайн. Кнопка ниже обновляет их вручную.")}</p>
        <button class="btn" id="save-offline-btn">${a("Save for offline","Сохранить офлайн")}</button>
      </div>

      <div class="card">
        <h3>${a("Offline route map","Карта маршрута офлайн")}</h3>
        <p>${a("Base map for a ±2 km corridor around the trail (Ovacık → Xanthos) + Ölüdeniz, Gelemiş, Kaş. Zoom up to 15 — paths, villages and roads. Source: OpenStreetMap / Protomaps, hosted on this site.","Подложка для коридора ±2 км вокруг тропы (Ovacık → Xanthos) + Ölüdeniz, Gelemiş, Kaş. Зумы до 15 — видны тропинки, сёла и дороги. Источник: OpenStreetMap / Protomaps, хранится на нашем сайте.")}</p>
        <p id="map-offline-status">${n?a("✓ Map downloaded — works without internet.","✓ Карта скачана — работает без интернета."):o?`${a("Download size","Размер загрузки")}: <strong>${Te(o.totalBytes)}</strong> (${o.files.length} ${a("files","файлов")}).`:a("Needs internet to check the size and download.","Нужен интернет, чтобы узнать размер и скачать.")}</p>
        <div class="progress" id="map-progress" hidden><div class="progress__bar" id="map-progress-bar"></div></div>
        <div class="link-row">
          <button class="btn" id="map-download-btn" ${o?"":"disabled"}>${n?a("Update map","Обновить карту"):a("Download route map","Скачать карту маршрута")}</button>
          ${n?`<button class="btn btn-secondary" id="map-delete-btn">${a("Delete","Удалить")}</button>`:""}
        </div>
        <p style="font-size:0.72rem;">${a("Satellite and the map outside the corridor need internet.","Спутник и онлайн-карта вне коридора требуют интернета.")}</p>
      </div>

      <div class="card">
        <h3>${a("Add to home screen","Добавить на главный экран")}</h3>
        <p><strong>iPhone, Safari:</strong></p>
        <ol class="install-steps">
          <li>${a("Open the site in Safari (not Chrome/Telegram).","Откройте сайт в Safari (не в Chrome/Telegram).")}</li>
          <li>${a("Tap Share (square with an up arrow).","Нажмите «Поделиться» (квадрат со стрелкой вверх).")}</li>
          <li>${a("“Add to Home Screen” → “Add”.","«На экран «Домой»» → «Добавить».")}</li>
          <li>${a("Open the app from the icon once while online — after that it works offline.","Откройте приложение с иконки один раз при интернете — после этого оно работает офлайн.")}</li>
        </ol>
        <p><strong>Android, Chrome:</strong></p>
        <ol class="install-steps">
          <li>${a("Open the site in Chrome.","Откройте сайт в Chrome.")}</li>
          <li>${a("⋮ (top-right menu) → “Add to Home screen” or “Install app”.","⋮ (меню справа сверху) → «Добавить на гл. экран» или «Установить приложение».")}</li>
          <li>${a("Confirm “Install”.","Подтвердите «Установить».")}</li>
          <li>${a("Open it from the icon once while online.","Откройте с иконки один раз при интернете.")}</li>
        </ol>
        <p style="font-size:0.72rem;">${a("Note: on iPhone the home-screen app and Safari keep separate storage — download the map in the one you will use on the trail.","Важно: на iPhone данные иконки на главном экране и вкладки Safari хранятся отдельно — скачайте карту именно в том, чем будете пользоваться в походе.")}</p>
      </div>

      <div class="section-title">${a("Trip","Поездка")}</div>
      ${oa.map(([i,m,g])=>`
        <a href="${i}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${u(m)}</h3>
          <p>${u(g)}</p>
        </a>
      `).join("")}

      <div class="section-title">${a("Field guide","Справочник")}</div>
      <p style="color:var(--text-dim);font-size:0.78rem;margin-top:-4px;">${a("Water, food, sleep, transport, safety, and places to see now live as markers on the Map tab — tap a pin for details.","Вода, еда, ночёвки, транспорт, безопасность и достопримечательности — маркерами на карте, нажмите на пин.")}</p>
      ${s.map(([i,m])=>`
        <a href="#/knowledge/${i}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${u(m.meta.title??i)}</h3>
          <p>${a("Confidence","Достоверность")}: ${u(m.meta.confidence??"?")} &middot; ${a("last verified","проверено")} ${u(m.meta.lastVerified??"?")}</p>
        </a>
      `).join("")}
    </div>
  `;const r=e.querySelector("#map-download-btn"),d=e.querySelector("#map-offline-status"),h=e.querySelector("#map-progress"),f=e.querySelector("#map-progress-bar");r.addEventListener("click",async()=>{if(o){r.disabled=!0,h.hidden=!1;try{await on((i,m)=>{const g=Math.min(100,Math.round(i/m*100));f.style.width=`${g}%`,d.textContent=`${a("Downloading","Загрузка")}: ${Te(i)} ${a("of","из")} ${Te(m)} (${g}%)`}),f.style.width="100%",d.textContent=a("✓ Map downloaded — works without internet.","✓ Карта скачана — работает без интернета."),r.textContent=a("Update map","Обновить карту")}catch(i){console.warn(i),d.textContent=a(`Failed: ${i.message}. Check the internet and try again.`,`Не получилось: ${i.message}. Проверьте интернет и попробуйте ещё раз.`)}finally{r.disabled=!1}}}),e.querySelector("#map-delete-btn")?.addEventListener("click",async()=>{await sn(),Et(e)}),e.querySelector("#save-offline-btn").addEventListener("click",async i=>{const m=i.currentTarget;m.disabled=!0,m.textContent=a("Saving…","Сохраняем…");try{await tn((g,w)=>m.textContent=`${a("Saving","Сохраняем")} ${g}/${w}…`),e.querySelector("#offline-status").textContent=a("Trip data saved for offline use.","Данные поездки сохранены для офлайна."),m.textContent=a("Saved","Сохранено")}catch(g){m.textContent=a("Save failed — retry","Ошибка — повторить"),m.disabled=!1,console.error(g)}})}function ra(e){const t=e.split(`
`);let n="",o=0;for(;o<t.length;){const s=t[o];if(/^\s*$/.test(s)){o++;continue}if(s.startsWith("# ")){n+=`<h2>${re(s.slice(2))}</h2>`,o++;continue}if(s.startsWith("## ")){n+=`<h3>${re(s.slice(3))}</h3>`,o++;continue}if(s.startsWith("**")&&s.match(/^\*\*.+\*\*/),s.startsWith("|")){const d=[];for(;o<t.length&&t[o].startsWith("|");)d.push(t[o]),o++;n+=ia(d);continue}if(s.startsWith("- ")){const d=[];for(;o<t.length&&t[o].startsWith("- ");)d.push(t[o].slice(2)),o++;n+=`<ul>${d.map(h=>`<li>${re(h)}</li>`).join("")}</ul>`;continue}const r=[];for(;o<t.length&&!/^\s*$/.test(t[o])&&!t[o].startsWith("|")&&!t[o].startsWith("- ")&&!t[o].startsWith("#");)r.push(t[o]),o++;n+=`<p>${re(r.join(" "))}</p>`}return n}function ia(e){e.filter(r=>!/^\|[\s-]+\|$/.test((r.replace(/[^|\s-]/g,""),r)));const n=e.filter(r=>!/^\|(\s*-+\s*\|)+$/.test(r)).map(r=>r.split("|").slice(1,-1).map(d=>d.trim()));if(!n.length)return"";const[o,...s]=n;return`<table class="phrases">
    <tbody>
      ${s.map(r=>`<tr>${r.map(d=>`<td>${re(d)}</td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>`}function re(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\[(.+?)\]\((.+?)\)/g,(t,n,o)=>{const s=o.endsWith(".md");return`<a href="${s?`#/knowledge/${o.replace(/\.md$/,"")}`:o}"${s?"":' target="_blank" rel="noopener"'}>${n}</a>`})}async function la(e,{slug:t}){const n=await vt(t);e.innerHTML=`
    <div class="screen-pad">
      <a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge base</a>
      <h2>${u(n.meta.title??t)}</h2>
      <p style="color:var(--text-dim);font-size:0.8rem;">${a("Confidence","Достоверность")}: ${u(n.meta.confidence??"?")} &middot; ${a("last verified","проверено")} ${u(n.meta.lastVerified??"?")}</p>
      <div class="card">${ra(n.body)}</div>
    </div>
  `}async function ca(e){e.innerHTML=`
    <div class="screen-pad">
      ${bt()}
      <div class="card">
        <h3>${a("Emergency number","Экстренный номер")}</h3>
        <p style="font-size:1.6rem;font-weight:700;">112</p>
        <p>${a("Türkiye's single emergency number — police, ambulance, fire.","Единый номер в Турции — полиция, скорая, пожарные.")}</p>
      </div>

      <div class="card">
        <h3>${a("Forestry Directorate (OGM)","Управление лесного хозяйства (OGM)")}</h3>
        <p>${a("For fire-restriction / forest-entry questions","Вопросы о пожарных ограничениях и входе в лес")}: <a href="https://www.ogm.gov.tr/en" target="_blank" rel="noopener">ogm.gov.tr</a></p>
        <p style="color:var(--text-dim);font-size:0.8rem;">A direct local contact number for the Muğla regional directorate has not been looked up yet.</p>
      </div>

      <div class="card">
        <h3>${a("Your current position","Ваше местоположение")}</h3>
        <div id="emergency-gps"><p>${a("Requesting location…","Определяем местоположение…")}</p></div>
      </div>

      <div class="card">
        <p style="color:var(--text-dim);font-size:0.8rem;">This app is a planning and reference tool. It does not replace a dedicated GPS/satellite communicator for real emergencies in the backcountry.</p>
      </div>
    </div>
  `;const t=e.querySelector("#emergency-gps");Be(({position:n,error:o})=>{n?t.innerHTML=`
        <p>${n.lat.toFixed(5)}, ${n.lon.toFixed(5)}</p>
        <p>${a("Accuracy","Точность")}: ±${Math.round(n.accuracy)} ${a("m","м")}</p>
        <div class="link-row">
          <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${n.lat},${n.lon}">Open in Google Maps</a>
        </div>
      `:o&&(t.innerHTML=`<p>${u(o.message)}</p>`)}),_t()}document.getElementById("app").innerHTML=`
  <header class="app-header">
    <div class="app-header__brand">Lycian Way 2026</div>
    <div class="segmented" role="tablist">
      <button class="segmented__btn" data-view="map" role="tab">${a("Map","Карта")}</button>
      <button class="segmented__btn" data-view="kb" role="tab">${a("Knowledge Base","База знаний")}</button>
    </div>
    <div class="lang">
      <button class="lang__btn" id="lang-btn" aria-label="${a("Language","Язык")}" aria-expanded="false">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-2.95a15.7 15.7 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.9 8ZM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96ZM4.26 14a8.2 8.2 0 0 1 0-4h3.38a16.5 16.5 0 0 0 0 4H4.26Zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.99 7.99 0 0 1 5.08 16Zm2.95-8H5.08a7.99 7.99 0 0 1 4.33-3.56A15.7 15.7 0 0 0 8.03 8ZM12 19.96A14.1 14.1 0 0 1 10.09 16h3.82A14.1 14.1 0 0 1 12 19.96ZM14.34 14H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4Zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56ZM16.36 14a16.5 16.5 0 0 0 0-4h3.38a8.2 8.2 0 0 1 0 4h-3.38Z"/></svg>
      </button>
      <div class="lang__menu" id="lang-menu" hidden>
        <button data-lang="en" aria-pressed="${N==="en"}">English</button>
        <button data-lang="ru" aria-pressed="${N==="ru"}">Русский</button>
      </div>
    </div>
  </header>
  <div id="screen"></div>
`;const qe=document.getElementById("lang-btn"),le=document.getElementById("lang-menu");qe.addEventListener("click",e=>{e.stopPropagation(),le.hidden=!le.hidden,qe.setAttribute("aria-expanded",String(!le.hidden))});document.addEventListener("click",()=>{le.hidden=!0,qe.setAttribute("aria-expanded","false")});le.querySelectorAll("[data-lang]").forEach(e=>e.addEventListener("click",()=>{e.dataset.lang!==N&&Vt(e.dataset.lang)}));ee("#/map",Qn);ee("#/itinerary",na);ee("#/itinerary/:dayId",aa);ee("#/knowledge",Et);ee("#/knowledge/:slug",la);ee("#/emergency",ca);const Ct=document.querySelectorAll(".segmented__btn");Ct.forEach(e=>{e.addEventListener("click",()=>{location.hash=e.dataset.view==="map"?"#/map":"#/knowledge"})});ln(e=>{const t=e==="#/map"||e==="";document.getElementById("screen").classList.toggle("screen--full-bleed",t),Ct.forEach(n=>n.classList.toggle("segmented__btn--active",n.dataset.view==="map"===t))});Yt();dn();export{a as L,fn as _,ge as a,pa as b,da as g,ua as o,Ee as p,Ln as s,fa as t,ha as u};
//# sourceMappingURL=index-TK0f66ub.js.map
