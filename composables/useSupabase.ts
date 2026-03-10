import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  const url = config.public.supabaseUrl
  const key = config.public.supabaseAnonKey
  
  const supabase = createClient(url, key)

  return {
    supabase
  }
}
