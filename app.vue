<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900"
  >
    <!-- Header -->
    <header
      class="sticky top-0 z-50 backdrop-blur-md border-b border-slate-200/30 dark:border-slate-800/30 bg-white/80 dark:bg-slate-900/80 shadow-lg"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="flex items-center gap-2 group">
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
        </div>
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
  </div>
</template>

<script setup lang="ts">
import "~/assets/css/main.css";
</script>
