import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RegisterForm } from '@/components/auth/register-form'
import { Suspense } from 'react'

export default async function RegisterPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Check if user is already logged in
  const { data: { session } } = await supabase.auth.getSession()

  // Redirect to dashboard if already logged in
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Get started with PackageIQ
            </p>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Button variant="link" className="p-0" onClick={() => redirect('/')}>
                  Sign In
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
} 