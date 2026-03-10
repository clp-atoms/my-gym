export default defineNuxtPlugin(() => {
  if (process.client && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);

          // Check for updates periodically
          const updateCheckInterval = setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;

            newWorker?.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New service worker is ready, dispatch custom event
                const updateEvent = new CustomEvent("pwa-update-available", {
                  detail: { registration },
                });
                window.dispatchEvent(updateEvent);
                console.log("PWA update available");
              }
            });
          });

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data?.type === "SKIP_WAITING") {
              // New service worker is waiting, notify user
              const event = new CustomEvent("pwa-update-available");
              window.dispatchEvent(event);
            }
          });

          // Cleanup interval on plugin destroy
          return () => clearInterval(updateCheckInterval);
        })
        .catch((error) => {
          console.warn("Service Worker registration failed:", error);
        });
    });
  }
});
