// AMINA CRM — service worker: ilova qobig'ini keshlaydi, ma'lumotlar har doim internetdan
const V = 'amina-crm-v1';
const B = '/amina-crm/';
const SHELL = ['/amina-crm', B + 'app.js', B + 'config.js', B + 'manifest.webmanifest', B + 'icons/icon-192.png', B + 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // API va Google — keshsiz
  // Avval internet, bo'lmasa kesh (yangilanishlar darrov tushadi)
  e.respondWith(fetch(e.request).then(r => {
    const c = r.clone(); caches.open(V).then(ca => ca.put(e.request, c)); return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('/amina-crm'))));
});
