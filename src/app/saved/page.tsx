import React from 'react'
import { Spacer } from '@nextui-org/react'
import { SupabaseItinerary } from '@/lib/types'
import { GET } from '@/app/api/supabase/events/route'
import EventCard from '@/lib/components/EventCard'

// page must always be dynamically rendered because it fetches user-specific data
export const dynamic = 'force-dynamic'

async function fetchEvents(): Promise<SupabaseItinerary[]> {
    // fake an HTTP request because we're already on the server
    const response = await GET(new Request('http://0.0.0.0/api/supabase/events'))
    const data = await response.json()
    return data.events
}

export default async function SavedEvents() {
    const events = await fetchEvents()
    return (
        <>
            {events.map((evt: SupabaseItinerary, index: number) => (
                <>
                    <EventCard key={index} event={evt} showShare />
                    <Spacer y={5} />
                </>
            ))}
        </>
    )
}
