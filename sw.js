// ドット漢方堂 オフライン用サービスワーカー
// ゲームを更新したら VERSION の数字を1つ上げてください
const VERSION = "v3";
const CACHE = "dot-kampo-" + VERSION;
const FILES = ["./","index.html","manifest.webmanifest","fonts.css","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons/apple-touch-icon.png","icons/favicon.png","fonts/dotgothic16-19-400-normal.woff2","fonts/dotgothic16-21-400-normal.woff2","fonts/dotgothic16-28-400-normal.woff2","fonts/dotgothic16-36-400-normal.woff2","fonts/dotgothic16-japanese-400-normal.woff2","fonts/dotgothic16-latin-400-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // ページ本体はネット優先（更新がすぐ届く）、ほかはキャッシュ優先
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(ca => ca.put("index.html", c)); return r; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
