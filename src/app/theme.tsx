'use client'

import React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

type ThemeClientProps = {
    children: React.ReactNode
}

export default function ThemeClient({ children }: ThemeClientProps) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="light">
            {children}
        </NextThemesProvider>
    )
}
