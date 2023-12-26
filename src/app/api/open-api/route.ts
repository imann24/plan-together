import OpenAI from 'openai'

export const dynamic = 'force-dynamic' // defaults to auto

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const formatPrompt = (groupSize: number, location: string, interests: string): string => {
    return `
    Please plan an event given the following parameters:

        Group size: ${groupSize}
        Location: ${location}
        Interests: ${interests}
    `
}

export async function POST(req: Request) {
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
            content: formatPrompt(groupSize, location, interests)
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
