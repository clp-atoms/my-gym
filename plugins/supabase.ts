import { createClient } from "@supabase/supabase-js";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const supabaseClient = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey,
    {
      auth: {
        persistSession: true,
      },
    },
  );

  return {
    provide: {
      supabase: supabaseClient,
    },
  };
});
