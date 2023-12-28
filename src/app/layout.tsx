import { UserProvider } from '@auth0/nextjs-auth0/client'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import ThemeClient from './theme'
import './globals.css'
import ThemeSwitcher from '@/lib/components/ThemeSwitcher'
import NavBar from '@/lib/components/NavBar'

const inter = Inter({ subsets: ['latin'] })
const appName = 'PlanTogether'

export const metadata: Metadata = {
  title: appName,
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
            <NavBar />
            <ThemeSwitcher />
            <h1>
              <Image className="inline" src="/logo.png" width={35} height={35} alt="logo" />
              {' '}
              {appName}
            </h1>
            {children}
          </body>
        </ThemeClient>
      </UserProvider>
    </html>
  )
}
