'use client'

import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'next-themes'

type ThemeClientProps = {
    children: React.ReactNode
}

export default function ThemeClient({ children }: ThemeClientProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <>{children}</>

    return (
        <ThemeProvider attribute="class" defaultTheme="light">
            {children}
        </ThemeProvider>
    )
}
