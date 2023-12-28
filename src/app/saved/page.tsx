import { 
    Card,
    CardBody,
    CardHeader,
    Spacer,
} from '@nextui-org/react'
import { SupabaseItinerary } from '@/app/types'
import { GET } from '@/app/api/supabase/events/route'
import { convertToDisplayTimeRange } from '@/app/lib/time'

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
                    <Card key={index} shadow="sm">
                        <CardHeader><h2>{evt.name}</h2></CardHeader>
                        <CardBody>
                            <p><b>Where:</b> {evt.location}</p>
                            <Spacer y={1} />
                            <p><b>When:</b> {convertToDisplayTimeRange(evt.start, evt.end)}</p>
                            <Spacer y={1} />
                            <p><b>Details:</b> {evt.description}</p>
                            <Spacer y={2} />
                        </CardBody>
                    </Card>
                    <Spacer y={5} />
                </>
            ))}
        </>
    )
}
