'use client'

import React from 'react'
import {
    Button,
    ButtonGroup,
    Link,
} from '@nextui-org/react'
import { SupabaseItinerary } from '@/lib/types'
import { initialializeSavedEventDownload } from '@/lib/calendar'
import { trackEvent } from '@/lib/mixpanel'

export default function SavedEventButtons({ event, showShare, shareSlug }: {
    event: SupabaseItinerary,
    showShare: boolean,
    shareSlug: string | null,
}) {
    async function shareEvent(event: SupabaseItinerary) {
        trackEvent('share', { event })
        const response = await fetch('/api/supabase/events/share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        })
        const { saved, slug } = await response.json()
        if (saved) {
            window.open(`/share/${slug}`, '_blank')
        }
    }

    return (
        <ButtonGroup>
            <Button
                color="secondary" 
                variant="ghost"
                onClick={() => {
                    trackEvent('download', { event })
                    initialializeSavedEventDownload(event)
                }}
            >
                Add to Calendar
            </Button>
            {showShare && <Button
                color="secondary"
                variant="ghost"
                onClick={() => shareEvent(event)}
            >
                Share Event
            </Button>}
            {shareSlug && <Button
                color="secondary"
                variant="ghost"
                as={Link}
                href={`/share/${shareSlug}`}
            >
                View Shared Event
            </Button>
            }
        </ButtonGroup>
    )
}
