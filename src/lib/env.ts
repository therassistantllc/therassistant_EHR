interface AppEnvironment {
  supabaseUrl: string
  supabasePublishableKey: string
  appName: string
}

// Supabase publishable keys are intentionally public browser credentials.
// RLS plus the authenticated user's JWT enforce access to application data.
const projectDefaults = {
  supabaseUrl: 'https://lpjwfdvaxobewxcklenl.supabase.co',
  supabasePublishableKey: 'sb_publishable_JaHqUqIU43A0EwuE5yPXEw_VZYIASqH',
} as const

const environment: AppEnvironment = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? projectDefaults.supabaseUrl,
  supabasePublishableKey:
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.VITE_SUPABASE_ANON_KEY ??
    projectDefaults.supabasePublishableKey,
  appName: import.meta.env.VITE_APP_NAME ?? 'THERASSISTANT',
}

export const env = environment

export const hasSupabaseCredentials =
  Boolean(environment.supabaseUrl) && Boolean(environment.supabasePublishableKey)
