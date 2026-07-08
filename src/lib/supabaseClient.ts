import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from './env'
import type { Database } from '../types/database.types'

let supabaseClient: SupabaseClient<Database> | null = null

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      'Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before calling Supabase services.',
    )
  }

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey)
  }

  return supabaseClient
}
