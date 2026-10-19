// Sube la versión cada vez que cambies un archivo de la app para limpiar cachés viejas.
const C = "horas-v7";
const F = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(C)
      .then(c => c.addAll(F.map(u => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

// Red primero (siempre la versión más nueva); sin conexión, usa la caché.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(req, { cache: "no-cache" })
      .then(r => {
        if (r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(req, cp)); }
        return r;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: true }).then(r =>
          r || (req.mode === "navigate" ? caches.match("index.html") : Response.error())
        )
      )
  );
});
