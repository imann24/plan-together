'use client'

import React from 'react'
import {
    Button,
    ButtonGroup,
} from '@nextui-org/react'
import { SupabaseItinerary } from '@/lib/types'
import { initialializeSavedEventDownload } from '@/lib/calendar'

export default function SavedEventButtons({ event }: { event: SupabaseItinerary}) {
    return (
        <ButtonGroup>
            <Button 
                color="secondary" 
                onClick={() => initialializeSavedEventDownload(event)}
            >
                Download Event
            </Button>
        </ButtonGroup>
    )
}
