export const useAuth = () => {
  const authStore = useAuthStore();

  const signUp = (email: string, password: string) => {
    return authStore.signUp(email, password);
  };

  const signIn = (email: string, password: string) => {
    return authStore.signIn(email, password);
  };

  const signOut = async () => {
    return authStore.signOut();
  };

  const initializeAuth = () => {
    return authStore.initializeAuth();
  };

  return {
    signUp,
    signIn,
    signOut,
    initializeAuth,
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    userId: authStore.userId,
    loading: authStore.loading,
    error: authStore.error,
  };
};
