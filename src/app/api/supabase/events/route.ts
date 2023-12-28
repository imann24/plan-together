import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getSession } from '@auth0/nextjs-auth0'
import { Itinerary } from '@/lib/types'
import { convertToDatabaseTimestamp } from '@/lib/time'

export const dynamic = 'force-dynamic'

let supabase: SupabaseClient
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
} else {
    console.warn('supabase-api', 'SUPABASE_URL or SUPABASE_ANON_KEY not set. skipping initialization.')
}

export async function GET(req: Request) {
    if (!supabase) {
        return Response.json({ error: 'Supabase not initialized' }, { status: 500 })
    }
    const session = await getSession()
    if (!session) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('owner', session.user.sub)

    if (error) {
        return Response.json({ error }, { status: 500 })
    }
    return Response.json({ events: data }, { status: 200 })
}

export async function POST(req: Request) {
    if (!supabase) {
        return Response.json({ error: 'Supabase not initialized' }, { status: 500 })
    }
    const session = await getSession()
    if (!session) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body: Itinerary = await req.json()

    const { error } = await supabase
        .from('events')
        .insert([{
            name: body.eventName,
            description: body.details,
            start: convertToDatabaseTimestamp(body.startTime),
            end: convertToDatabaseTimestamp(body.endTime),
            location: body.place,
            owner: session.user.sub
        }])
    if (error) {
        return Response.json({ error }, { status: 500 })
    }
    return Response.json({ saved: true }, { status: 200 })
}

