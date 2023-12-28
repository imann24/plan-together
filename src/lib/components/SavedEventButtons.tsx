'use client'

import React from 'react'
import {
    Button,
    ButtonGroup,
} from '@nextui-org/react'
import { SupabaseItinerary } from '@/lib/types'
import { initialializeSavedEventDownload } from '@/lib/calendar'

export default function SavedEventButtons({ event, showShare }: { event: SupabaseItinerary, showShare: boolean }) {
    async function shareEvent(event: SupabaseItinerary) {
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
                onClick={() => initialializeSavedEventDownload(event)}
            >
                Download Event
            </Button>
            {showShare && <Button
                color="secondary"
                onClick={() => shareEvent(event)}
            >
                Share Event
            </Button>}
        </ButtonGroup>
    )
}
