export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client side
  if (!process.client) {
    return;
  }

  const router = nuxtApp.$router;
  const route = useRoute();
  const { supabase } = useSupabase();
  const authStore = useAuthStore();

  // Initialize auth from session immediately
  supabase.auth
    .getSession()
    .then(({ data: { session } }) => {
      const user = session?.user || null;
      authStore.setUser(user);
      authStore.setAuthCheckComplete(true);

      // Se c'è una sessione e siamo in recovery mode (da email di reset)
      if (session && (route.query.type === "recovery" || route.query.code)) {
        router.push("/reset-password");
      }
    })
    .catch((error) => {
      console.error("Error getting session:", error);
      authStore.setAuthCheckComplete(true);
    });

  // Listen for future auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user || null;
    authStore.setUser(user);
    if (!authStore.authCheckComplete) {
      authStore.setAuthCheckComplete(true);
    }

    // Se riceiviamo un evento RECOVERY, reindirizza a reset-password
    if (event === "RECOVERY" || event === "PASSWORD_RECOVERY") {
      router.push("/reset-password");
    }
  });
});
