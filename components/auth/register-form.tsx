'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import type { Organizations, Profiles } from '@/lib/types/database.types'
import { type ControllerRenderProps } from 'react-hook-form'

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Please enter your full name'),
  organizationName: z.string().min(2, 'Please enter your organization name'),
  organizationSlug: z.string().min(2, 'Please enter a valid slug')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

type FormFieldContextValue = {
  field: ControllerRenderProps<RegisterFormValues, keyof RegisterFormValues>
}

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      organizationName: '',
      organizationSlug: '',
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('User creation failed')

      // 2. Create organization
      const orgInsert: Organizations['Insert'] = {
        name: data.organizationName,
        slug: data.organizationSlug,
        status: 'active',
        settings: {},
      }

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert(orgInsert)
        .select()
        .single()

      if (orgError) throw orgError

      // 3. Create user profile
      const profileInsert: Profiles['Insert'] = {
        user_id: authData.user.id,
        full_name: data.fullName,
        email: data.email,
        organization_id: orgData.id,
        role: 'admin',
        settings: {},
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileInsert)

      if (profileError) throw profileError

      router.push('/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Create a password"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="John Doe"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Acme Inc"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organizationSlug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization URL</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="acme"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="text-xs">
                This will be used in your organization&apos;s URL: packageiq.com/{field.value}
              </FormMessage>
            </FormItem>
          )}
        />

        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create Account
        </Button>
      </form>
    </Form>
  )
} 