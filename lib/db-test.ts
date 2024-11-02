import { createClient } from '@/utils/supabase/server'
import { cookies } from "next/dist/client/components/headers"
import { Database } from '@/lib/types/database.types'

// Add error types for better error handling
type ConnectionTestResult = {
  success: boolean;
  error?: string;
  step?: 'connection' | 'insert' | 'unexpected';
  data?: any;
  timestamp?: string;
}

export async function testConnection(): Promise<ConnectionTestResult> {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Simple connection test that doesn't create test data
    const { data, error: connectionError } = await supabase
      .from('projects')
      .select('count')
      .limit(1)
      .single()
    
    if (connectionError) {
      console.error('Database connection error:', connectionError)
      return { 
        success: false, 
        error: connectionError.message,
        step: 'connection'
      }
    }
    
    return { 
      success: true, 
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Connection test failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      step: 'unexpected'
    }
  }
} 