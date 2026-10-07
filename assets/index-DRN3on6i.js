(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();const $t="lycian-2026-lang";function sn(){try{return localStorage.getItem($t)==="ru"?"ru":"en"}catch{return"en"}}const R=sn();document.documentElement.lang=R;function n(e,t){return R==="ru"?t:e}function rn(e){try{localStorage.setItem($t,e)}catch{}location.reload()}const ln={"Ксанфа руины":"Xanthos ruins","Летоон руины":"Letoon ruins","Село. Магазин, отель":"Village: shop, hotel","Село. Кафе, магазин, отель":"Village: café, shop, hotel","Развилка - спуск к деревне или траверсом в обход":"Fork: down to the village or traverse around","Село. Магазин, кемпинги, кафе, отели":"Village: shop, camps, cafés, hotels","Тропа к долине Бабочек":"Path to Butterfly Valley","Пляж в Долине Бабочек":"Butterfly Valley beach","Село. Кафе, отели":"Village: cafés, hotels","Село. Кафе":"Village: café","Тропа к Олюденизу":"Path to Ölüdeniz","Олюдениз. Есть всё":"Ölüdeniz: everything","Старт/финиш западной части тропы":"Start/finish of the western Lycian Way"};function ba(e){return R==="ru"?e:ln[e]??e}const qe="lycian-2026-v2",Z="lycian-map-v1";function cn(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/lycian-way-2026/sw.js").catch(e=>console.warn("SW registration failed",e))})}const dn=["config","trip","itinerary","routes","places","water","accommodation","food","fuel","transport","alerts","attractions","sources","changelog","trail","pois"],pn=["before-we-leave","water","food","fuel","sleep","transport","route-decisions","safety","ancient-lycia","turkish-phrases","hiker-reports"];function un(){const e=new Set;return document.querySelectorAll("script[src]").forEach(t=>e.add(t.src)),document.querySelectorAll('link[rel="stylesheet"], link[rel="modulepreload"]').forEach(t=>e.add(t.href)),document.querySelectorAll('link[rel="icon"], link[rel="manifest"]').forEach(t=>e.add(t.href)),[...e].filter(t=>t.startsWith(location.origin))}async function fn(e){if(!("caches"in window))throw new Error("Cache API not supported in this browser.");const t="/lycian-way-2026/",a=[location.origin+t,`${t}index.html`,`${t}manifest.webmanifest`,`${t}vendor/maplibre-gl-worker.mjs`,`${t}vendor/maplibre-gl-shared.mjs`,...un(),...dn.map(i=>`${t}data/${i}.json`),...pn.map(i=>`${t}content/knowledge/${i}.md`)];navigator.serviceWorker?.controller?.postMessage({type:"precache"});const o=await caches.open(qe);let s=0;for(const i of a){try{const d=await fetch(i,{cache:"reload"});d.ok&&await o.put(i,d)}catch(d){console.warn(`Could not cache ${i}`,d)}s+=1,e?.(s,a.length)}return{cached:s,total:a.length}}async function hn(){return!("caches"in window)||!await caches.has(qe)?!1:!!await(await caches.open(qe)).match("/lycian-way-2026/data/trail.json")}function Q(e){return`${location.origin}/lycian-way-2026/offline/${e.split("/").map(encodeURIComponent).join("/")}`}async function yt(){const e=Q("manifest.json");try{const t=await fetch(e,{cache:"no-cache"});if(t.ok)return await t.json()}catch{}if("caches"in window){const t=await(await caches.open(Z)).match(e);if(t)return t.json()}return null}async function mn(){if(!("caches"in window)||!await caches.has(Z))return!1;const e=await caches.open(Z),t=await e.match(Q("manifest.json"));if(!t)return!1;const{files:a}=await t.json();for(const o of a)if(!await e.match(Q(o.path)))return!1;return!0}async function gn(e){if(!("caches"in window))throw new Error(n("This browser has no offline cache.","Этот браузер не поддерживает офлайн-кэш."));const t=await yt();if(!t)throw new Error(n("Couldn't get the map file list — needs internet.","Не удалось получить список файлов карты — нужен интернет."));const a=await caches.open(Z);let o=0;for(const s of t.files){const i=Q(s.path),d=await fetch(i,{cache:"no-cache"});if(!d.ok||!d.body)throw new Error(`${n("Download error","Ошибка загрузки")} ${s.path}: ${d.status}`);const h=d.body.getReader(),f=[];let l=0;for(;;){const{done:m,value:g}=await h.read();if(m)break;f.push(g),l+=g.length,e?.(o+l,t.totalBytes)}o+=s.bytes,await a.put(i,new Response(new Blob(f),{headers:{"Content-Type":d.headers.get("Content-Type")??"application/octet-stream"}})),e?.(o,t.totalBytes)}return await a.put(Q("manifest.json"),new Response(JSON.stringify(t),{headers:{"Content-Type":"application/json"}})),t}async function $n(){"caches"in window&&await caches.delete(Z)}async function Ma(){if(!("caches"in window)||!await caches.has(Z))return null;const e=await(await caches.open(Z)).match(Q("corridor.pmtiles"));return e?new File([await e.blob()],"corridor.pmtiles"):null}function ka(){return`${location.origin}/lycian-way-2026/offline/`}function Oe(e){if(e<1024*1024)return`${Math.round(e/1024)} ${n("KB","КБ")}`;const t=(e/1024/1024).toFixed(1);return`${R==="ru"?t.replace(".",","):t} ${n("MB","МБ")}`}const vt=[];let wt=null;const yn="#/map";function te(e,t){const a=[],o=e.replace(/:([\w]+)/g,(i,d)=>(a.push(d),"([^/]+)")),s=new RegExp(`^${o}$`);vt.push({regex:s,paramNames:a,render:t})}function vn(e){wt=e}function wn(e){for(const t of vt){const a=e.match(t.regex);if(a){const o={};return t.paramNames.forEach((s,i)=>o[s]=decodeURIComponent(a[i+1])),{render:t.render,params:o}}}return null}async function ot(){const e=document.getElementById("screen"),t=location.hash||yn,a=wn(t);if(wt?.(t),!a){e.innerHTML='<div class="screen-pad"><p>Not found.</p></div>';return}try{await a.render(e,a.params)}catch(o){console.error(o),e.innerHTML='<div class="screen-pad"><p>Something went wrong loading this screen.</p></div>'}}function bn(){window.addEventListener("hashchange",ot),ot()}const Mn="modulepreload",kn=function(e){return"/lycian-way-2026/"+e},st={},Sn=function(t,a,o){let s=Promise.resolve();if(a&&a.length>0){let d=function(l){return Promise.all(l.map(m=>Promise.resolve(m).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};document.getElementsByTagName("link");const h=document.querySelector("meta[property=csp-nonce]"),f=h?.nonce||h?.getAttribute("nonce");s=d(a.map(l=>{if(l=kn(l),l in st)return;st[l]=!0;const m=l.endsWith(".css"),g=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${g}`))return;const v=document.createElement("link");if(v.rel=m?"stylesheet":Mn,m||(v.as="script"),v.crossOrigin="",v.href=l,f&&v.setAttribute("nonce",f),document.head.appendChild(v),m)return new Promise((k,S)=>{v.addEventListener("load",k),v.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(d){const h=new Event("vite:preloadError",{cancelable:!0});if(h.payload=d,window.dispatchEvent(h),!h.defaultPrevented)throw d}return s.then(d=>{for(const h of d||[])h.status==="rejected"&&i(h.reason);return t().catch(i)})},Y=new Map;function bt(){return"/lycian-way-2026/"}async function I(e){if(Y.has(e))return Y.get(e);const t=await fetch(`${bt()}data/${e}.json`);if(!t.ok)throw new Error(`Failed to load data/${e}.json: ${t.status}`);const a=await t.json();return Y.set(e,a),a}const De=()=>I("config").then(e=>e),ze=()=>I("itinerary").then(e=>e.days),Mt=()=>I("routes").then(e=>e.routes),kt=()=>I("places").then(e=>e.places),St=()=>I("water"),_t=()=>I("accommodation").then(e=>e.accommodations),xt=()=>I("food").then(e=>e.foodPlaces),_n=()=>I("fuel"),Lt=()=>I("transport").then(e=>e.transportLegs),xn=()=>I("alerts").then(e=>e.alerts),Ln=()=>I("attractions").then(e=>e.attractions),An=()=>I("sources").then(e=>e.sources),At=()=>I("trail"),Tt=()=>I("pois"),Tn=An().then(e=>{const t=new Map;for(const a of e)t.set(a.id,a);return t}),En=async e=>(await Tn).get(e);async function Pn(e){return(await ze()).find(a=>a.id===e)}async function Cn(e){return e?(await Mt()).find(a=>a.id===e):null}async function rt(e){return e?(await kt()).find(a=>a.id===e):null}async function Et(e){const t=`knowledge:${e}`;if(Y.has(t))return Y.get(t);const a=await fetch(`${bt()}content/knowledge/${e}.md`);if(!a.ok)throw new Error(`Failed to load knowledge/${e}.md: ${a.status}`);const o=await a.text(),s=In(o);return Y.set(t,s),s}function In(e){const t=e.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);if(!t)return{meta:{},body:e};const[,a,o]=t,s={};for(const i of a.split(`
`)){const d=i.match(/^(\w+):\s*(.*)$/);if(!d)continue;const[,h,f]=d;f.startsWith("[")&&f.endsWith("]")?s[h]=f.slice(1,-1).split(",").map(l=>l.trim()).filter(Boolean):s[h]=f.trim()}return{meta:s,body:o.trim()}}const it={neutral:"#AAAAAA",orange:"#FF8800",yellow:"#FFEE00",red:"#FF0000"};function Bn(e,t){return e?.status?.[t]?.color??it[t]??it.neutral}const lt='<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 2.5 1.5 21h21L12 2.5Z" fill="#FFC400" stroke="#000" stroke-width="1" stroke-linejoin="round"/><path d="M11 9h2v6h-2zM11 16.5h2v2h-2z" fill="#000"/></svg>',On='<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="#E53935"/><rect x="6" y="10.5" width="12" height="3" rx="1" fill="#fff"/></svg>';function N(e,t){return t==="red"?`<span class="status-chip status-chip--red">${On}${n("Closed","Закрыто")}</span>`:t==="orange"?`<span class="status-chip status-chip--warn">${lt}${n("Unverified","Не проверено")}</span>`:t==="yellow"?`<span class="status-chip status-chip--warn">${lt}${n("Partly an issue","Частично проблема")}</span>`:""}function Pt(){return`<a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; ${n("Knowledge Base","База знаний")}</a>`}function p(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function qn([e,t],[a,o]){const i=t*Math.PI/180,d=o*Math.PI/180,h=(o-t)*Math.PI/180,f=(a-e)*Math.PI/180,l=Math.sin(h/2)**2+Math.cos(i)*Math.cos(d)*Math.sin(f/2)**2;return 2*6371e3*Math.asin(Math.sqrt(l))}function K(e){const t=[0];for(let a=1;a<e.length;a++)t.push(t[a-1]+qn(e[a-1],e[a]));return t}function Sa(e){const t=K(e);return t[t.length-1]??0}function Ct(e,t){if(t.length<2)return null;const a=K(t);let o=null;for(let s=0;s<t.length-1;s++){const i=t[s],d=t[s+1],{t:h,pt:f,dist:l}=Fn(e,i,d),m=a[s]+h*(a[s+1]-a[s]);(!o||l<o.distanceFrom)&&(o={distanceAlong:m,distanceFrom:l,pointOnLine:f,segmentIndex:s})}return o}function Fn(e,t,a){const o=(t[1]+a[1])/2*(Math.PI/180),s=([G,_])=>[G*Math.cos(o)*111320,_*111320],[i,d]=s(e),[h,f]=s(t),[l,m]=s(a),g=l-h,v=m-f;let k=g===0&&v===0?0:((i-h)*g+(d-f)*v)/(g*g+v*v);k=Math.max(0,Math.min(1,k));const S=h+k*g,w=f+k*v,x=Math.hypot(i-S,d-w),j=[t[0]+k*(a[0]-t[0]),t[1]+k*(a[1]-t[1])];return{t:k,pt:j,dist:x}}function Fe(e,t){const a=K(e),o=a[a.length-1],s=Math.max(0,Math.min(o,t));for(let i=0;i<a.length-1;i++)if(s>=a[i]&&s<=a[i+1]){const d=a[i+1]-a[i],h=d===0?0:(s-a[i])/d,f=e[i],l=e[i+1];return[f[0]+h*(l[0]-f[0]),f[1]+h*(l[1]-f[1])]}return e[e.length-1]}function jn(e,t){const a=K(e),o=a[a.length-1];if(t<=0)return{before:[],after:e};if(t>=o)return{before:e,after:[]};const s=Fe(e,t);let i=0;for(let f=0;f<a.length-1;f++)if(t>=a[f]&&t<=a[f+1]){i=f;break}const d=[...e.slice(0,i+1),s],h=[s,...e.slice(i+1)];return{before:d,after:h}}const It="lycian-2026-trail-progress-m",Gn=300;function $e(){try{const e=localStorage.getItem(It);return e?Number(e):0}catch{return 0}}function Hn(e){try{localStorage.setItem(It,String(e))}catch{}}function _a(e,t){if(!e||t.length<2)return $e();const a=Ct(e,t);if(!a||a.distanceFrom>Gn)return $e();const o=$e();return a.distanceAlong>o?(Hn(a.distanceAlong),a.distanceAlong):o}function Wn(e){const t={west:180,south:90,east:-180,north:-90};for(const[a,o]of e)t.west=Math.min(t.west,a),t.east=Math.max(t.east,a),t.south=Math.min(t.south,o),t.north=Math.max(t.north,o);return t}function Nn(e,[t,a],o,s,i){return[i+(t-e.west)/(e.east-e.west)*(o-2*i),i+(1-(a-e.south)/(e.north-e.south))*(s-2*i)]}function ct(e,t,a=3){return e.length<2?"":`<path d="${e.map((s,i)=>`${i===0?"M":"L"}${s[0].toFixed(1)},${s[1].toFixed(1)}`).join(" ")}" fill="none" stroke="${t}" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`}function Rn(e,{config:t,places:a,master:o,waterList:s,gpsPosition:i}){const l=Wn(o.coords),m=_=>Nn(l,_,400,640,30),g=t.routeProgress?.untraveled??"#AAAAAA",v=t.routeProgress?.traveled??"#00FF80";let k=ct(o.coords.map(m),g);const{before:S}=jn(o.coords,$e());S.length>=2&&(k+=ct(S.map(m),v));const w=([_,u])=>_>=l.west-.02&&_<=l.east+.02&&u>=l.south-.02&&u<=l.north+.02,x=a.filter(_=>w(_.coordinates)).map(_=>{const[u,T]=m(_.coordinates);return`<circle cx="${u}" cy="${T}" r="5" fill="${Bn(t,_.status)}" stroke="#0e1613" stroke-width="1.5"/>
      <text x="${u+8}" y="${T+4}" font-size="10" fill="#eef2ee">${p(_.name)}</text>`}).join(""),j=s.filter(_=>_.kind==="source").map(_=>{const[u,T]=m(_.coordinates);return`<circle cx="${u}" cy="${T}" r="3.5" fill="#00A3FF" stroke="#0e1613" stroke-width="1"/>`}).join(""),G=i&&w([i.lon,i.lat])?(()=>{const[_,u]=m([i.lon,i.lat]);return`<circle cx="${_}" cy="${u}" r="7" fill="${t.gps?.markerColor??"#1A73E8"}" opacity="0.9"/>`})():"";e.innerHTML=`
    <svg viewBox="0 0 400 640" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;background:#182420;">
      ${k}${j}${x}${G}
    </svg>
  `}let le=null,J=null;const je=new Set;let ee=null,U=null,Ge=null,Bt=7e3;function Dn({updateIntervalSeconds:e}={}){e&&(Bt=e*1e3)}function He(e){return je.add(e),(ee||U)&&e({position:ee,error:U}),()=>je.delete(e)}function We(){for(const e of je)e({position:ee,error:U})}function dt(){Ge&&(ee=Ge,U=null,We()),J=null}function Ot(){if(le===null){if(U=null,!("geolocation"in navigator)){U={code:"unsupported",message:"Geolocation not supported in this browser."},We();return}le=navigator.geolocation.watchPosition(e=>{Ge={lat:e.coords.latitude,lon:e.coords.longitude,accuracy:e.coords.accuracy,heading:typeof e.coords.heading=="number"&&!Number.isNaN(e.coords.heading)?e.coords.heading:null,timestamp:e.timestamp},ee||dt(),J===null&&(J=setTimeout(dt,Bt))},e=>{U={code:e.code,message:e.message},We()},{enableHighAccuracy:!0,maximumAge:5e3,timeout:15e3})}}function zn(){le!==null&&(navigator.geolocation.clearWatch(le),le=null),J!==null&&(clearTimeout(J),J=null)}function se(){return ee}function ye(e){return String(e??"").replace(/[<>&'"]/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"})[t])}function pt([e,t],a,o,s){return`  <wpt lat="${t}" lon="${e}"><name>${ye(a)}</name>${o?`<desc>${ye(o)}</desc>`:""}${s?`<sym>${s}</sym>`:""}</wpt>`}function Un({trail:e,itinerary:t,routes:a,waterList:o,accommodation:s}){const i=new Map(t.map(l=>[l.id,l])),d=new Map(a.map(l=>[l.dayId,l])),h=[];for(const l of o){const m=l.kind==="source"?n("Water: spring/tap","Вода: источник"):n("Water: buy","Вода: купить"),g=l.kind==="source"?n("May be dry in October — not your only source","В октябре может быть сухим — не рассчитывать как на единственный"):l.osmType??"";h.push(pt(l.coordinates,`${m} — ${l.name}`,g,l.kind==="source"?"Drinking Water":"Shopping Center"))}for(const l of s){if(!l.coordinates||l.status==="red")continue;const m=[l.priceInfo,l.address,l.phone,l.checkIn&&`Check-in ${l.checkIn}`].filter(Boolean).join(" · ");h.push(pt(l.coordinates,`${n("Sleep","Ночёвка")}: ${l.name}`,m,l.type==="hotel"?"Lodging":"Campground"))}const f=e.days.map(l=>{const m=i.get(l.dayId),g=d.get(l.dayId),v=`${m?.date??l.dayId} ${g?.name??`${l.from} → ${l.to}`}`,k=l.coordinates.map(([S,w,x])=>`      <trkpt lat="${w}" lon="${S}"><ele>${x}</ele></trkpt>`).join(`
`);return`  <trk><name>${ye(v)}</name><desc>${ye(`${l.distanceKm} km, +${l.ascentM}/-${l.descentM} m (track)`)}</desc><trkseg>
${k}
    </trkseg></trk>`});return`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Lycian Way 2026" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>Lycian Way 2026 — Ovacık → Xanthos</name><desc>Cleaned track (source: trekkingmania 2024 GPX), water and lodging points. Map data © OpenStreetMap contributors.</desc></metadata>
${h.join(`
`)}
${f.join(`
`)}
</gpx>`}function Zn(e,t="lycian-way-2026.gpx"){const a=new Blob([e],{type:"application/gpx+xml"}),o=URL.createObjectURL(a),s=document.createElement("a");s.href=o,s.download=t,document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(o),1e3)}const ve="lycian-2026-checklist-";function Kn(e){try{const t=localStorage.getItem(ve+e);return t?JSON.parse(t):null}catch{return null}}function de(e,t){try{localStorage.setItem(ve+e,JSON.stringify(t))}catch{}}let Ne=1;function Vn(e){try{return new Set(JSON.parse(localStorage.getItem(`${ve}${e}-seeded`)??"null")??[])}catch{return null}}function ut(e,t){try{localStorage.setItem(`${ve}${e}-seeded`,JSON.stringify([...t]))}catch{}}function we(e){const t=[...e.preTripTasks??[],...e.tasks??[]];let a=Kn(e.id);if(!a)return a=t.map(i=>({id:`seed-${Ne++}`,text:i,done:!1})),de(e.id,a),ut(e.id,new Set(t)),a;const o=Vn(e.id)??new Set(a.map(i=>i.text)),s=t.filter(i=>!o.has(i)&&!a.some(d=>d.text===i));return s.length&&(a.push(...s.map(i=>({id:`seed-${Date.now()}-${Ne++}`,text:i,done:!1}))),de(e.id,a)),t.forEach(i=>o.add(i)),ut(e.id,o),a}function Xn(e,t){const a=we(e);return a.push({id:`custom-${Date.now()}-${Ne++}`,text:t,done:!1}),de(e.id,a),a}function Yn(e,t){const a=we(e),o=a.find(s=>s.id===t);return o&&(o.done=!o.done),de(e.id,a),a}function Jn(e){const t=we(e).filter(a=>!a.done);return de(e.id,t),t}function qt(e){const t=[],a=[],o=[];for(const i of e.days){const d=i.coordinates,h=t.length>0,f=h?t.length-1:0;for(let l=h?1:0;l<d.length;l++)t.push([d[l][0],d[l][1]]),a.push(d[l][2]);o.push({...i,startIdx:f,endIdx:t.length-1})}const s=K(t);for(const i of o)i.startM=s[i.startIdx],i.endM=s[i.endIdx];return{coords:t,ele:a,cum:s,days:o}}function Qn(e,t){return e.days.find(a=>t>=a.startM-1&&t<=a.endM+1)??null}function re(e,[t,a]){const o=Ct([t,a],e.coords);return o?{alongM:o.distanceAlong,offTrailM:o.distanceFrom,point:o.pointOnLine,day:Qn(e,o.distanceAlong)}:null}function Ft(e,{pois:t,water:a,food:o}){const s=[],i=[],d=f=>i.some(l=>Math.abs(l[0]-f[0])<8e-4&&Math.abs(l[1]-f[1])<8e-4),h=f=>{const l=re(e,f.coordinates);l&&(s.push({...f,alongM:l.alongM,offTrailM:l.offTrailM}),i.push(f.coordinates))};for(const f of a?.waterPoints??[])h({id:f.id,kind:"source",name:f.name,coordinates:f.coordinates,osmType:f.waterType,notes:f.notes,curated:!0});for(const f of o??[])f.coordinates&&h({id:f.id,kind:"buy",name:f.name,coordinates:f.coordinates,osmType:f.category,curated:!0});for(const f of t?.water??[])d(f.coordinates)||h(f);for(const f of t?.buy??[])d(f.coordinates)||h(f);return s.sort((f,l)=>f.alongM-l.alongM)}function ft(e,t,a){return e.find(o=>o.alongM>t+20&&(!a||o.kind===a))??null}function ea(e){let t=0;for(let a=1;a<e.length;a++){const o=e[a-1],s=e[a],i=K([[o[0],o[1]],[s[0],s[1]]])[1];if(i<.5)continue;const d=(s[2]-o[2])/i,h=6*Math.exp(-3.5*Math.abs(d+.05));t+=i/1e3/h}return t}function ta(e,t=8){const a=e.map(h=>h[2]),o=a.map((h,f)=>{const l=a.slice(Math.max(0,f-1),f+2);return l.reduce((m,g)=>m+g,0)/l.length});let s=0,i=0,d=o[0];for(const h of o)h-d>=t?(s+=h-d,d=h):d-h>=t&&(i+=d-h,d=h);return{ascentM:Math.round(s),descentM:Math.round(i)}}function jt(e){const t=e/1e3,a=t<10?t.toFixed(1):String(Math.round(t));return R==="ru"?a.replace(".",","):a}function C(e){return e<1e3?`${Math.round(e/10)*10} ${n("m","м")}`:`${jt(e)} ${n("km","км")}`}function na(e){const t=Math.floor(e),a=Math.round((e-t)*60);return t?`${t} ${n("h","ч")} ${String(a).padStart(2,"0")} ${n("min","мин")}`:`${a} ${n("min","мин")}`}function Gt(e,{width:t=320,height:a=90,marks:o=[],color:s="#4BD947"}={}){if(!e||e.length<2)return"";const i=K(e.map(u=>[u[0],u[1]])),d=i.at(-1)||1,h=e.map(u=>u[2]),f=Math.min(...h),l=Math.max(...h),m=8,g=16,v=30,k=Math.max(20,l-f),S=u=>v+u/d*(t-v-4),w=u=>m+(1-(u-f)/k)*(a-m-g),x=e.map((u,T)=>`${T?"L":"M"}${S(i[T]).toFixed(1)},${w(u[2]).toFixed(1)}`).join(" "),j=`${x} L${S(d).toFixed(1)},${a-g} L${v},${a-g} Z`,G=o.map(u=>{const T=S(Math.max(0,Math.min(d,u.m)));return`<line x1="${T}" x2="${T}" y1="${m}" y2="${a-g}" stroke="${u.color??"#00A3FF"}" stroke-width="1.5" stroke-dasharray="2 2"/>`}).join(""),_=`pg${Math.random().toString(36).slice(2,8)}`;return`<svg class="profile-svg" viewBox="0 0 ${t} ${a}" width="100%" role="img" aria-label="${n("Elevation profile","Профиль высот")}">
    <defs><linearGradient id="${_}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${s}" stop-opacity="0.45"/><stop offset="1" stop-color="#000" stop-opacity="0.1"/></linearGradient></defs>
    <path d="${j}" fill="url(#${_})"/>
    <path d="${x}" fill="none" stroke="${s}" stroke-width="2"/>
    ${G}
    <text x="2" y="${m+8}" font-size="9" fill="currentColor">${Math.round(l)} ${n("m","м")}</text>
    <text x="2" y="${a-g}" font-size="9" fill="currentColor">${Math.round(f)} ${n("m","м")}</text>
    <text x="${v}" y="${a-3}" font-size="9" fill="currentColor">0</text>
    <text x="${t-4}" y="${a-3}" font-size="9" fill="currentColor" text-anchor="end">${jt(d)} ${n("km","км")}</text>
  </svg>`}const aa={place:n("Waypoint","Точка"),source:n("Water: spring/tap","Вода: источник"),buy:n("Water: buy","Вода: купить"),food:n("Food / resupply","Еда / магазин"),sleep:n("Sleep","Ночёвка"),transport:n("Transport","Транспорт"),attraction:n("Place to see","Достопримечательность"),hazard:n("Watch out","Внимание"),fuel:n("Gas","Газ"),gpx:n("GPX waypoint","Точка из GPX")},Ht="lycian-2026-gps-on",ht=100,oa=5e3;function sa(e,t){const a=new Date().toISOString().slice(0,10),o=t.trip.startDate,s=t.trip.endDate;return a<o?e[0]:a>s?e[e.length-1]:e.find(i=>i.date===a)??e[0]}function ra(e){return"orange"}function ia(){try{return localStorage.getItem(Ht)==="1"}catch{return!1}}function la(e){try{localStorage.setItem(Ht,e?"1":"0")}catch{}}const ca=n(`
  <p><strong>Location access is blocked.</strong> To turn it on:</p>
  <p><strong>iPhone (Safari or home-screen icon):</strong> Settings → Privacy &amp; Security → Location Services → on; below, "Safari Websites" → "While Using the App". Then in Safari: "aA" in the address bar → Website Settings → Location → Allow. Reload the page.</p>
  <p><strong>Android (Chrome):</strong> pull down the quick settings and turn on Location. In Chrome: ⋮ → Settings → Site settings → Location → allow jlazdes.github.io (or the lock icon left of the address → Permissions → Location). Reload the page.</p>
  <p style="color:var(--text-dim);font-size:0.75rem;">GPS works without internet — it only needs location access.</p>
`,`
  <p><strong>Доступ к геолокации запрещён.</strong> Как включить:</p>
  <p><strong>iPhone (Safari или иконка на главном экране):</strong> Настройки → Конфиденциальность и безопасность → Службы геолокации → включить; ниже «Сайты Safari» → «При использовании». Затем в Safari: «аА» в адресной строке → Настройки веб-сайта → Геопозиция → Разрешить. Перезагрузите страницу.</p>
  <p><strong>Android (Chrome):</strong> опустите шторку и включите «Местоположение». В Chrome: ⋮ → Настройки → Настройки сайтов → Геоданные → разрешить для jlazdes.github.io (или значок замка слева от адреса → Разрешения → Геоданные). Перезагрузите страницу.</p>
  <p style="color:var(--text-dim);font-size:0.75rem;">GPS работает и без интернета — нужен только доступ к геолокации.</p>
`);async function da(e){const[t,a,o,s,i,d,h,f,l,m,g,v,k]=await Promise.all([De(),kt(),Mt(),St(),Ln(),xn(),xt(),_n(),_t(),Lt(),ze(),At(),Tt()]);Dn(t.gps);const S=qt(v),w=Ft(S,{pois:k,water:s,food:h}),x=new Map(a.map(r=>[r.id,r])),j=new Map(o.map(r=>[r.dayId,r])),G=new Map(g.map(r=>[r.id,r])),_=[];x.get("place-xanthos")&&x.get("place-kas")&&_.push({id:"transport-dolmus-xanthos-kas",coordinates:[x.get("place-xanthos").coordinates,x.get("place-kas").coordinates]});const u=sa(g,t),T=d.filter(r=>!r.affects?.routeIds?.length);e.innerHTML=`
    <div class="map-screen">
      <div id="map-canvas-wrap"></div>
      <div id="map-fallback-note" class="map-fallback-note notice" hidden><span class="notice__text"></span><button class="notice__close" aria-label="${n("Close","Закрыть")}">&times;</button></div>
      <div id="offtrail-banner" class="offtrail-banner notice" hidden><span class="notice__text"></span><button class="notice__close" aria-label="${n("Close","Закрыть")}">&times;</button></div>

      <div class="today-widget" id="today-widget">
        <div class="today-widget__top">
          <button class="today-widget__header" id="today-widget-toggle">
            <span>${n("Tasks","Задачи")}</span>
            <span class="today-widget__chevron" id="today-widget-chevron">&#8964;</span>
          </button>
          <button class="today-widget__icon" id="today-full-btn" title="${n("Full screen","На весь экран")}" aria-label="${n("Full screen","На весь экран")}" aria-pressed="false">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M4 4h6v2H6v4H4V4Zm10 0h6v6h-2V6h-4V4ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4Z"/></svg>
          </button>
        </div>
        <div class="today-widget__days">
          <button class="today-widget__arrow" id="day-prev" aria-label="${n("Previous day","Предыдущий день")}">&#8249;</button>
          <span id="day-label"></span>
          <button class="today-widget__arrow" id="day-next" aria-label="${n("Next day","Следующий день")}">&#8250;</button>
        </div>
        <div class="today-widget__body" id="today-widget-body">
          <div class="today-widget__alerts" id="today-alerts"></div>
          <div class="today-widget__list" id="today-tasks-list"></div>
          <button class="today-widget__add" id="today-add-btn">${n("+ Add item","+ Добавить")}</button>
          <div class="today-widget__completed-header" id="today-completed-header" hidden>
            <span>${n("Completed","Сделано")}</span>
            <button id="today-clear-btn" title="${n("Clear completed","Очистить")}" aria-label="${n("Clear completed","Очистить")}">🗑</button>
          </div>
          <div class="today-widget__list today-widget__list--completed" id="today-completed-list"></div>
          <a href="#/itinerary/${u.id}" id="today-full-day" class="today-widget__full-day">${n("Full day view","Весь день")} &rarr;</a>
        </div>
      </div>

      <button class="map-round-btn" id="locate-btn" title="${n("Where am I","Где я")}" aria-label="${n("Where am I","Где я")}" aria-pressed="false">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 3h-2.07A7 7 0 0 0 13 5.07V3h-2v2.07A7 7 0 0 0 5.07 11H3v2h2.07A7 7 0 0 0 11 18.93V21h2v-2.07A7 7 0 0 0 18.93 13H21v-2Zm-9 6a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/></svg>
      </button>

      <button class="map-round-btn map-round-btn--layers" id="layers-btn" title="${n("Map layers","Слои карты")}" aria-label="${n("Map layers","Слои карты")}" aria-expanded="false">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="m12 3 10 5.5-10 5.5L2 8.5 12 3Zm-7.6 9.3L12 16.5l7.6-4.2 2.4 1.3-10 5.5-10-5.5 2.4-1.3Z"/></svg>
      </button>
      <div class="layers-menu" id="layers-menu" hidden>
        <button data-layer="topo" aria-pressed="true">${n("Topo","Топо")} <span class="layers-menu__note">${n("offline: corridor map","офлайн: карта коридора")}</span></button>
        <button data-layer="map">${n("Map","Карта")} <span class="layers-menu__note">${n("needs internet","нужен интернет")}</span></button>
        <button data-layer="satellite">${n("Satellite","Спутник")} <span class="layers-menu__note">${n("needs internet","нужен интернет")}</span></button>
      </div>
      <button class="map-round-btn map-round-btn--measure" id="measure-btn" title="${n("Measure along the trail","Измерить по тропе")}" aria-label="${n("Measure along the trail","Измерить по тропе")}" aria-pressed="false">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3 17.3 17.3 3 21 6.7 6.7 21 3 17.3Zm3.7 1.3 1-1-1.6-1.6.9-.9 1.6 1.6 1.2-1.2-1-1 .9-.9 1 1 1.2-1.2-1.6-1.6.9-.9 1.6 1.6 1.2-1.2-1-1 .9-.9 1 1 1.2-1.2-1.6-1.6.9-.9 1.6 1.6 1-1-1.3-1.3L5.4 17.3l1.3 1.3Z"/></svg>
      </button>

      <div id="gps-panel" class="gps-panel" hidden></div>
      <div id="measure-panel" class="gps-panel measure-panel" hidden></div>

      <button class="map-fab map-fab--demo" id="demo-btn">${n("▶ Play Demo","▶ Демо")}</button>
      <button class="map-fab map-fab--stop-demo" id="demo-stop-btn" hidden>${n("✕ End Demo","✕ Стоп")}</button>
      <button class="map-fab map-fab--water" id="water-only-btn" aria-pressed="false">💧 ${n("Water only","Только вода")}</button>
      <button class="map-fab map-fab--gpx" id="gpx-btn" title="${n("Download GPX","Скачать GPX")}" aria-label="${n("Download GPX","Скачать GPX")}">GPX</button>

      <div id="poi-panel" class="poi-panel" hidden>
        <button class="poi-panel__close" id="poi-close-btn" aria-label="Close">&times;</button>
        <div id="poi-panel-body"></div>
      </div>
    </div>
  `;const Rt=e.querySelector("#today-tasks-list"),Dt=e.querySelector("#today-completed-list"),zt=e.querySelector("#today-completed-header");let F=Math.max(0,g.indexOf(u));const be=e.querySelector("#day-label"),Ut=e.querySelector("#today-full-day"),Zt=r=>new Date(`${r}T12:00:00`).toLocaleDateString(n("en-GB","ru-RU"),{weekday:"short",day:"numeric",month:"short"});function Me(){const r=g[F];be.textContent=`${Zt(r.date)}${r.title?` · ${r.title}`:""}`,be.title=be.textContent,Ut.href=`#/itinerary/${r.id}`,e.querySelector("#day-prev").disabled=F===0,e.querySelector("#day-next").disabled=F===g.length-1,pe()}e.querySelector("#day-prev").addEventListener("click",()=>{F>0&&(F--,Me())}),e.querySelector("#day-next").addEventListener("click",()=>{F<g.length-1&&(F++,Me())});const Ue=e.querySelector("#today-widget"),Ze=e.querySelector("#today-full-btn");Ze.addEventListener("click",()=>{const r=!Ue.classList.contains("today-widget--full");Ue.classList.toggle("today-widget--full",r),Ze.setAttribute("aria-pressed",String(r)),r&&(_e.hidden=!1,Xe.style.transform="rotate(0deg)")});const Ke="lycian-2026-hidden-alerts",ke=(()=>{try{return new Set(JSON.parse(localStorage.getItem(Ke)??"[]"))}catch{return new Set}})(),Se=e.querySelector("#today-alerts");function Ve(){const r=T.filter(c=>!ke.has(c.id));Se.hidden=!r.length,Se.innerHTML=r.map(c=>`
      <div class="today-alert" data-id="${c.id}">
        <div class="today-alert__row">
          ${N(t,c.status)}
          <span class="today-alert__title">${p(c.title)}</span>
          <button class="notice__close" data-hide="${c.id}" aria-label="${n("Hide","Скрыть")}">&times;</button>
        </div>
        <div class="today-alert__more" hidden>
          <p>${p(c.description??"")}</p>
          <a href="#/knowledge/safety">${n("Safety notes","Безопасность")} &rarr;</a>
        </div>
        <button class="today-alert__toggle" data-more>${n("More","Подробнее")}</button>
      </div>`).join("")}Se.addEventListener("click",r=>{const c=r.target.closest("[data-hide]");if(c){ke.add(c.dataset.hide);try{localStorage.setItem(Ke,JSON.stringify([...ke]))}catch{}Ve();return}const y=r.target.closest("[data-more]");if(y){const b=y.closest(".today-alert"),$=b.querySelector(".today-alert__more");$.hidden=!$.hidden,b.classList.toggle("today-alert--open",!$.hidden),y.textContent=$.hidden?n("More","Подробнее"):n("Less","Свернуть")}}),Ve();function pe(){const r=g[F],c=we(r),y=c.filter($=>!$.done),b=c.filter($=>$.done);Rt.innerHTML=y.map($=>`
      <label class="today-widget__item">
        <input type="checkbox" data-id="${$.id}" />
        <span>${p($.text)}</span>
      </label>
    `).join("")||`<p class="empty-state" style="padding:6px 0;">${n("Nothing left — nice.","Всё сделано!")}</p>`,zt.hidden=b.length===0,Dt.innerHTML=b.map($=>`
      <label class="today-widget__item today-widget__item--done">
        <input type="checkbox" data-id="${$.id}" checked />
        <span>${p($.text)}</span>
      </label>
    `).join(""),e.querySelectorAll("#today-tasks-list input, #today-completed-list input").forEach($=>{$.addEventListener("change",()=>{Yn(g[F],$.dataset.id),pe()})})}e.querySelector("#today-add-btn").addEventListener("click",()=>{const r=prompt(n("Add a task","Новая задача"));r&&r.trim()&&(Xn(g[F],r.trim()),pe())}),e.querySelector("#today-clear-btn").addEventListener("click",()=>{Jn(g[F]),pe()});const Kt=e.querySelector("#today-widget-toggle"),_e=e.querySelector("#today-widget-body"),Xe=e.querySelector("#today-widget-chevron");Me(),Kt.addEventListener("click",()=>{const r=_e.hidden=!_e.hidden;Xe.style.transform=r?"rotate(-90deg)":"rotate(0deg)"});const xe=e.querySelector("#map-canvas-wrap"),ne=e.querySelector("#map-fallback-note"),H={set textContent(r){ne.querySelector(".notice__text").textContent=r},set innerHTML(r){ne.querySelector(".notice__text").innerHTML=r},set hidden(r){ne.hidden=r}};ne.querySelector(".notice__close").addEventListener("click",()=>{ne.hidden=!0});const ae=e.querySelector("#demo-btn"),ue=e.querySelector("#demo-stop-btn"),Ye=e.querySelector("#poi-panel"),Vt=e.querySelector("#poi-panel-body"),Xt=e.querySelector("#poi-close-btn");function Yt(r){const c=re(S,r);if(!c||c.offTrailM>3e3)return"";const y=c.day;return`<p class="poi-panel__meta">${y?`${p(G.get(y.dayId)?.date??"")}: ${C(c.alongM-y.startM)} ${n("from the day start","от старта дня")}`:""}${c.offTrailM>30?` &middot; ${C(c.offTrailM)} ${n("off the trail","от тропы")}`:` &middot; ${n("on the trail","на тропе")}`}</p>`}function Jt(r,c){const[y,b]=r;return`<div class="link-row">
      <a class="btn" target="_blank" rel="noopener" href="${c??`https://www.google.com/maps/search/?api=1&query=${b},${y}`}">Google Maps</a>
      <a class="btn btn-secondary" href="om://map?ll=${b},${y}&n=1">Organic Maps</a>
      <a class="btn btn-secondary" href="mapsme://map?ll=${b},${y}&n=1">maps.me</a>
    </div>`}async function Qt({kind:r,data:c}){const y=c.coordinates??null;let b=c.status,$="";if(r==="source")b=c.curated?ra():"orange",$=`
        <p class="poi-panel__category">${p(c.osmType??"spring")}${c.osm?` &middot; <a href="https://www.openstreetmap.org/${c.osm}" target="_blank" rel="noopener">OSM</a>`:""}</p>
        <p class="poi-warning">${n("May be dry in October — don't rely on it as your only source.","В октябре может быть сухим, не рассчитывать как на единственный.")}</p>
        ${c.notes?`<p>${p(c.notes)}</p>`:""}`;else if(r==="buy")b="neutral",$=`<p class="poi-panel__category">${p(c.osmType??"")}${c.osm?` &middot; <a href="https://www.openstreetmap.org/${c.osm}" target="_blank" rel="noopener">OSM</a>`:""}</p>
        <p>${n("Buy water — reliable (shop / café). Opening hours not checked.","Купить воду — надёжно (магазин / кафе). Часы работы не проверены.")}</p>`;else if(r==="food")$=`<p class="poi-panel__category">${p(c.category??"food")}</p>`;else if(r==="fuel")$=`<p class="poi-panel__category">gas &middot; stock of EN417 canisters ${c.canisterStockConfirmed?"confirmed":"not confirmed"}</p>`;else if(r==="sleep")$=`<p class="poi-panel__category">${p(c.type??"camp")}${c.booked?` &middot; <strong>${n("booked","забронировано")}</strong>`:""}</p>
        ${c.address?`<p>${p(c.address)}</p>`:""}
        ${c.phone?`<p><a href="tel:${c.phone.replace(/\s/g,"")}">${p(c.phone)}</a></p>`:""}
        ${c.checkIn?`<p>${n("Check-in","Заезд")}: ${p(c.checkIn)}<br>${n("Check-out","Выезд")}: ${p(c.checkOut??"")}</p>`:""}
        <p>${p(c.priceInfo??"")}</p>`;else if(r==="transport"){const M=c.details?.segments??(c.details?.flightNo?[c.details]:[]);$=`<p class="poi-panel__category">${p(c.mode??"transport")}${c.date?` &middot; ${p(c.date)}`:""}</p>
        ${M.map(L=>`<p><strong>${p(L.flightNo)}</strong> ${p(L.from)} ${p(L.depart)} → ${p(L.to)} ${p(L.arrive)}</p>`).join("")}`}else if(r==="attraction"){const M=c.category==="ruins"?`<a href="#/knowledge/ancient-lycia">${n("More on Ancient Lycia","Подробнее о Ликии")} &rarr;</a>`:"";$=`<p class="poi-panel__category">${p(c.category)}</p><p>${p(c.shortDescription??"")}</p>${M?`<p>${M}</p>`:""}`}else r==="hazard"?$=`<p><a href="#/knowledge/route-decisions">${n("Route decisions","Решения по маршруту")} &rarr;</a> &middot; <a href="#/knowledge/safety">${n("Safety notes","Безопасность")} &rarr;</a></p>`:r==="gpx"&&(b="neutral",$=`<p class="poi-panel__category">${p(c.categoryLabel)}</p><p style="color:var(--text-dim);font-size:0.75rem;">${n("From the trekkingmania GPX (2024) — may be outdated.","Из GPX trekkingmania (2024) — может быть устаревшим.")}</p>`);const B=await Promise.all((c.sources??[]).map(M=>En(M))),q=y??x.get(c.placeId)?.coordinates;Vt.innerHTML=`
      <div class="pill-row">${N(t,b??"neutral")}<span class="pill">${p(aa[r]??r)}</span></div>
      <h3>${p(c.name)}</h3>
      ${q?Yt(q):""}
      ${$}
      ${c.notes&&r!=="source"?`<p>${p(c.notes)}</p>`:""}
      ${c.confidence?`<p style="font-size:0.75rem;color:var(--text-dim);">${n("Confidence","Достоверность")}: ${p(c.confidence)}${c.lastVerified?` &middot; ${n("last verified","проверено")} ${p(c.lastVerified)}`:""}</p>`:""}
      ${B.filter(Boolean).length?`<div class="section-title">${n("Sources","Источники")}</div>${B.filter(Boolean).map(M=>M.url?`<p><a href="${M.url}" target="_blank" rel="noopener">${p(M.title)}</a></p>`:`<p>${p(M.title)}</p>`).join("")}`:""}
      ${q?Jt(q,c.googleMapsUrl):""}
    `,Ye.hidden=!1}function Le(){Ye.hidden=!0}Xt.addEventListener("click",Le);function en(){H.textContent=n("Simplified view — the map could not start on this device.","Упрощённая схема — карта не запустилась на этом устройстве."),H.hidden=!1,Rn(xe,{config:t,places:a,master:S,waterList:w,gpsPosition:se()})}let A=null;try{const{mountMapLibre:r}=await Sn(async()=>{const{mountMapLibre:c}=await import("./map-cRY3wE8l.js");return{mountMapLibre:c}},[]);xe.innerHTML='<div id="maplibre-container" style="width:100%;height:100%;"></div>',A=await r(xe.querySelector("#maplibre-container"),{config:t,places:a,routes:o,food:h,fuel:f,accommodation:l,transport:m,attractions:i,master:S,waterList:w,pois:k,transportLines:_}),A.setOnPoiClick(c=>{if(D&&(c.data.coordinates??x.get(c.data.placeId)?.coordinates)){at(c.data.coordinates??x.get(c.data.placeId).coordinates);return}Qt(c)}),A.mode==="offline-map"?(H.textContent=n("Offline: corridor map ±2 km","Офлайн: карта коридора ±2 км"),H.hidden=!1):A.mode==="offline-blank"&&(H.innerHTML=n('Offline — base map not downloaded. Trail and points still work. <a href="#/knowledge">Download map</a>','Офлайн — подложка не скачана. Трек и точки работают. <a href="#/knowledge">Скачать карту</a>'),H.hidden=!1)}catch(r){console.warn("MapLibre failed to load, falling back to the SVG corridor view",r),en()}const Ae=e.querySelector("#locate-btn"),O=e.querySelector("#gps-panel"),W=e.querySelector("#offtrail-banner");let oe=!1,Te=!1,D=!1,Ee=!1,Pe=!1;const tn=W.querySelector(".notice__text");W.querySelector(".notice__close").addEventListener("click",()=>{Pe=!0,W.hidden=!0});const Ce=()=>`<button class="gps-panel__close" data-dismiss aria-label="${n("Close","Закрыть")}">&times;</button>`;O.addEventListener("click",r=>{r.target.closest("[data-dismiss]")&&(Ee=!0,O.hidden=!0)});function fe(r,c){if(!oe){O.hidden=!0,W.hidden=!0;return}if(O.hidden=D||Ee,c&&!r){c.code===1?O.innerHTML=`<button class="gps-panel__close" data-dismiss aria-label="${n("Close","Закрыть")}">&times;</button>${ca}`:O.innerHTML=`<button class="gps-panel__close" data-dismiss aria-label="${n("Close","Закрыть")}">&times;</button><p>${n("Can't get a location fix","Не удаётся определить местоположение")}: ${p(c.message)}. ${n("Move to open ground and wait.","Выйдите на открытое место и подождите.")}</p>`,W.hidden=!0;return}if(!r){O.innerHTML=`${Ce()}<p>${n("Finding GPS…","Ищем GPS…")}</p>`;return}const y=re(S,[r.lon,r.lat]),b=`±${Math.round(r.accuracy??0)} ${n("m","м")}`;if(!y||y.offTrailM>oa){W.hidden=!0,O.innerHTML=`${Ce()}<p><strong>${n("You are far from the route","Вы далеко от маршрута")}</strong> — ${C(y?.offTrailM??0)} ${n("to the trail","до тропы")}. <span class="gps-panel__acc">${b}</span></p>`;return}y.offTrailM<=ht&&(Pe=!1),W.hidden=y.offTrailM<=ht||Pe,tn.textContent=n(`You are ${Math.round(y.offTrailM)} m off the trail`,`Вы в ${Math.round(y.offTrailM)} м от тропы`),requestAnimationFrame(()=>{W.style.bottom=innerWidth<720&&!O.hidden?`${O.getBoundingClientRect().height+126}px`:""});const $=y.day??S.days.at(-1),B=Math.max(0,$.endM-y.alongM),q=j.get($.dayId),M=ft(w,y.alongM,"source"),L=ft(w,y.alongM,"buy");O.innerHTML=`${Ce()}
      <div class="gps-panel__row"><span>${n("To the day's finish","До финиша дня")}${q?` (${p($.to)})`:""}</span><strong>${C(B)}</strong></div>
      <div class="gps-panel__row"><span>💧 ${n("Next spring/tap","Источник впереди")}${M?` — ${p(M.name)}`:""}</span><strong>${M?C(M.alongM-y.alongM):"—"}</strong></div>
      <div class="gps-panel__row"><span>🛒 ${n("Buy water","Купить воду")}${L?` — ${p(L.name)}`:""}</span><strong>${L?C(L.alongM-y.alongM):"—"}</strong></div>
      <div class="gps-panel__foot">${n("along the trail","по тропе")} &middot; ${n("accuracy","точность")} ${b}</div>
    `}function he(r){oe=r,la(r),Ae.classList.toggle("map-round-btn--active",r),Ae.setAttribute("aria-pressed",String(r)),r?(Te=!1,Ot(),fe(se(),null)):(zn(),fe(null,null))}Ae.addEventListener("click",()=>{if(Ee=!1,!oe){he(!0);return}const r=se();r&&A?A.flyTo([r.lon,r.lat]):he(!1)}),He(({position:r,error:c})=>{oe&&(r&&A&&(A.setGpsPosition(r),Te||(Te=!0,A.flyTo([r.lon,r.lat],14))),fe(r,c))}),ia()&&he(!0);const Je=e.querySelector("#layers-btn"),z=e.querySelector("#layers-menu");Je.addEventListener("click",()=>{z.hidden=!z.hidden,Je.setAttribute("aria-expanded",String(!z.hidden)),z.querySelectorAll("[data-layer]").forEach(r=>{r.disabled=r.dataset.layer!=="topo"&&!navigator.onLine})}),z.querySelectorAll("[data-layer]").forEach(r=>{r.addEventListener("click",async()=>{if(!A)return;z.querySelectorAll("[data-layer]").forEach(y=>y.setAttribute("aria-pressed",String(y===r))),z.hidden=!0,(await A.setLayer(r.dataset.layer)).startsWith("offline")&&r.dataset.layer!=="topo"&&(H.textContent=n("No internet — showing the offline map.","Нет интернета — показана офлайн-карта."),H.hidden=!1)})});const Ie=e.querySelector("#measure-btn"),V=e.querySelector("#measure-panel"),Qe=300;let E=null,P=null,me=!1;function et(r,c){const{coords:y,ele:b,cum:$}=S,B=M=>{let L=$.findIndex(on=>on>=M);if(L<=0)return b[0];const an=(M-$[L-1])/Math.max(1,$[L]-$[L-1]);return b[L-1]+an*(b[L]-b[L-1])},q=[[...Fe(y,r),B(r)]];for(let M=0;M<y.length;M++)$[M]>r&&$[M]<c&&q.push([y[M][0],y[M][1],b[M]]);return q.push([...Fe(y,c),B(c)]),q}function nn([r,c]){return`<div class="link-row">
      <span style="font-size:0.72rem;color:var(--text-dim);align-self:center;">${n("Open B in:","Открыть Б в:")}</span>
      <a class="btn btn-secondary" href="om://map?ll=${c},${r}&n=1">Organic Maps</a>
      <a class="btn btn-secondary" href="mapsme://map?ll=${c},${r}&n=1">maps.me</a>
      <a class="btn btn-secondary" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${c},${r}">Google Maps</a>
    </div>
    <p class="gps-panel__foot">${n("Along our track only. No off-trail routing — open the point in an app for that (needs internet or the app's offline maps).","Только по нашему треку. Маршрут вне тропы не прокладывается — для этого откройте точку в приложении (нужен интернет или офлайн-карты в приложении).")}</p>`}function Be(r){if(!D){V.hidden=!0;return}V.hidden=!1,O.hidden=!0;const c=`<button class="gps-panel__close" id="measure-close" aria-label="${n("Close","Закрыть")}">&times;</button><strong>${n("Measure along the trail","Измерить по тропе")}</strong>`,y=`<div class="link-row"><button class="btn btn-secondary" id="measure-from-me">📍 ${n("From me","От меня")}</button><button class="btn btn-secondary" id="measure-reset">${n("Reset","Сбросить")}</button></div>`;let b;if(r)b=`<p>${r}</p>`;else if(!E)b=`<p>${n("Tap point A on the trail — or “From me”.","Тапните точку A на треке — или «От меня».")}</p>`;else if(!P)b=`<p>A: ${C(E.alongM)} ${n("along the trail","по тропе")}${E.fromMe?n(" (you)"," (вы)"):""}. ${n("Now tap point B.","Теперь тапните точку Б.")}</p>`;else{const $=P.alongM>=E.alongM;let B=et(Math.min(E.alongM,P.alongM),Math.max(E.alongM,P.alongM));$||(B=B.reverse());const{ascentM:q,descentM:M}=ta(B),L=Math.abs(P.alongM-E.alongM);b=`
        <div class="gps-panel__row"><span>${n("Distance along the trail","Расстояние по тропе")}</span><strong>${C(L)}</strong></div>
        <div class="gps-panel__row"><span>${n("Gain / loss","Набор / сброс")}</span><strong>+${q} / −${M} ${n("m","м")}</strong></div>
        <div class="gps-panel__row"><span>${n("Time (estimate, Tobler)","Время (оценка, формула Тоблера)")}</span><strong>≈ ${na(ea(B))}</strong></div>
        ${Gt(B,{height:70})}
        ${nn(P.point)}`}V.innerHTML=`${c}${b}${y}`,V.querySelector("#measure-close").addEventListener("click",()=>nt(!1)),V.querySelector("#measure-reset").addEventListener("click",()=>{E=P=null,X()}),V.querySelector("#measure-from-me").addEventListener("click",()=>{const $=se();if($){tt($);return}me=!0,oe||he(!0),Be(n("Waiting for GPS…","Ждём GPS…"))})}function X(r){A?.setMeasurePoints([E,P].filter(Boolean).map(c=>c.point)),E&&P?A?.setMeasureLine(et(Math.min(E.alongM,P.alongM),Math.max(E.alongM,P.alongM)).map(c=>[c[0],c[1]])):A?.setMeasureLine(null),Be(r)}function tt(r){me=!1;const c=re(S,[r.lon,r.lat]);if(!c||c.offTrailM>Qe){X(n(`You are ${C(c?.offTrailM??0)} off the trail — “From me” only works near the track.`,`Вы в ${C(c?.offTrailM??0)} от тропы — «От меня» работает только рядом с треком.`));return}E={alongM:c.alongM,point:c.point,fromMe:!0},P=null,X()}function nt(r){if(D=r,Ie.classList.toggle("map-round-btn--active",r),Ie.setAttribute("aria-pressed",String(r)),e.querySelector(".map-screen").classList.toggle("map-screen--measuring",r),!r){E=P=null,me=!1,X(),fe(se(),null);return}Le(),X()}Ie.addEventListener("click",()=>nt(!D)),A?.setOnMapClick(r=>{D&&at(r)});function at(r){const c=re(S,r);if(!c||c.offTrailM>Qe){Be(n(`Tap closer to the trail (now ${C(c?.offTrailM??0)} away).`,`Тапните ближе к треку (сейчас ${C(c?.offTrailM??0)} от него).`));return}const y={alongM:c.alongM,point:c.point};!E||E&&P?(E=y,P=null):P=y,X()}He(({position:r})=>{D&&me&&r&&tt(r)});const ge=e.querySelector("#water-only-btn");ge.addEventListener("click",()=>{const r=ge.getAttribute("aria-pressed")!=="true";ge.setAttribute("aria-pressed",String(r)),ge.classList.toggle("map-fab--active",r),A?.setWaterOnly(r)}),e.querySelector("#gpx-btn").addEventListener("click",()=>{Zn(Un({trail:v,itinerary:g,routes:o,waterList:w,accommodation:l}))}),A?(ae.addEventListener("click",()=>{Le(),ae.hidden=!0,ue.hidden=!1,A.playDemo(()=>{ae.hidden=!1,ue.hidden=!0})}),ue.addEventListener("click",()=>{A.stopDemo(),ae.hidden=!1,ue.hidden=!0})):ae.hidden=!0}const mt=.15;function gt(e,t){return!e&&!t?"":` <a href="${t??`https://www.google.com/maps/search/?api=1&query=${e[1]},${e[0]}`}" target="_blank" rel="noopener">${n("map","карта")}&nbsp;↗</a>`}function pa(e,t,a,o,s,i){const d=t.allTrails,h=t.metrics.find(w=>w.source==="user_itinerary"),f=d?.distanceKm??h?.distanceKm,l=d?.ascentM??h?.ascentM,m=d?"AllTrails":n("plan","план"),g=(w,x)=>w&&x?Math.abs(w-x)/x:0,v=s&&g(s.distanceKm,f)>mt,k=s&&l&&g(s.ascentM,l)>mt,S=i.map(w=>({m:w.alongM-s.startM,color:w.kind==="source"?"#00A3FF":"#2EC4B6"}));return`
    <div class="card">
      <h3>${n("Route","Маршрут")}</h3>
      <p>${a?p(a.name):"?"} &rarr; ${o?p(o.name):"?"}</p>
      <div class="metric-grid">
        <div class="metric"><div class="metric__value">${f??"—"} ${n("km","км")}</div><div class="metric__label">${m}</div></div>
        <div class="metric"><div class="metric__value">${l!=null?`+${l} ${n("m","м")}`:"—"}</div><div class="metric__label">${n("gain","набор")}, ${m}</div></div>
      </div>
      ${d?.links?.length?`<p>${d.links.map((w,x)=>`<a href="${w}" target="_blank" rel="noopener">AllTrails${d.links.length>1?` ${x+1}`:""}&nbsp;↗</a>`).join(" &middot; ")}</p>`:""}
      ${s?`
        <p style="font-size:0.75rem;">${n("Our track","По нашему треку")}: ${C(s.distanceKm*1e3)}, +${s.ascentM} / −${s.descentM} ${n("m","м")}, ${s.minEleM}–${s.maxEleM} ${n("m above sea level","м над уровнем моря")}${v||k?` — <strong>${n("differs from AllTrails by more than 15%, go by AllTrails","расходится с AllTrails больше чем на 15%, ориентируйтесь на AllTrails")}</strong>`:""}.</p>
        ${Gt(s.coordinates,{marks:S})}
        <p style="font-size:0.7rem;">${n("Profile marks","Метки на профиле")}: <span style="color:#00A3FF">${n("springs/taps","источники")}</span>, <span style="color:#2EC4B6">${n("buy water","купить воду")}</span>.</p>
      `:""}
      ${t.variants?.length?t.variants.map(w=>`
        <p>${N(e,w.status)} <strong>${p(w.name)}</strong> — ${p(w.notes)}</p>
      `).join(""):""}
      ${t.notes?`<p><em>${p(t.notes)}</em></p>`:""}
    </div>`}function ua(e,t){return t?e.length?`
    <div class="section-title">${n("Water on this stage","Вода на участке")}</div>
    <div class="card">
      <ul class="water-list">
        ${e.map(a=>`
          <li>
            <span class="water-list__km">${C(Math.max(0,a.alongM-t.startM))}</span>
            <span class="water-list__name">${a.kind==="source"?"💧":"🛒"} ${p(a.name)}${a.kind==="source"?` <span style="color:var(--status-orange);font-size:0.72rem;">(${n("may be dry","может быть сухим")})</span>`:""}</span>
            <span class="water-list__off">${a.offTrailM>40?`${Math.round(a.offTrailM)} ${n("m off trail","м от тропы")}`:n("on the trail","на тропе")}</span>
          </li>`).join("")}
      </ul>
      <p style="font-size:0.72rem;">${n("💧 spring/tap — may be dry in October, don't rely on it as the only source. 🛒 buy — shop/café (reliable, hours not checked). Distance — from the day start along the trail.","💧 источник — в октябре может быть сухим, не рассчитывать как на единственный. 🛒 купить — магазин/кафе (надёжно, часы не проверены). Расстояние — от старта дня по тропе.")}</p>
    </div>`:`<div class="section-title">${n("Water on this stage","Вода на участке")}</div><div class="card"><p>${n("No water points found — carry enough for the whole day.","Точек воды на участке не найдено — несите запас на весь день.")}</p></div>`:""}async function fa(e){const[t,a]=await Promise.all([De(),ze()]);e.innerHTML=`
    <div class="screen-pad">
      ${Pt()}
      <div class="section-title">${n("Itinerary","План по дням")}</div>
      ${a.map(o=>`
        <a href="#/itinerary/${o.id}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <div class="pill-row"><span class="pill">${p(o.date)}</span>${N(t,o.status)}</div>
          <h3>${p(o.title)}</h3>
          <p>${p(o.summary)}</p>
        </a>
      `).join("")}
    </div>
  `}async function ha(e,{dayId:t}){const[a,o]=await Promise.all([De(),Pn(t)]);if(!o){e.innerHTML=`<div class="screen-pad"><p>${n("Day not found.","День не найден.")}</p></div>`;return}const[s,i,d,h,f]=await Promise.all([Cn(o.routeId),Promise.resolve(o.accommodationIds??[]),xt(),St(),Lt()]),l=(await _t()).filter(u=>o.accommodationIds?.includes(u.id)),[m,g]=await Promise.all([At(),Tt()]),v=qt(m),k=v.days.find(u=>u.dayId===o.id)??null,S=k?Ft(v,{pois:g,water:h,food:d}).filter(u=>u.alongM>=k.startM-50&&u.alongM<=k.endM+50&&u.offTrailM<=1e3):[],w=d.filter(u=>o.foodIds?.includes(u.id)),x=h.waterPoints.filter(u=>o.waterIds?.includes(u.id)),j=f.filter(u=>o.transportIds?.includes(u.id));let G=null,_=null;s&&([G,_]=await Promise.all([rt(s.fromPlaceId),rt(s.toPlaceId)])),e.innerHTML=`
    <div class="screen-pad">
      <a href="#/itinerary" class="btn-secondary btn" style="margin-bottom:12px;display:inline-block;">&larr; ${n("All days","Все дни")}</a>
      <div class="pill-row"><span class="pill">${p(o.date)}</span>${N(a,o.status)}</div>
      <h2 style="margin:6px 0;">${p(o.title)}</h2>
      <p>${p(o.summary)}</p>

      ${s?pa(a,s,G,_,k,S):""}
      ${ua(S,k)}

      ${o.tasks?.length?`<div class="section-title">${n("Tasks","Задачи")}</div><div class="card"><ul>${o.tasks.map(u=>`<li>${p(u)}</li>`).join("")}</ul></div>`:""}
      ${o.preTripTasks?.length?`<div class="section-title">${n("Pre-trip tasks","До поездки")}</div><div class="card"><ul>${o.preTripTasks.map(u=>`<li>${p(u)}</li>`).join("")}</ul></div>`:""}

      ${x.length?`<div class="section-title">${n("Water","Вода")}</div>${x.map(u=>`
        <div class="card"><h3>${p(u.name)}</h3><p>${p(u.waterType)} &middot; ${p(u.status)} &middot; ${p(u.treatment)}</p><p>${p(u.notes)}</p></div>
      `).join("")}`:""}

      ${w.length?`<div class="section-title">${n("Food","Еда")}</div>${w.map(u=>`
        <div class="card">${N(a,u.status)} <strong>${p(u.name)}</strong>${gt(u.coordinates,u.googleMapsUrl)} <p>${p(u.notes)}</p></div>
      `).join("")}`:""}

      ${l.length?`<div class="section-title">${n("Sleep","Ночёвка")}</div>${l.map(u=>`
        <div class="card">${N(a,u.status)} <strong>${p(u.name)}</strong>${u.booked?` <span class="pill">${n("booked","забронировано")}</span>`:""}${gt(u.coordinates,u.googleMapsUrl)}
          ${u.address?`<p>${p(u.address)}</p>`:""}
          ${u.phone?`<p><a href="tel:${u.phone.replace(/\s/g,"")}">${p(u.phone)}</a></p>`:""}
          ${u.checkIn?`<p>${n("Check-in","Заезд")}: ${p(u.checkIn)} &middot; ${n("Check-out","Выезд")}: ${p(u.checkOut??"")}</p>`:""}
          <p>${p(u.priceInfo)}</p><p>${p(u.notes)}</p></div>
      `).join("")}`:""}

      ${j.length?`<div class="section-title">${n("Transport","Транспорт")}</div>${j.map(u=>`
        <div class="card">${N(a,u.status)} <strong>${p(u.name)}</strong>
          ${(u.details?.segments??(u.details?.flightNo?[u.details]:[])).map(T=>`<p><strong>${p(T.flightNo)}</strong> ${p(T.from)} ${p(T.depart)} → ${p(T.to)} ${p(T.arrive)}</p>`).join("")}
          <p>${p(u.notes)}</p></div>
      `).join("")}`:""}

      ${o.highlights?.length?`<div class="section-title">${n("Highlights","Главное")}</div><div class="card"><ul>${o.highlights.map(u=>`<li>${p(u)}</li>`).join("")}</ul></div>`:""}
      ${o.watchOut?.length?`<div class="section-title">${n("Watch out","Внимание")}</div><ul class="warn-list">${o.watchOut.map(u=>`<li>${p(u)}</li>`).join("")}</ul>`:""}
      ${o.backupPlan?`<div class="section-title">${n("Backup plan","Запасной план")}</div><div class="card">${p(o.backupPlan)}</div>`:""}
      ${o.notes?`<p style="color:var(--text-dim);font-size:0.8rem;">${p(o.notes)}</p>`:""}
    </div>
  `}const ma=[["#/itinerary",n("Itinerary","План по дням"),n("Day-by-day plan, 8–18 Oct","План по дням, 8–18 окт")],["#/emergency",n("Emergency","Экстренное"),n("112, GPS, bailout info","112, GPS, как сойти с маршрута")]],ga=["before-we-leave","turkish-phrases","hiker-reports"];async function Wt(e){const[t,a,o,s]=await Promise.all([hn(),mn(),yt(),Promise.all(ga.map(l=>Et(l).then(m=>[l,m])))]);e.innerHTML=`
    <div class="screen-pad">
      <div class="section-title">${n("Save for offline","Офлайн")}</div>
      <div class="card">
        <p id="offline-status">${t?n("Trip data is saved for offline use.","Данные поездки сохранены для офлайна."):n("Trip data is not yet saved for offline use.","Данные поездки ещё не сохранены для офлайна.")}</p>
        <p style="font-size:0.75rem;">${n("The daily track, all markers, day cards, elevation profiles and articles are saved automatically after the first online visit. The button below refreshes them.","Трек по дням, все маркеры, карточки дней, профили высот и статьи сохраняются автоматически после первого открытия онлайн. Кнопка ниже обновляет их вручную.")}</p>
        <button class="btn" id="save-offline-btn">${n("Save for offline","Сохранить офлайн")}</button>
      </div>

      <div class="card">
        <h3>${n("Offline route map","Карта маршрута офлайн")}</h3>
        <p>${n("Base map for a ±2 km corridor around the trail (Ovacık → Xanthos) + Ölüdeniz, Gelemiş, Kaş. Zoom up to 15 — paths, villages and roads. Source: OpenStreetMap / Protomaps, hosted on this site.","Подложка для коридора ±2 км вокруг тропы (Ovacık → Xanthos) + Ölüdeniz, Gelemiş, Kaş. Зумы до 15 — видны тропинки, сёла и дороги. Источник: OpenStreetMap / Protomaps, хранится на нашем сайте.")}</p>
        <p id="map-offline-status">${a?n("✓ Map downloaded — works without internet.","✓ Карта скачана — работает без интернета."):o?`${n("Download size","Размер загрузки")}: <strong>${Oe(o.totalBytes)}</strong> (${o.files.length} ${n("files","файлов")}).`:n("Needs internet to check the size and download.","Нужен интернет, чтобы узнать размер и скачать.")}</p>
        <div class="progress" id="map-progress" hidden><div class="progress__bar" id="map-progress-bar"></div></div>
        <div class="link-row">
          <button class="btn" id="map-download-btn" ${o?"":"disabled"}>${a?n("Update map","Обновить карту"):n("Download route map","Скачать карту маршрута")}</button>
          ${a?`<button class="btn btn-secondary" id="map-delete-btn">${n("Delete","Удалить")}</button>`:""}
        </div>
        <p style="font-size:0.72rem;">${n("Satellite and the map outside the corridor need internet.","Спутник и онлайн-карта вне коридора требуют интернета.")}</p>
      </div>

      <div class="card">
        <h3>${n("Add to home screen","Добавить на главный экран")}</h3>
        <p><strong>iPhone, Safari:</strong></p>
        <ol class="install-steps">
          <li>${n("Open the site in Safari (not Chrome/Telegram).","Откройте сайт в Safari (не в Chrome/Telegram).")}</li>
          <li>${n("Tap Share (square with an up arrow).","Нажмите «Поделиться» (квадрат со стрелкой вверх).")}</li>
          <li>${n("“Add to Home Screen” → “Add”.","«На экран «Домой»» → «Добавить».")}</li>
          <li>${n("Open the app from the icon once while online — after that it works offline.","Откройте приложение с иконки один раз при интернете — после этого оно работает офлайн.")}</li>
        </ol>
        <p><strong>Android, Chrome:</strong></p>
        <ol class="install-steps">
          <li>${n("Open the site in Chrome.","Откройте сайт в Chrome.")}</li>
          <li>${n("⋮ (top-right menu) → “Add to Home screen” or “Install app”.","⋮ (меню справа сверху) → «Добавить на гл. экран» или «Установить приложение».")}</li>
          <li>${n("Confirm “Install”.","Подтвердите «Установить».")}</li>
          <li>${n("Open it from the icon once while online.","Откройте с иконки один раз при интернете.")}</li>
        </ol>
        <p style="font-size:0.72rem;">${n("Note: on iPhone the home-screen app and Safari keep separate storage — download the map in the one you will use on the trail.","Важно: на iPhone данные иконки на главном экране и вкладки Safari хранятся отдельно — скачайте карту именно в том, чем будете пользоваться в походе.")}</p>
      </div>

      <div class="section-title">${n("Trip","Поездка")}</div>
      ${ma.map(([l,m,g])=>`
        <a href="${l}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${p(m)}</h3>
          <p>${p(g)}</p>
        </a>
      `).join("")}

      <div class="section-title">${n("Field guide","Справочник")}</div>
      <p style="color:var(--text-dim);font-size:0.78rem;margin-top:-4px;">${n("Water, food, sleep, transport, safety, and places to see now live as markers on the Map tab — tap a pin for details.","Вода, еда, ночёвки, транспорт, безопасность и достопримечательности — маркерами на карте, нажмите на пин.")}</p>
      ${s.map(([l,m])=>`
        <a href="#/knowledge/${l}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${p(m.meta.title??l)}</h3>
          <p>${n("Confidence","Достоверность")}: ${p(m.meta.confidence??"?")} &middot; ${n("last verified","проверено")} ${p(m.meta.lastVerified??"?")}</p>
        </a>
      `).join("")}
    </div>
  `;const i=e.querySelector("#map-download-btn"),d=e.querySelector("#map-offline-status"),h=e.querySelector("#map-progress"),f=e.querySelector("#map-progress-bar");i.addEventListener("click",async()=>{if(o){i.disabled=!0,h.hidden=!1;try{await gn((l,m)=>{const g=Math.min(100,Math.round(l/m*100));f.style.width=`${g}%`,d.textContent=`${n("Downloading","Загрузка")}: ${Oe(l)} ${n("of","из")} ${Oe(m)} (${g}%)`}),f.style.width="100%",d.textContent=n("✓ Map downloaded — works without internet.","✓ Карта скачана — работает без интернета."),i.textContent=n("Update map","Обновить карту")}catch(l){console.warn(l),d.textContent=n(`Failed: ${l.message}. Check the internet and try again.`,`Не получилось: ${l.message}. Проверьте интернет и попробуйте ещё раз.`)}finally{i.disabled=!1}}}),e.querySelector("#map-delete-btn")?.addEventListener("click",async()=>{await $n(),Wt(e)}),e.querySelector("#save-offline-btn").addEventListener("click",async l=>{const m=l.currentTarget;m.disabled=!0,m.textContent=n("Saving…","Сохраняем…");try{await fn((g,v)=>m.textContent=`${n("Saving","Сохраняем")} ${g}/${v}…`),e.querySelector("#offline-status").textContent=n("Trip data saved for offline use.","Данные поездки сохранены для офлайна."),m.textContent=n("Saved","Сохранено")}catch(g){m.textContent=n("Save failed — retry","Ошибка — повторить"),m.disabled=!1,console.error(g)}})}function $a(e){const t=e.split(`
`);let a="",o=0;for(;o<t.length;){const s=t[o];if(/^\s*$/.test(s)){o++;continue}if(s.startsWith("# ")){a+=`<h2>${ie(s.slice(2))}</h2>`,o++;continue}if(s.startsWith("## ")){a+=`<h3>${ie(s.slice(3))}</h3>`,o++;continue}if(s.startsWith("**")&&s.match(/^\*\*.+\*\*/),s.startsWith("|")){const d=[];for(;o<t.length&&t[o].startsWith("|");)d.push(t[o]),o++;a+=ya(d);continue}if(s.startsWith("- ")){const d=[];for(;o<t.length&&t[o].startsWith("- ");)d.push(t[o].slice(2)),o++;a+=`<ul>${d.map(h=>`<li>${ie(h)}</li>`).join("")}</ul>`;continue}const i=[];for(;o<t.length&&!/^\s*$/.test(t[o])&&!t[o].startsWith("|")&&!t[o].startsWith("- ")&&!t[o].startsWith("#");)i.push(t[o]),o++;a+=`<p>${ie(i.join(" "))}</p>`}return a}function ya(e){e.filter(i=>!/^\|[\s-]+\|$/.test((i.replace(/[^|\s-]/g,""),i)));const a=e.filter(i=>!/^\|(\s*-+\s*\|)+$/.test(i)).map(i=>i.split("|").slice(1,-1).map(d=>d.trim()));if(!a.length)return"";const[o,...s]=a;return`<table class="phrases">
    <tbody>
      ${s.map(i=>`<tr>${i.map(d=>`<td>${ie(d)}</td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>`}function ie(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\[(.+?)\]\((.+?)\)/g,(t,a,o)=>{const s=o.endsWith(".md");return`<a href="${s?`#/knowledge/${o.replace(/\.md$/,"")}`:o}"${s?"":' target="_blank" rel="noopener"'}>${a}</a>`})}async function va(e,{slug:t}){const a=await Et(t);e.innerHTML=`
    <div class="screen-pad">
      <a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge base</a>
      <h2>${p(a.meta.title??t)}</h2>
      <p style="color:var(--text-dim);font-size:0.8rem;">${n("Confidence","Достоверность")}: ${p(a.meta.confidence??"?")} &middot; ${n("last verified","проверено")} ${p(a.meta.lastVerified??"?")}</p>
      <div class="card">${$a(a.body)}</div>
    </div>
  `}async function wa(e){e.innerHTML=`
    <div class="screen-pad">
      ${Pt()}
      <div class="card">
        <h3>${n("Emergency number","Экстренный номер")}</h3>
        <p style="font-size:1.6rem;font-weight:700;">112</p>
        <p>${n("Türkiye's single emergency number — police, ambulance, fire.","Единый номер в Турции — полиция, скорая, пожарные.")}</p>
      </div>

      <div class="card">
        <h3>${n("Forestry Directorate (OGM)","Управление лесного хозяйства (OGM)")}</h3>
        <p>${n("For fire-restriction / forest-entry questions","Вопросы о пожарных ограничениях и входе в лес")}: <a href="https://www.ogm.gov.tr/en" target="_blank" rel="noopener">ogm.gov.tr</a></p>
        <p style="color:var(--text-dim);font-size:0.8rem;">A direct local contact number for the Muğla regional directorate has not been looked up yet.</p>
      </div>

      <div class="card">
        <h3>${n("Your current position","Ваше местоположение")}</h3>
        <div id="emergency-gps"><p>${n("Requesting location…","Определяем местоположение…")}</p></div>
      </div>

      <div class="card">
        <p style="color:var(--text-dim);font-size:0.8rem;">This app is a planning and reference tool. It does not replace a dedicated GPS/satellite communicator for real emergencies in the backcountry.</p>
      </div>
    </div>
  `;const t=e.querySelector("#emergency-gps");He(({position:a,error:o})=>{a?t.innerHTML=`
        <p>${a.lat.toFixed(5)}, ${a.lon.toFixed(5)}</p>
        <p>${n("Accuracy","Точность")}: ±${Math.round(a.accuracy)} ${n("m","м")}</p>
        <div class="link-row">
          <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lon}">Open in Google Maps</a>
        </div>
      `:o&&(t.innerHTML=`<p>${p(o.message)}</p>`)}),Ot()}document.getElementById("app").innerHTML=`
  <header class="app-header">
    <div class="app-header__brand">Lycian Way 2026</div>
    <div class="segmented" role="tablist">
      <button class="segmented__btn" data-view="map" role="tab">${n("Map","Карта")}</button>
      <button class="segmented__btn" data-view="kb" role="tab">${n("Knowledge Base","База знаний")}</button>
    </div>
    <div class="lang">
      <button class="lang__btn" id="lang-btn" aria-label="${n("Language","Язык")}" aria-expanded="false">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-2.95a15.7 15.7 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.9 8ZM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96ZM4.26 14a8.2 8.2 0 0 1 0-4h3.38a16.5 16.5 0 0 0 0 4H4.26Zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.99 7.99 0 0 1 5.08 16Zm2.95-8H5.08a7.99 7.99 0 0 1 4.33-3.56A15.7 15.7 0 0 0 8.03 8ZM12 19.96A14.1 14.1 0 0 1 10.09 16h3.82A14.1 14.1 0 0 1 12 19.96ZM14.34 14H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4Zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56ZM16.36 14a16.5 16.5 0 0 0 0-4h3.38a8.2 8.2 0 0 1 0 4h-3.38Z"/></svg>
      </button>
      <div class="lang__menu" id="lang-menu" hidden>
        <button data-lang="en" aria-pressed="${R==="en"}">English</button>
        <button data-lang="ru" aria-pressed="${R==="ru"}">Русский</button>
      </div>
    </div>
  </header>
  <div id="screen"></div>
`;const Re=document.getElementById("lang-btn"),ce=document.getElementById("lang-menu");Re.addEventListener("click",e=>{e.stopPropagation(),ce.hidden=!ce.hidden,Re.setAttribute("aria-expanded",String(!ce.hidden))});document.addEventListener("click",()=>{ce.hidden=!0,Re.setAttribute("aria-expanded","false")});ce.querySelectorAll("[data-lang]").forEach(e=>e.addEventListener("click",()=>{e.dataset.lang!==R&&rn(e.dataset.lang)}));te("#/map",da);te("#/itinerary",fa);te("#/itinerary/:dayId",ha);te("#/knowledge",Wt);te("#/knowledge/:slug",va);te("#/emergency",wa);const Nt=document.querySelectorAll(".segmented__btn");Nt.forEach(e=>{e.addEventListener("click",()=>{location.hash=e.dataset.view==="map"?"#/map":"#/knowledge"})});vn(e=>{const t=e==="#/map"||e==="";document.getElementById("screen").classList.toggle("screen--full-bleed",t),Nt.forEach(a=>a.classList.toggle("segmented__btn--active",a.dataset.view==="map"===t))});cn();bn();export{n as L,Sn as _,$e as a,Ma as b,ba as g,ka as o,Fe as p,jn as s,Sa as t,_a as u};
//# sourceMappingURL=index-DRN3on6i.js.map
