import OpenAI from 'openai'
import { getSession } from '@auth0/nextjs-auth0';

export const dynamic = 'force-dynamic' // defaults to auto

let openai: OpenAI
if (process.env.OPENAI_API_KEY) {
    openai =new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
} else {
    console.warn('OPENAI_API_KEY not set. skipping initialization.')
}


const formatPrompt = (groupSize: number, location: string, interests: string): string => {
    return `
    Please plan an event given the following parameters:

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

    const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ 
            role: 'user', 
            content: formatPrompt(
                groupSize,
                location as string,
                interests as string,
            )
        }],
        stream: true,
    })

    const message = []
    for await (const chunk of stream) {
        const content = chunk.choices[0].delta.content
        // skip quote marks:
        if (content !== '"') {
            message.push(content)
        }
    }

    return Response.json({ itinerary: message.join('') })
}
