import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SupabaseItinerary } from '@/lib/types'
import { getSession } from '@auth0/nextjs-auth0'
import { v4 as uuidv4 } from 'uuid'

export const SHARE_SLUG_LENGTH = 6
export const dynamic = 'force-dynamic'

let supabase: SupabaseClient
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
} else {
    console.warn('supabase-api', 'SUPABASE_URL or SUPABASE_ANON_KEY not set. skipping initialization.')
}

export async function POST(req: Request) {
    if (!supabase) {
        return Response.json({ error: 'Supabase not initialized' }, { status: 500 })
    }
    const session = await getSession()
    if (!session) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body: SupabaseItinerary = await req.json()
    const shareSlug = uuidv4().substring(0, SHARE_SLUG_LENGTH)

    const { error } = await supabase
        .from('shares')
        .insert([{
            event_id: body.id.toString(),
            share_slug: shareSlug,
        }])
    if (error) {
        return Response.json({ error }, { status: 500 })
    }
    return Response.json({ saved: true, slug: shareSlug }, { status: 200 })
}
