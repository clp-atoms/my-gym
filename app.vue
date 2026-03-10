<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900"
  >
    <!-- Auth Check Loading Overlay -->
    <div
      v-if="!authStore.authCheckComplete"
      class="fixed inset-0 z-[9999] bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="w-8 h-8 border-3 border-emerald-200 dark:border-emerald-900 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin"
        ></div>
        <p class="text-sm text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>

    <!-- Only render app layout if auth check is complete -->
    <template v-if="authStore.authCheckComplete">
      <!-- Header -->
      <header
        class="sticky top-0 z-50 backdrop-blur-md border-b border-slate-200/30 dark:border-slate-800/30 bg-white/80 dark:bg-slate-900/80 shadow-lg"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <NuxtLink
              to="/"
              class="flex items-center gap-2 group"
              @click="closeMenu"
            >
              <div
                class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300 transform group-hover:scale-110"
              >
                💪
              </div>
              <span
                class="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text"
                >MyGym</span
              >
            </NuxtLink>

            <nav class="hidden md:flex items-center gap-8">
              <NuxtLink
                to="/"
                class="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 hover:after:w-full after:transition-all after:duration-300"
              >
                Workout Plans
              </NuxtLink>
              <NuxtLink
                to="/statistics"
                class="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 hover:after:w-full after:transition-all after:duration-300"
              >
                Statistics
              </NuxtLink>
            </nav>

            <!-- User Menu & Mobile Toggle -->
            <div
              v-if="authStore.isAuthenticated"
              class="flex items-center gap-4"
            >
              <div class="hidden md:flex flex-col items-end">
                <p class="text-sm font-medium text-slate-900 dark:text-white">
                  {{ authStore.userEmail }}
                </p>
              </div>
              <!-- Mobile Menu Toggle -->
              <button
                @click="isMenuOpen = !isMenuOpen"
                class="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
              >
                <svg
                  v-if="!isMenuOpen"
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  v-else
                  class="w-6 h-6"
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
              <button
                @click="handleLogout"
                class="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          <!-- Mobile Menu -->
          <transition
            enter-active-class="transition duration-200"
            leave-active-class="transition duration-200"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <nav
              v-show="isMenuOpen"
              class="md:hidden border-t border-slate-200/30 dark:border-slate-800/30 py-4 space-y-2"
            >
              <NuxtLink
                to="/"
                class="block px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                @click="closeMenu"
              >
                💪 Workout Plans
              </NuxtLink>
              <NuxtLink
                to="/statistics"
                class="block px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                @click="closeMenu"
              >
                📊 Statistics
              </NuxtLink>
            </nav>
          </transition>
        </div>
      </header>

      <!-- Background Animated Elements -->
      <div
        class="fixed top-0 left-0 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl -z-10 animate-blob"
        style="animation: float 8s ease-in-out infinite"
      ></div>
      <div
        class="fixed bottom-0 right-0 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl -z-10 animate-blob animation-delay-2000"
        style="animation: float 8s ease-in-out infinite 2s"
      ></div>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="animate-fade-in">
          <UApp>
            <NuxtPage />
          </UApp>
        </div>
      </main>

      <!-- Footer -->
      <footer
        class="border-t border-slate-200/30 dark:border-slate-800/30 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-16"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p class="text-slate-600 dark:text-slate-400">
            &copy; 2026 MyGym - Gym Workout Tracker
          </p>
          <p class="text-sm text-slate-500 dark:text-slate-500 mt-2">
            Built with Nuxt 4 + Supabase
          </p>
        </div>
      </footer>

      <!-- PWA Update Notification -->
      <transition
        enter-active-class="transition ease-out duration-300"
        leave-active-class="transition ease-in duration-200"
        enter-from-class="opacity-0 translate-y-4"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div
          v-if="showPwaUpdate"
          class="fixed bottom-6 right-6 z-[2000] max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div
            class="bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-white font-medium text-sm flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
            App Update Available
          </div>
          <div class="px-5 py-4">
            <p class="text-slate-700 dark:text-slate-300 text-sm mb-4">
              A new version of MyGym is available. Reload to get the latest
              updates and features.
            </p>
            <div class="flex gap-3">
              <button
                @click="handleUpdateReload"
                class="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                Reload Now
              </button>
              <button
                @click="dismissPwaUpdate"
                class="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium text-sm transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import "~/assets/css/main.css";
import { ref, onMounted } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);
const showPwaUpdate = ref(false);

// Listen for PWA updates
onMounted(() => {
  window.addEventListener("pwa-update-available", () => {
    showPwaUpdate.value = true;
  });
});

const handleUpdateReload = () => {
  // Ask the service worker to skip waiting and take control immediately
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "SKIP_WAITING",
    });
  }
  // Reload the page after a short delay to ensure new SW is activated
  setTimeout(() => {
    window.location.reload();
  }, 500);
};

const dismissPwaUpdate = () => {
  showPwaUpdate.value = false;
};

// PWA Meta Tags
useHead({
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  meta: [
    { name: "theme-color", content: "#059669" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black-translucent",
    },
    { name: "apple-mobile-web-app-title", content: "MyGym" },
    {
      name: "description",
      content:
        "MyGym - Gym Workout Tracker. Plan your workouts and track your progress.",
    },
    { name: "mobile-web-app-capable", content: "yes" },
  ],
  link: [
    { rel: "manifest", href: "/manifest.json" },
    { rel: "apple-touch-icon", href: "/icons/icon-192x192.png" },
    { rel: "icon", type: "image/png", href: "/icons/icon-192x192.png" },
  ],
});

const handleLogout = async () => {
  await authStore.signOut();
  await router.push("/login");
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>
