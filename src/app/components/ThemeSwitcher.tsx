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
            className="fixed right-4 top-4"
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
        >
            Dark Mode
      </Switch>
    )
}
