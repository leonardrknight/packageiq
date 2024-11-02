export function checkRequiredEnvVars() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  // Validate URL format
  try {
    new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!)
  } catch {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
  }

  // Validate anon key format (basic JWT structure)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  if (anonKey.split('.').length !== 3) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY must be a valid JWT token')
  }
} 