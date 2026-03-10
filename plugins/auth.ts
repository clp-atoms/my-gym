export default defineNuxtPlugin((nuxtApp) => {
  const router = nuxtApp.$router;

  // Only run on client side
  if (!process.client) {
    return;
  }

  let authInitialized = false;

  // Set up auth state listener - this runs on app initialization
  const { supabase } = useSupabase();
  const authStore = useAuthStore();

  // Listen to auth state changes
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user || null;
    authStore.setUser(user);
    authStore.setAuthCheckComplete(true);
  });

  // Setup route guard - runs before navigation
  router.beforeEach(async (to, from, next) => {
    return nuxtApp.runWithContext(async () => {
      const authStore = useAuthStore();
      const publicRoutes = ["/login"];

      // Wait for auth to be initialized if not already done
      if (!authStore.authCheckComplete && !authInitialized) {
        authInitialized = true;
        // The listener above will set authCheckComplete
        // Wait a bit for the listener to fire
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Check if user is trying to access a protected route
      if (!authStore.isAuthenticated && !publicRoutes.includes(to.path)) {
        return next("/login");
      }

      // If authenticated and trying to access auth pages, redirect to home
      if (authStore.isAuthenticated && publicRoutes.includes(to.path)) {
        return next("/");
      }

      next();
    });
  });
});
