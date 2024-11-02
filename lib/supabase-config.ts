export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  
  // Add additional configuration options
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  
  // Add global error handler
  global: {
    headers: {
      'x-application-name': 'PackageIQ'
    }
  }
}

// Validate config at runtime
if (!supabaseConfig.url || !supabaseConfig.anonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.')
} 