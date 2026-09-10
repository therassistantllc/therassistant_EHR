interface AppEnvironment {
  supabaseUrl: string
  supabasePublishableKey: string
  appName: string
}

const environment: AppEnvironment = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabasePublishableKey:
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  appName: import.meta.env.VITE_APP_NAME ?? 'THERASSISTANT',
}

export const env = environment

export const hasSupabaseCredentials =
  Boolean(environment.supabaseUrl) && Boolean(environment.supabasePublishableKey)
