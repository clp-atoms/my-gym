import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || "",
    },
  },
  ui: {
    icons: ["heroicons", "simple-icons"],
  },
  vite: {
    server: {
      hmr: {
        protocol: "ws",
        host: "localhost",
        port: 3000,
      },
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "_nuxt/[name].[hash].js",
          chunkFileNames: "_nuxt/[name].[hash].js",
          assetFileNames: "_nuxt/[name].[hash][extname]",
        },
      },
    },
  },
  // Nitro configuration for Netlify deployment
  nitro: {
    publicAssets: [
      {
        baseURL: "/",
        dir: "./public",
      },
    ],
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
    },
  },
  // SSR enabled for Netlify
  ssr: true,
});
