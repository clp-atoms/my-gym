import { defineStore } from "pinia";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  authCheckComplete: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
    authCheckComplete: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userId: (state) => state.user?.id || null,
    userEmail: (state) => state.user?.email || null,
  },

  actions: {
    setUser(user: User | null) {
      this.user = user;
    },

    setLoading(value: boolean) {
      this.loading = value;
    },

    setError(error: string | null) {
      this.error = error;
    },

    setAuthCheckComplete(value: boolean) {
      this.authCheckComplete = value;
    },

    async signUp(email: string, password: string) {
      this.setLoading(true);
      this.setError(null);

      try {
        const { supabase } = useSupabase();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        if (data.user) {
          this.setUser(data.user);
        }

        return { data, error: null };
      } catch (error: any) {
        this.setError(error.message);
        return { data: null, error };
      } finally {
        this.setLoading(false);
      }
    },

    async signIn(email: string, password: string) {
      this.setLoading(true);
      this.setError(null);

      try {
        const { supabase } = useSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (data.user) {
          this.setUser(data.user);
        }

        return { data, error: null };
      } catch (error: any) {
        this.setError(error.message);
        return { data: null, error };
      } finally {
        this.setLoading(false);
      }
    },

    async signOut() {
      this.setLoading(true);
      this.setError(null);

      try {
        const { supabase } = useSupabase();
        const { error } = await supabase.auth.signOut();

        if (error) throw error;
        this.setUser(null);

        return { error: null };
      } catch (error: any) {
        this.setError(error.message);
        return { error };
      } finally {
        this.setLoading(false);
      }
    },

    async initializeAuth() {
      try {
        const { supabase } = useSupabase();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          this.setUser(user);
        }
      } catch (error: any) {
        console.error("Error initializing auth:", error);
      }
    },
  },
});
