import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SupabaseItinerary } from '@/lib/types'
import EventCard from '@/lib/components/EventCard'

export const dynamic = 'force-dynamic'

let supabase: SupabaseClient
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
} else {
    console.warn('share-page', 'SUPABASE_URL or SUPABASE_ANON_KEY not set. skipping initialization.')
}

export default async function SharePage({ params }: { params: { slug: string } }) {
    const { slug } = params
    const { data: share, error } = await supabase
        .from('shares')
        .select('*')
        .eq('share_slug', slug)
        .single()
    if (error) {
        console.error('share-page', error)
        return <p><i>Share URL not valid</i></p>
    }

    const { data: event, error: eventError } = await supabase
        .from('events')
        .select<string, SupabaseItinerary>('*')
        .eq('id', share.event_id)
        .single()
    if (eventError) {
        console.error('share-page', eventError)
        return <p><i>Share URL not valid</i></p>
    }

    return (
        <EventCard
            event={event}
            shareSlug={slug}
            hideShowButton
        />
    )
}
