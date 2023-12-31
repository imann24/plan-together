import OpenAI from 'openai'
import {
    Client as GoogleMapsClient,
    PlaceInputType,
} from '@googlemaps/google-maps-services-js'

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

const formatPrompt = (
    groupSize: number,
    location: string,
    interests: string,
    date: string,
    accessibility?: string,
    budget?: string,
    distance?: string,
    time?: string,
): string => {
    return `
    Please plan a day of activities for a group and respond in the form a JSON object.
    'place' should be the starting real life business/location.
    The JSON object should be single entry that summarizes the entire day with the following format:
    {
        eventName: a relevant title as a clever pun or play on words,
        place: a specific starting location/business,
        startTime: date as mm/dd/yy, 12-hour time start of the first activity,
        endTime: date as mm/dd/yy, 12-hour time end of last activity,
        details: description of activities, real life locations, and timing. Wrap each location name in parantheses
    }

    Use the following parameters to plan the day:
        Group size: ${groupSize} people
        Location: ${location}
        Interests: ${interests}
        Date: ${date}
        ${accessibility ? `Accessibility Needs: ${accessibility}` : ''}
        ${budget ? `Budget: ${budget}` : ''}
        ${distance ? `All locations should be within ${distance} miles of ${location}` : ''}
        ${time ? `The total length of plans should be equal to or less than ${time} hours` : ''}
    `
}

async function getLocationWebsiteFromGoogleMaps(
    locationName: string,
    locationArea: string,
): Promise<string | null> {
    if (process.env.GOOGLE_MAPS_API_KEY) {
        const googleMapsResponse = await googleMaps.findPlaceFromText({
            params: {
                key: process.env.GOOGLE_MAPS_API_KEY,
                input: `${locationName}, ${locationArea}`,
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
    const date = body.get('date')
    const accessibility = body.get('accessibility')
    const budget = body.get('budget')
    const distance = body.get('distance')
    const time = body.get('time')

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
                date as string,
                accessibility as string,
                budget as string,
                distance as string,
                time as string,
            )
        }],
    })

    const openAIResponse = JSON.parse(answer.choices[0].message.content as string)

    if (process.env.GOOGLE_MAPS_API_KEY) {
        const googleMapsResponse = await googleMaps.findPlaceFromText({
            params: {
                key: process.env.GOOGLE_MAPS_API_KEY,
                input: `${openAIResponse.place}, ${location}`,
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
        // give a regex that matchese any term wrapped in parantheses and is not a url
        const locationMatches = openAIResponse.details.match(/\((?!https?:\/\/)(?:[^'()\s]+\.(?!com|org|net|gov|edu|io)[^\s)]+|[^()\s]+(?:\s+[^()\s]+)*)\)/g)
        if (locationMatches) {
            for (const loc of locationMatches) {
                const locationRec = loc.replace('(', '').replace(')', '')
                const locationWebsite = await getLocationWebsiteFromGoogleMaps(locationRec, location as string)
                if (locationWebsite) {
                    openAIResponse.details = openAIResponse.details.replace(
                        loc,
                        `[${locationRec}](${locationWebsite})`,
                    )
                } else {
                    // even if we don't find a website match, remove the parantheses:
                    openAIResponse.details = openAIResponse.details.replace(
                        loc,
                        `${locationRec}`,
                    )
                }
            }
        }
    }
    
    return Response.json({ 
        itinerary: openAIResponse
    })
}
