import {
    Card,
    CardBody,
    CardHeader,
    Spacer,
} from '@nextui-org/react'
import { convertToDisplayTimeRange } from '@/lib/time'
import { SupabaseItinerary } from '@/lib/types'
import SavedEventButtons from '@/lib/components/SavedEventButtons'

export default function EventCard({ event, showShare=false } : { event: SupabaseItinerary, showShare: boolean }) {
    return (
        <Card shadow="sm">
            <CardHeader><h2>{event.name}</h2></CardHeader>
            <CardBody>
                <p><b>Where:</b> {event.location}</p>
                <Spacer y={1} />
                <p><b>When:</b> {convertToDisplayTimeRange(event.start, event.end)}</p>
                <Spacer y={1} />
                <p><b>Details:</b> {event.description}</p>
                <Spacer y={2} />
                <SavedEventButtons event={event} showShare={showShare} />
            </CardBody>
        </Card>
    )
}
