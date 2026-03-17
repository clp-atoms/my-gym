export default defineNuxtPlugin((nuxtApp) => {
  console.log("[PWA] Plugin: Starting initialization");

  if (!process.client) {
    console.log("[PWA] Plugin: Not client-side, returning");
    return;
  }
  console.log("[PWA] Plugin: Client-side detected");

  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    console.log("[PWA] Plugin: ServiceWorker not available");
    return;
  }
  console.log("[PWA] Plugin: ServiceWorker API available");

  // Use app:mounted hook to ensure DOM is ready
  nuxtApp.hook("app:mounted", () => {
    console.log("[PWA] Plugin: App mounted, registering SW");
    registerServiceWorker();
  });
});

function registerServiceWorker() {
  navigator.serviceWorker
    .register("/service-worker.js", { scope: "/" })
    .then((registration) => {
      console.log("[PWA] Plugin: Service Worker registered successfully");

      const isDev = process.env.NODE_ENV === "development";
      const updateCheckInterval = isDev ? 5000 : 10 * 60 * 1000;

      // Store manifest version locally for comparison
      let cachedManifestVersion: string | null = null;

      // Aggressive update check: fetch manifest to detect version changes
      const manifestCheckInterval = setInterval(async () => {
        try {
          const response = await fetch("/manifest.json?v=" + Date.now());
          const manifest = await response.json();

          if (
            cachedManifestVersion &&
            cachedManifestVersion !== manifest.version
          ) {
            console.log(
              "[PWA] Plugin: Manifest version changed! Old:",
              cachedManifestVersion,
              "New:",
              manifest.version,
            );
            // Notify service worker about version change
            const controller = navigator.serviceWorker.controller;
            if (controller) {
              const channel = new MessageChannel();
              controller.controller?.postMessage(
                { type: "CHECK_MANIFEST_VERSION" },
                [channel.port2],
              );
              channel.port1.onmessage = (msg) => {
                if (msg.data.type === "MANIFEST_VERSION_CHANGED") {
                  console.log("[PWA] Plugin: Update detected, clearing cache");
                  caches
                    .keys()
                    .then((names) =>
                      Promise.all(names.map((n) => caches.delete(n))),
                    )
                    .then(() => {
                      console.log("[PWA] Cache cleared, reloading page");
                      window.location.reload();
                    });
                }
              };
            }
          }

          cachedManifestVersion = manifest.version;
        } catch (err) {
          console.debug("[PWA] Manifest check failed:", err);
        }
      }, updateCheckInterval);

      // Standard update check
      const intervalId = setInterval(() => {
        registration.update().catch(() => {});
      }, updateCheckInterval);

      window.addEventListener("focus", () => {
        registration.update();
        // Also check manifest version on focus
        fetch("/manifest.json?v=" + Date.now())
          .then((r) => r.json())
          .then((m) => {
            if (cachedManifestVersion && cachedManifestVersion !== m.version) {
              console.log("[PWA] Manifest changed on focus, reloading");
              window.location.reload();
            }
            cachedManifestVersion = m.version;
          })
          .catch(() => {});
      });

      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("[PWA] Plugin: Message from SW:", event.data);
        if (event.data?.type === "TEST_AVAILABLE") {
          console.log("[PWA] Plugin: Dispatching pwa-update-available event");
          const updateEvent = new CustomEvent("pwa-update-available", {
            detail: { registration },
          });
          window.dispatchEvent(updateEvent);
        }
      });

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            console.log("[PWA] Plugin: New SW ready, dispatching event");
            const updateEvent = new CustomEvent("pwa-update-available", {
              detail: { registration },
            });
            window.dispatchEvent(updateEvent);
          }
        });
      });

      window.addEventListener("beforeunload", () => {
        clearInterval(intervalId);
        clearInterval(manifestCheckInterval);
      });
    })
    .catch((error) => {
      console.warn("[PWA] Plugin: Registration failed:", error);
    });
}
