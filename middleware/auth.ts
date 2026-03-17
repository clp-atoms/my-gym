export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const publicRoutes = ["/login", "/reset-password"];

  // Se l'utente sta cercando di accedere a una rotta pubblica, lascialo andare
  // (il check dell'autenticazione non è urgente)
  if (publicRoutes.includes(to.path)) {
    return;
  }

  // Per le rotte protette, aspetta che il check dell'autenticazione sia completo
  if (!authStore.authCheckComplete) {
    let attempts = 0;
    // Aspetta max 3 secondi (300 tentativi * 10ms = 3000ms)
    while (!authStore.authCheckComplete && attempts < 300) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      attempts++;
    }
  }

  // Se l'utente non è autenticato, reindirizza a login
  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }
});
