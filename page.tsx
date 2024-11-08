import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { Suspense } from 'react'

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Check if user is already logged in
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.error('Session error:', sessionError)
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

  // Redirect to dashboard if already logged in
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Welcome to PackageIQ</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Button variant="link" className="p-0" onClick={() => redirect('/register')}>
                  Register
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
} 