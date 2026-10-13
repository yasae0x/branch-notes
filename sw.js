// Branch Notes service worker: keeps the app working offline.
// Bump CACHE when you change index.html so installed copies pick up the new version.
const CACHE = "branch-notes-v2";
const SHELL = [
  "./",
  "./index.html",
  "./firebase-config.js",
  "./vendor/firebase.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];
// Always try the network first for these, so edits on GitHub show up right away.
const NETWORK_FIRST = ["/index.html", "/firebase-config.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function networkFirst(req, cacheKey) {
  return fetch(req)
    .then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(cacheKey || req, copy));
      }
      return res;
    })
    .catch(() => caches.match(cacheKey || req));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req, "./index.html"));
    return;
  }
  if (url.origin === self.location.origin && NETWORK_FIRST.some((p) => url.pathname.endsWith(p))) {
    event.respondWith(networkFirst(req));
    return;
  }

  // App files and Google Fonts: serve from cache, refresh in the background.
  // Firebase's own traffic (sign-in, database) is never touched here.
  const cacheable =
    url.origin === self.location.origin ||
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com";
  if (!cacheable) return;

  event.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res.ok || res.type === "opaque") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
