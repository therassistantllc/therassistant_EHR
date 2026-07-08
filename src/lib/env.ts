interface AppEnvironment {
  supabaseUrl: string
  supabaseAnonKey: string
  appName: string
}

const environment: AppEnvironment = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  appName: import.meta.env.VITE_APP_NAME ?? 'THERASSISTANT',
}

export const env = environment

export const hasSupabaseCredentials =
  Boolean(environment.supabaseUrl) && Boolean(environment.supabaseAnonKey)
