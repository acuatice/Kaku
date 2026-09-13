const CACHE_VERSION = "kana-shell-v3";
const SHELL_PAGES = [
  "/", "/learn", "/hiragana", "/hiragana/collection", "/practice",
  "/practice/write", "/progress",
];
const STATIC_FILES = [
  "/offline.html", "/icons/kana-192.png", "/icons/kana-512.png",
  "/icons/kana-maskable-512.png",
];

async function precacheShell() {
  const cache = await caches.open(CACHE_VERSION);
  await cache.addAll([...SHELL_PAGES, ...STATIC_FILES]);

  const nextAssets = new Set();
  for (const page of SHELL_PAGES) {
    const response = await cache.match(page);
    if (!response) continue;
    const html = await response.text();
    for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const asset = match[1];
      if (asset.startsWith("/_next/")) nextAssets.add(asset);
    }
  }

  await cache.addAll([...nextAssets]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheShell());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) caches.open(CACHE_VERSION).then((cache) => cache.put(request, response.clone()));
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match("/offline.html"))));
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || request.destination === "font") {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) caches.open(CACHE_VERSION).then((cache) => cache.put(request, response.clone()));
      return response;
    })));
  }
});
