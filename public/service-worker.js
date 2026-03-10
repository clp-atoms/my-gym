const CACHE_NAME = "mygym-v" + new Date().toISOString().split("T")[0];
const URLS_TO_CACHE = [
  "/",
  "/login",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install event - cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE).catch((err) => {
        console.warn("Cache addAll error:", err);
        // Don't fail installation if some files can't be cached
        return Promise.resolve();
      });
    }),
  );
  self.skipWaiting();
  // Notify all clients that a new version is available
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "SKIP_WAITING",
      });
    });
  });
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip API requests - always use network
  if (
    event.request.url.includes("/.netlify/") ||
    event.request.url.includes("supabase")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Offline fallback
          if (event.request.destination === "document") {
            // Return cached page or offline page
            return caches.match("/index.html");
          }
        });
    }),
  );
});
