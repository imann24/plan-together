'use client'

import React from 'react'
import { Link } from '@nextui-org/react'
import { usePathname } from 'next/navigation'

export default function NavBar() {
    const path = usePathname()

    return (
        <nav>
            <Link key="home" size="lg" href="/" underline={path === '/' ? 'always' : 'hover'}>Create</Link>
            <Link key="saved" size="lg" href="/saved" underline={path === '/saved' ? 'always' : 'hover'}>Saved</Link>
        </nav>
    )
}
