import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/lib/context/auth-context'
import { checkRequiredEnvVars } from '@/utils/env-check'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

if (process.env.NODE_ENV !== 'production') {
  checkRequiredEnvVars()
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 