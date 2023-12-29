'use client'

import React from 'react'
import { Link } from '@nextui-org/react'
import { usePathname } from 'next/navigation'

function getUnderlineBehavior(path: string, link: string) {
    if (path === link) {
        return 'always'
    }
    return 'hover'
}

export default function NavBar({ className='', loggedIn=false }) {
    const path = usePathname()

    return (
        <nav className={className}>
            <Link size="lg" href="/" underline={getUnderlineBehavior(path, '/')}>Create</Link>
            {loggedIn && (
                <>
                    <Link size="lg" href="/saved" underline={getUnderlineBehavior(path, '/saved')}>Saved</Link>
                    <Link size="lg" href="/share" underline={getUnderlineBehavior(path, '/share')}>Shared</Link>
                </>
            )}
            {!loggedIn && (
                <Link size="lg" href="/api/auth/login" underline="hover">Sign In</Link>
            )}
            <Link size="lg" href="/about" underline={getUnderlineBehavior(path, '/about')}>About</Link>
            {loggedIn && (
                <Link size="lg" href="/api/auth/logout" underline="hover">Logout</Link>
            )}
        </nav>
    )
}
