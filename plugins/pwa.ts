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

      const intervalId = setInterval(() => {
        registration.update().catch(() => {});
      }, updateCheckInterval);

      window.addEventListener("focus", () => {
        registration.update();
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
      });
    })
    .catch((error) => {
      console.warn("[PWA] Plugin: Registration failed:", error);
    });
}
