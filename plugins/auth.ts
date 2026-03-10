export default defineNuxtPlugin((nuxtApp) => {
  const router = nuxtApp.$router;

  // Setup route guard - runs before navigation
  router.beforeEach(async (to, from, next) => {
    return nuxtApp.runWithContext(async () => {
      const authStore = useAuthStore();
      const publicRoutes = ["/login"];

      // Initialize auth if not already done
      if (!authStore.user && !authStore.loading) {
        try {
          const { supabase } = useSupabase();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          authStore.setUser(user);
        } catch (error) {
          console.error("Error checking auth:", error);
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
