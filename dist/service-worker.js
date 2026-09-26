'use strict';
const CACHE='learnwithus-v1.8.1';
const CORE=['./','./index.html','./food.html','./children.html','./early-learning.html','./word-bank.html','./letter-tracing.html','./quiz-hub.html','./counting-quiz.html','./missing-letters-quiz.html','./spelling-quiz.html','./addition.html','./subtraction.html','./multiplication.html','./division.html','./math-quiz.html','./place-value.html','./odd-even.html','./fractions.html','./time-calendar.html','./indian-money.html','./measurement.html','./india.html','./assets/math-extra.js?v=20260926h','./assets/india.css?v=20260926h','./assets/india.js?v=20260926h','./health.html','./dashboard.html','./hindi.html','./telugu.html','./offline.html','./assets/site-shell.css?v=20260926g','./assets/site-shell.js?v=20260926g','./assets/platform.css?v=20260926g','./assets/platform.js?v=20260926g','./assets/languages.css?v=20260926g','./assets/languages.js?v=20260926g','./assets/early-learning.css?v=20260926g','./assets/early-learning.js?v=20260926g','./assets/practice.css?v=20260926g','./assets/word-bank.js?v=20260926g','./assets/practice.js?v=20260926g','./assets/favicon.svg',
  './assets/learning-journey.js',
  './assets/math-extra-quiz.js',
  './assets/india-map-outline.svg',
  './assets/INDIA-MAP-ATTRIBUTION.txt',
  './assets/practice.js?v=20260926k',
  './assets/math-extra.js?v=20260926k',
  './assets/math-extra-quiz.js?v=20260926k',
  './assets/india.css?v=20260926k',
  './assets/india.js?v=20260926k',
  './assets/kids.css?v=20260926m',
  './assets/children.js?v=20260926m',
  './assets/kids-search.js?v=20260926m',
  './assets/score-card.css?v=20260926m',
  './multiplication-tables.html','./multiplication-tables-quiz.html','./planets.html','./countries-capitals.html','./world-quiz.html','./india-quiz.html',
  './assets/site-shell.css?v=20260926p','./assets/site-shell.js?v=20260926p','./assets/practice.css?v=20260926p','./assets/tables.js?v=20260926p','./assets/tables-quiz.js?v=20260926p',
  './assets/tables.js?v=20260926n','./assets/tables-quiz.js?v=20260926n','./assets/world-learning.css?v=20260926n','./assets/world-data.js?v=20260926n','./assets/countries.js?v=20260926n','./assets/world-quiz.js?v=20260926n','./assets/india-data.js?v=20260926n','./assets/india-quiz.js?v=20260926n','./assets/india.js?v=20260926n','./assets/india.css?v=20260926n','./assets/practice.css?v=20260926n','./assets/score-card.js?v=20260926n'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(cached=>cached||((event.request.mode==='navigate')?caches.match('./offline.html'):Response.error()))));
});
