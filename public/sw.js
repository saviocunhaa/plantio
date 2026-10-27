const CACHE_NAME = "plantio-facil-v4";
const STATIC_URLS = ["/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const oldKeys = keys.filter((key) => key !== CACHE_NAME);
      await Promise.all(oldKeys.map((key) => caches.delete(key)));
      await self.clients.claim();
      if (oldKeys.length > 0) {
        const clients = await self.clients.matchAll({ type: "window" });
        for (const client of clients) {
          await client.navigate(client.url);
        }
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.searchParams.has("_rsc")
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(request);
        return cached || Response.error();
      })
    );
  }
});
