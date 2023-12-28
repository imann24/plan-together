import OpenAI from 'openai'
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


const formatPrompt = (groupSize: number, location: string, interests: string): string => {
    return `
    Please plan a day of activities for a group and respond in the form a JSON object.
    'place' should be the starting real life business/location.
    The JSON object should be single entry that summarizes the entire day with the following format:
    {
        eventName,
        place: the starting location,
        startTime: 12-hour time,
        endTime: 12-hour time,
        details: description of activities, locations, and timing,
    }

    Use the following parameters:
        Group size: ${groupSize}
        Location: ${location}
        Interests: ${interests}
    `
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

    return Response.json({ 
        itinerary: JSON.parse(answer.choices[0].message.content as string) 
    })
}
