export type Itinerary = {
    eventName: string,
    place: string,
    startTime: string,
    endTime: string,
    details: string,
}

// fields on the database are different:
export type SupabaseItinerary = {
    id: string,
    name: string,
    description: string,
    start: string,
    end: string,
    location: string,
    owner: string,
}
