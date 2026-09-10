import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from './env'

let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!env.supabaseUrl || !env.supabasePublishableKey) {
    throw new Error(
      'Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY before calling Supabase services.',
    )
  }

  if (!supabaseClient) {
    supabaseClient = createClient(env.supabaseUrl, env.supabasePublishableKey)
  }

  return supabaseClient
}
