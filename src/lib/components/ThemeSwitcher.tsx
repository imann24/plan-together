'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Switch } from '@nextui-org/react'
import MoonIcon from './MoonIcon'
import SunIcon from './SunIcon'

export default function ThemeSwitcher () {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <Switch
            isSelected={theme === 'dark'}
            className="fixed z-20"
            // hack to make the switch appear on top of the navbar, Tailwind styling wasn't working:
            style={{ top: '1rem', right: '1rem' }}
            onChange={evt => setTheme(evt.target.checked ? 'dark' : 'light')}
            size="md"
            color="secondary"
            thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                    <MoonIcon className={className} />
                ) : (
                    <SunIcon className={className} />
                )
            }
        />
    )
}
