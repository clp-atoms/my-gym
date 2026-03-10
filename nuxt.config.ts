import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxtjs/i18n"],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || "",
    },
  },
  ui: {
    icons: ["heroicons", "simple-icons"],
  },
  i18n: {
    defaultLocale: "it",
    locales: [
      {
        code: "en",
        name: "English",
        file: "en.json",
      },
      {
        code: "it",
        name: "Italiano",
        file: "it.json",
      },
    ],
    strategy: "prefix" as const,
    defaultLocale: "it",
    seo: false,
    lazy: true,
    langDir: "../locales/",
    globalInjection: true,
    detectBrowserLanguage: {
      useCookie: false,
    },
  },
  vite: {
    server: {
      hmr: {
        protocol: "ws",
        host: "localhost",
        port: 3000,
      },
    },
  },
});
