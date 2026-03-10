export default defineNuxtPlugin((nuxtApp) => {
  const router = nuxtApp.$router;

  // Only run on client side
  if (!process.client) {
    return;
  }

  // Set up auth state listener - this runs on app initialization
  const { supabase } = useSupabase();
  const authStore = useAuthStore();

  // Initialize auth from session immediately
  supabase.auth.getSession().then(({ data: { session } }) => {
    const user = session?.user || null;
    authStore.setUser(user);
    authStore.setAuthCheckComplete(true);
  });

  // Also listen for future auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user || null;
    authStore.setUser(user);
    authStore.setAuthCheckComplete(true);
  });

  // Setup route guard - runs before navigation
  router.beforeEach(async (to, from, next) => {
    return nuxtApp.runWithContext(async () => {
      const authStore = useAuthStore();
      const publicRoutes = ["/login"];

      // Wait for auth check to complete before allowing navigation
      if (!authStore.authCheckComplete) {
        // Check every 10ms until authCheckComplete is true (max 5 seconds)
        let attempts = 0;
        while (!authStore.authCheckComplete && attempts < 500) {
          await new Promise((resolve) => setTimeout(resolve, 10));
          attempts++;
        }
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
