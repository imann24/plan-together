import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SupabaseItinerary } from '@/lib/types'
import EventCard from '@/lib/components/EventCard'
import TrackPageLoad from '@/lib/components/TrackPageLoad'
import { cacheGet, cacheSet } from '@/lib/cache'

export const dynamic = 'force-dynamic'

let supabase: SupabaseClient
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
} else {
    console.warn('share-page', 'SUPABASE_URL or SUPABASE_ANON_KEY not set. skipping initialization.')
}

function getShareKey(eventSlug: string): string {
    return `PlanTogether-share-${eventSlug}`
}

async function getSharedEvent(eventSlug: string): Promise<SupabaseItinerary | null> {
    const shareKey = getShareKey(eventSlug)
    const cachedShare = await cacheGet(shareKey)
    if (cachedShare) {
        return JSON.parse(cachedShare) as SupabaseItinerary
    }
    const { data: share, error } = await supabase
        .from('shares')
        .select('*')
        .eq('share_slug', eventSlug)
        .single()
    if (error) {
        console.error('share-page', error)
        return null
    }

    const { data: event, error: eventError } = await supabase
        .from('events')
        .select<string, SupabaseItinerary>('*')
        .eq('id', share.event_id)
        .single()
    if (eventError) {
        console.error('share-page', eventError)
        return null
    }

    await cacheSet(shareKey, JSON.stringify(event))
    return event
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    // TODO: improve this, currently it just reuses the query logic from the page render:
    const event = await getSharedEvent(params.slug)
    if (!event) {
        return {}
    }

    return {
        title: `PlanTogether - ${event.name}`,
        description: event.description,
        openGraph: {
            title: `PlanTogether - ${event.name}`,
            description: event.description,
            // TODO: improve this image to be 1200x630px
            images: 'https://plan-together.fly.dev/logo.png',
            type: 'website',
            url: 'https://plan-together.fly.dev'
        }
    }
}

export default async function SharePage({ params }: { params: { slug: string } }) {
    const { slug } = params
    const event = await getSharedEvent(slug)
    if (!event) {
        return <p><i>Share URL not valid</i></p>
    }

    return (
        <div>
            <TrackPageLoad page="Share" />
            <EventCard
                event={event}
                shareSlug={slug}
                hideShowButton
            />
        </div>
    )
}
