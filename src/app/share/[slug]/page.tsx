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

export async function generateMetadata({ params }: { params: { slug: string } }) {
    // TODO: improve this, currently it just reuses the query logic from the page render:
    const { slug } = params
    const { data: share, error } = await supabase
        .from('shares')
        .select('*')
        .eq('share_slug', slug)
        .single()
    if (error) {
        console.error('share-page', error)
        return {}
    }

    const { data: event, error: eventError } = await supabase
        .from('events')
        .select<string, SupabaseItinerary>('*')
        .eq('id', share.event_id)
        .single()
    if (eventError) {
        console.error('share-page', eventError)
        return {}
    }

    return {
        title: `PlanTogether - ${event.name}`,
        description: event.description,
        openGraph: {
            title: `PlanTogether - ${event.name}`,
            description: event.description,
            // TODO: improve this image to be 1200x630px
            images: 'https://rdczidspmymfhkkzohvt.supabase.co/storage/v1/object/public/assets/logo.png',
            type: 'website',
            url: 'https://plan-together.fly.dev'
        }
    }
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
        <div>
            <EventCard
                event={event}
                shareSlug={slug}
                hideShowButton
            />
        </div>
    )
}
