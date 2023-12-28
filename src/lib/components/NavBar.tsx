'use client'

import React from 'react'
import { Link } from '@nextui-org/react'
import { usePathname } from 'next/navigation'

export default function NavBar() {
    const path = usePathname()

    return (
        <nav>
            <Link size="lg" href="/" underline={path === '/' ? 'always' : 'hover'}>Create</Link>
            <Link size="lg" href="/saved" underline={path === '/saved' ? 'always' : 'hover'}>Saved</Link>
            <Link size="lg" href="/share" underline={path === '/share' ? 'always' : 'hover'}>Shared</Link>
        </nav>
    )
}
