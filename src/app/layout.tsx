import { UserProvider } from '@auth0/nextjs-auth0/client'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeClient from './theme'
import './globals.css'
import ThemeSwitcher from './components/ThemeSwitcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PlanTogether',
  description: 'An app for making group plans',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>
        <ThemeClient>
          <body className={inter.className}>
            <ThemeSwitcher />
            {children}
          </body>
        </ThemeClient>
      </UserProvider>
    </html>
  )
}
