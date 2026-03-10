<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div v-if="showUpdatePrompt" class="fixed bottom-0 left-0 right-0 z-50">
        <!-- Dark overlay -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50 md:hidden"
          @click="dismissUpdate"
        ></div>

        <!-- Update card -->
        <div
          class="relative bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-lg md:max-w-md md:fixed md:bottom-4 md:right-4 md:rounded-lg md:border"
        >
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
              <svg
                class="w-5 h-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{
                  isUpdating
                    ? "Aggiornamento in corso..."
                    : "Nuovo aggiornamento disponibile"
                }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{
                  isUpdating
                    ? "Ricaricamento dell'app..."
                    : "Una nuova versione di MyGym è disponibile. Aggiorna per avere le ultime funzioni."
                }}
              </p>
            </div>

            <!-- Close button (only when not updating) -->
            <button
              v-if="!isUpdating"
              @click="dismissUpdate"
              class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Chiudi"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Actions -->
          <div v-if="!isUpdating" class="flex gap-2 mt-4">
            <button
              @click="dismissUpdate"
              class="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Dopo
            </button>
            <button
              @click="applyUpdate"
              class="flex-1 px-3 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Aggiorna ora
            </button>
          </div>

          <!-- Loading state -->
          <div v-if="isUpdating" class="flex justify-center mt-4">
            <div
              class="w-4 h-4 border-2 border-emerald-600 border-t-white dark:border-t-gray-900 rounded-full animate-spin"
            ></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Debug button (only in dev) -->
    <button
      v-if="isDevelopment && !showUpdatePrompt"
      @click="testUpdate"
      class="fixed bottom-4 left-4 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors z-40 font-medium"
      title="Debug: Forza test aggiornamento PWA"
    >
      🧪 Test PWA Update
    </button>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const showUpdatePrompt = ref(false);
const isUpdating = ref(false);
const isDevelopment = ref(false);
let registration: ServiceWorkerRegistration | null = null;

onMounted(() => {
  if (!process.client) return;

  // Check if in development mode
  isDevelopment.value = process.env.NODE_ENV === "development";
  console.log(
    "[PWA] Component: PWAUpdatePrompt mounted, isDevelopment:",
    isDevelopment.value,
  );

  // Listen for PWA update events
  window.addEventListener("pwa-update-available", (event: Event) => {
    const customEvent = event as CustomEvent<{
      registration?: ServiceWorkerRegistration;
    }>;
    console.log("[PWA] Component: pwa-update-available event received!");
    registration = customEvent.detail?.registration || null;
    showUpdatePrompt.value = true;
    console.log("[PWA] Component: Showing update prompt");
  });
});

const applyUpdate = async () => {
  isUpdating.value = true;
  console.log("[PWA] Component: applyUpdate() called");
  console.log("[PWA] Component: registration?.waiting:", registration?.waiting);

  if (registration?.waiting) {
    console.log("[PWA] Component: Telling waiting worker to skip waiting");
    // Tell the waiting service worker to skip waiting and take control
    registration.waiting.postMessage({ type: "SKIP_WAITING" });

    // Listen for the service worker to take control
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log(
        "[PWA] Component: New service worker is now controlling the page",
      );
      // Reload the page to get the new service worker
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  } else {
    // In development or when testing, just reload
    console.log(
      "[PWA] Component: No waiting worker (test mode), reloading directly",
    );
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
};

const testUpdate = async () => {
  console.log("[PWA] Component: testUpdate() called");

  // Get active registrations
  const registrations = await navigator.serviceWorker.getRegistrations();
  console.log(
    `[PWA] Component: Found ${registrations.length} registered service worker(s)`,
  );

  if (registrations.length === 0) {
    console.warn("[PWA] Component: No service worker registrations found");
    return;
  }

  // Try to send message through controller first
  if (navigator.serviceWorker.controller) {
    console.log(
      "[PWA] Component: Sending TEST_SKIP_WAITING to active controller",
    );
    navigator.serviceWorker.controller.postMessage({
      type: "TEST_SKIP_WAITING",
    });
  } else {
    // If no active controller, send to the active worker of the registration
    console.log(
      "[PWA] Component: No active controller, sending to registered workers",
    );
    for (const reg of registrations) {
      if (reg.active) {
        console.log(
          "[PWA] Component: Sending TEST_SKIP_WAITING to active worker in registration",
        );
        reg.active.postMessage({
          type: "TEST_SKIP_WAITING",
        });
      }
    }
  }

  // Also trigger update check on all registrations
  for (const reg of registrations) {
    console.log("[PWA] Component: Triggering update check on registration");
    await reg.update();
  }
};

const dismissUpdate = () => {
  showUpdatePrompt.value = false;
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
