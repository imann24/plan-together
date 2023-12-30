import React from 'react'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getSession } from '@auth0/nextjs-auth0'
import { Spacer } from '@nextui-org/react'
import { SupabaseItinerary } from '@/lib/types'
import EventCard from '@/lib/components/EventCard'
import TrackPageLoad from '@/lib/components/TrackPageLoad'

export const dynamic = 'force-dynamic'

let supabase: SupabaseClient
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
} else {
    console.warn('share-list-page', 'SUPABASE_URL or SUPABASE_ANON_KEY not set. skipping initialization.')
}

export default async function ShareListPage() {
    const session = await getSession()
    if (!session) {
        // should be impossible to reach this because of Auth0 middleware
        return <p><i>Not logged in</i></p>
    }
    const unableToLoadMessage = <p><i>Failed to load data</i></p>
    const { user } = session
    // hacky approach because we don't have a real foreign key relationship:
    const { data: shares, error } = await supabase
        .from('shares')
        .select('*')

    if (error) {
        console.error('share-list-page', error)
        return unableToLoadMessage
    }

    const { data: events, error: eventError } = await supabase
        .from('events')
        .select<string, SupabaseItinerary>('*')
        .in('id', shares?.map(share => share.event_id) || [])
        .eq('owner', user.sub)
        .order('start', { ascending: false })

    if (eventError) {
        console.error('share-list-page', eventError)
        return unableToLoadMessage
    }

    return (
        <>
            <TrackPageLoad page="Share List" />
            {events?.map(event => 
                <>
                    <EventCard 
                        key={event.id}
                        event={event}
                        shareSlug={
                            shares?.find(share => 
                                share.event_id === event.id.toString()
                            ).share_slug
                        }
                    />
                    <Spacer y={5} />
                </>
            )}
        </>
    )
}
