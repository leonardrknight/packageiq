import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { type Database } from '@/lib/types/database.types'

export type User = {
  id: string
  email: string
  name?: string
}

export async function getServerSession() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getUser(): Promise<User | null> {
  const session = await getServerSession()
  if (!session?.user) return null
  
  return {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.user_metadata?.name
  }
} 