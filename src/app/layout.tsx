import { UserProvider } from '@auth0/nextjs-auth0/client'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { getSession } from '@auth0/nextjs-auth0'
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <html lang="en">
      <UserProvider>
        <ThemeClient>
          <body className={inter.className}>
            <h1 className="mt-7 md:mt-0">
              <Image className="inline" src="/logo.png" width={35} height={35} alt="logo" />
              {' '}
              {appName}
            </h1>
            <NavBar loggedIn={!!session}/>
            <ThemeSwitcher />
            {children}
          </body>
        </ThemeClient>
      </UserProvider>
    </html>
  )
}
