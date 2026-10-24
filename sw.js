/* Budsjett – service worker
   Henter alltid nyeste versjon når du er på nett, og bruker lagret kopi bare når du er offline. */
const CACHE='budsjett-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  e.respondWith(fetch(req,{cache:'no-store'}).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});return res;})
    .catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
});
