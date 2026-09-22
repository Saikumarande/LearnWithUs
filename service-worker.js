'use strict';
const CACHE='learnwithus-v20260925';
const CORE=['./','./index.html','./food.html','./children.html','./health.html','./dashboard.html','./hindi.html','./telugu.html','./offline.html','./assets/site-shell.css?v=20260925','./assets/site-shell.js?v=20260925','./assets/platform.css?v=20260925','./assets/platform.js?v=20260925','./assets/languages.css?v=20260925','./assets/languages.js?v=20260925','./assets/favicon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(cached=>cached||((event.request.mode==='navigate')?caches.match('./offline.html'):Response.error()))));
});
