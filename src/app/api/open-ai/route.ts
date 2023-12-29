import OpenAI from 'openai'
import {
    Client as GoogleMapsClient,
    PlaceInputType,
} from '@googlemaps/google-maps-services-js'
import { getSession } from '@auth0/nextjs-auth0'

export const dynamic = 'force-dynamic' // defaults to auto

let openai: OpenAI
if (process.env.OPENAI_API_KEY) {
    openai =new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
} else {
    console.warn('openai-api', 'OPENAI_API_KEY not set. skipping initialization.')
}
let googleMaps: GoogleMapsClient = new GoogleMapsClient({})

const formatPrompt = (groupSize: number, location: string, interests: string): string => {
    return `
    Please plan a day of activities for a group and respond in the form a JSON object.
    'place' should be the starting real life business/location.
    The JSON object should be single entry that summarizes the entire day with the following format:
    {
        eventName: a relevant title as a pun or play on words,
        place: a specific starting location/business,
        startTime: 12-hour time,
        endTime: 12-hour time,
        details: description of activities, real life locations, and timing. Wrap each location name in parantheses
    }

    Use the following parameters to plan the day:
        Group size: ${groupSize}
        Location: ${location}
        Interests: ${interests}
    `
}

async function getLocationWebsiteFromGoogleMaps(location: string): Promise<string | null> {
    if (process.env.GOOGLE_MAPS_API_KEY) {
        const googleMapsResponse = await googleMaps.findPlaceFromText({
            params: {
                key: process.env.GOOGLE_MAPS_API_KEY,
                input: location,
                inputtype: 'textquery' as PlaceInputType,
                fields: ['place_id'],
            },
        })

        if (googleMapsResponse?.data.candidates?.length && googleMapsResponse.data.candidates[0].place_id) {
            const result = googleMapsResponse.data.candidates[0].place_id
            const placeDetailsResponse = await googleMaps.placeDetails({
                params: {
                    key: process.env.GOOGLE_MAPS_API_KEY,
                    place_id: result,
                    fields: ['url'],
                },
            })
            return placeDetailsResponse?.data.result?.url || null
        }
        return null
    }
    return null
}

export async function POST(req: Request) {
    const auth0Session = await getSession()
    if (!auth0Session) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (!openai) {
        return Response.json({ error: 'OpenAI not initialized' }, { status: 500 })
    }

    const body = await req.formData()
    
    let groupSize = 1
    if (body.has('group-size')) {
        groupSize = parseInt(body.get('group-size') as string)
    }
    const location = body.get('location')
    const interests = body.get('interests')

    const answer = await openai.chat.completions.create({
        // use 3.5 because it supports json_object response format
        model: 'gpt-3.5-turbo-1106',
        response_format: { type: 'json_object' },
        messages: [{ 
            role: 'user', 
            content: formatPrompt(
                groupSize,
                location as string,
                interests as string,
            )
        }],
    })

    const openAIResponse = JSON.parse(answer.choices[0].message.content as string)

    if (process.env.GOOGLE_MAPS_API_KEY) {
        const googleMapsResponse = await googleMaps.findPlaceFromText({
            params: {
                key: process.env.GOOGLE_MAPS_API_KEY,
                input: openAIResponse.place,
                inputtype: 'textquery' as PlaceInputType,
                fields: ['formatted_address', 'name', 'place_id'],
            },
        })
        if (googleMapsResponse?.data.candidates?.length && googleMapsResponse.data.candidates[0].place_id) {
            const result = googleMapsResponse.data.candidates[0]
            openAIResponse.place = `${result.name}, ${result.formatted_address}`
            const placeDetailsResponse = await googleMaps.placeDetails({
                params: {
                    key: process.env.GOOGLE_MAPS_API_KEY,
                    place_id: googleMapsResponse.data.candidates[0].place_id,
                    fields: ['url'],
                },
            })
            if (placeDetailsResponse?.data.result?.url) {
                openAIResponse.details = openAIResponse.details.replace(
                    `(${result.name})`,
                    `[${result.name}](${placeDetailsResponse.data.result.url})`,
                )
            }
        }
        const locationMatches = openAIResponse.details.match(/\((.*?)\)/g)
        for (const loc of locationMatches) {
            const location = loc.replace('(', '').replace(')', '')
            const locationWebsite = await getLocationWebsiteFromGoogleMaps(location)
            if (locationWebsite) {
                openAIResponse.details = openAIResponse.details.replace(
                    loc,
                    `[${location}](${locationWebsite})`,
                )
            } else {
                // even if we don't find a website match, remove the parantheses:
                openAIResponse.details = openAIResponse.details.replace(
                    loc,
                    `${location}`,
                )
            }
        }
    }
    
    return Response.json({ 
        itinerary: openAIResponse
    })
}
