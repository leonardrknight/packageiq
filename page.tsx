import { createClient } from '@/utils/supabase/server'
import { cookies } from "next/dist/client/components/headers"
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { testConnection } from '@/lib/db-test'
import { Suspense } from 'react'

export default async function LoginPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Move connection test to development only
  const connectionTest = process.env.NODE_ENV === 'development' 
    ? await testConnection() 
    : { success: true }

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.error('Session error:', sessionError)
    // Handle session error gracefully
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">
              Unable to verify session. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (session) {
    redirect('/dashboard')
  }

  async function signIn(formData: FormData): Promise<void> {
    'use server'
    
    const email = formData.get('email')?.toString().trim()
    const password = formData.get('password')?.toString()
    
    if (!email || !password) {
      throw new Error('Please provide both email and password')
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Please provide a valid email address')
    }
    
    const supabase = createClient(cookies())
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login')) {
          throw new Error('Invalid email or password')
        }
        throw new Error(error.message)
      }

      redirect('/dashboard')
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        {/* Display connection status */}
        {!connectionTest.success && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            Database connection error: {connectionTest.error}
            {connectionTest.step && ` (Failed at: ${connectionTest.step})`}
          </div>
        )}
        
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login to PackageIQ</CardTitle>
            {connectionTest.success && (
              <p className="text-sm text-green-600">Database connected successfully</p>
            )}
          </CardHeader>
          <CardContent>
            <form action={signIn} className="space-y-4">
              <div className="space-y-2">
                <Input name="email" type="email" placeholder="Email" required />
                <Input name="password" type="password" placeholder="Password" required />
              </div>
              <Button className="w-full" type="submit">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
} 