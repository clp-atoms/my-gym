export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client side
  if (!process.client) {
    return;
  }

  const { supabase } = useSupabase();
  const authStore = useAuthStore();

  // Initialize auth from session immediately
  supabase.auth
    .getSession()
    .then(({ data: { session } }) => {
      const user = session?.user || null;
      authStore.setUser(user);
      authStore.setAuthCheckComplete(true);
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
  });
});
