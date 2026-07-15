const CACHE = "lehrerkompass-app-v1";
const CORE = ["/", "/werkbank", "/einstellungen/installation", "/einstellungen/sicherung", "/einstellungen/import", "/einstellungen/daten", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];
self.addEventListener("install", (event) => { event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE))); });
self.addEventListener("activate", (event) => { event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("lehrerkompass-app-") && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (event) => {
  const request = event.request; const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  if (request.mode === "navigate") { event.respondWith(fetch(request).then((response) => { const copy=response.clone(); caches.open(CACHE).then((cache)=>cache.put(request,copy)); return response; }).catch(async()=> (await caches.match(request)) || (await caches.match("/")))); return; }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => { if (response.ok && ["script","style","image","font","manifest"].includes(request.destination)) { const copy=response.clone(); caches.open(CACHE).then((cache)=>cache.put(request,copy)); } return response; })));
});
self.addEventListener("message", (event) => { if (event.data?.type === "SKIP_WAITING") self.skipWaiting(); });
