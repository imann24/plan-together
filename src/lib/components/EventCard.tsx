'use client'

import React, { useEffect, useState } from 'react'
import {
    Card,
    CardBody,
    CardHeader,
    Spacer,
} from '@nextui-org/react'
import { usePathname } from 'next/navigation'
import { convertToDisplayTimeRange } from '@/lib/time'
import { SupabaseItinerary } from '@/lib/types'
import SavedEventButtons from '@/lib/components/SavedEventButtons'
import ShareEventButtons from './ShareEventButtons'

export default function EventCard({
    event,
    showShare=false,
    shareSlug=null,
    /*
        hack to pass the shareSlug through for social media buttons,
        but not display the Open Event Button
    */
    hideShowButton=false
} : {
    event: SupabaseItinerary,
    showShare?: boolean,
    shareSlug?: string | null,
    hideShowButton?: boolean,
}) {
    const pathname = usePathname()
    const [pageUrl, setPageUrl] = useState<string | null>(null)

    function onPublicSharePage(): boolean {
        // don't display on the `/share` page
        // only the subpages like `/share/abc123`
        const regex = /\/share\/[a-zA-Z0-9]{6}/
        return regex.test(pathname)
    }

    useEffect(() => {
        setPageUrl(window?.location?.href)
    }, [pathname])

    return (
        <Card shadow="sm">
            <CardHeader><h2>{event.name}</h2></CardHeader>
            <CardBody>
                <p><b>Where:</b> {event.location}</p>
                <Spacer y={1} />
                <p><b>When:</b> {convertToDisplayTimeRange(event.start, event.end)}</p>
                <Spacer y={1} />
                <p><b>Details:</b> {event.description}</p>
                <Spacer y={2} />
                <SavedEventButtons 
                    event={event}
                    showShare={showShare}
                    shareSlug={hideShowButton ? null : shareSlug}
                />
                {onPublicSharePage() && (
                    <ShareEventButtons
                        shareUrl={pageUrl || ''}
                    />
                )}
            </CardBody>
        </Card>
    )
}
