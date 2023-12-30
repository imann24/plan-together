'use client'

import React, { useEffect } from 'react'
import { trackPageView } from '../mixpanel'

export default function TrackPageLoad({ page }: { page: string}) {
    useEffect(() => {
        trackPageView(page)
    }, [])

    return <></>
}
