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
  console.log("Service Worker installing, cache:", CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE).catch((err) => {
        console.warn("Cache addAll error:", err);
        // Don't fail installation if some files can't be cached
        return Promise.resolve();
      });
    }),
  );
  // Don't skip waiting immediately - let it wait for client switch
  // This ensures smooth update transitions
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating, cleaning old caches");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Handle messages from clients
self.addEventListener("message", (event) => {
  console.log("[PWA] Service Worker received message:", event.data);

  if (event.data?.type === "SKIP_WAITING") {
    console.log("[PWA] Received SKIP_WAITING message, activating immediately");
    self.skipWaiting();
  }

  // For testing: simulate an update by notifying all clients
  if (event.data?.type === "TEST_SKIP_WAITING") {
    console.log("[PWA] TEST: Service Worker received TEST_SKIP_WAITING");
    // Claim all clients first to ensure we can communicate with them
    self.clients.claim().then(() => {
      console.log("[PWA] TEST: Claimed clients");
      self.clients.matchAll().then((clients) => {
        console.log(
          `[PWA] TEST: Found ${clients.length} client(s), sending TEST_AVAILABLE`,
        );
        if (clients.length === 0) {
          console.warn("[PWA] TEST: No clients found even after claim!");
        }
        clients.forEach((client) => {
          console.log("[PWA] TEST: Sending TEST_AVAILABLE to client");
          client.postMessage({
            type: "TEST_AVAILABLE",
          });
        });
      });
    });
  }
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip Vite HMR and dev server files
  if (
    event.request.url.includes("/_nuxt/") ||
    event.request.url.includes("/@vite") ||
    event.request.url.includes("@id/") ||
    event.request.url.includes(".hot-update")
  ) {
    return;
  }

  // Skip API requests - always use network
  if (
    event.request.url.includes("/.netlify/") ||
    event.request.url.includes("supabase")
  ) {
    return;
  }

  // Skip chrome-extension and other non-http schemes
  if (!event.request.url.startsWith("http")) {
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
            // Only cache http/https requests
            if (event.request.url.startsWith("http")) {
              cache.put(event.request, responseToCache).catch(() => {
                // Silently ignore caching errors
              });
            }
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
