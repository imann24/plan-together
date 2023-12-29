import { Link } from '@nextui-org/react'

export default function AboutPage() {
    return (
        <div className="m-10">
            <p>
                <h3>Concept</h3>
                It&apos;s challenging to plan group events with friends. 
                It requires lots of coordination and communication. My friend <b>Kaysha </b>
                came up with this app to help groups have great outings.
            </p>
            <p>
                <h3>Author</h3>
                <Link href="https://isaiahmann.com"><b>Isaiah</b></Link> is a Software Engineer
                living in Seattle. He enjoys projects that help people connect in positive ways.
            </p>
            <p>
                <h3>Technology</h3>
                This app is powered by <Link href="https://nextjs.org">Next.js</Link> and uses{' '}
                <Link href="https://platform.openai.com/docs/models/gpt-3-5">OpenAI&apos;s GPT-3.5 model</Link>{' '}
                to generate its answers. The source code is available on <Link href="https://github.com/imann24/plan-together">GitHub</Link>.{' '}
                This project also uses:
                <ul className="list-disc pl-5">
                    <li><Link href="https://supabase.com">Supabase</Link></li>
                    <li><Link href="https://developers.google.com/maps">Google Maps API</Link></li>
                    <li><Link href="https://nextui.org/">NextUI</Link></li>
                    <li><Link href="https://auth0.com/">Auth0</Link></li>
                    <li><Link href="https://redis.io/">Redis</Link></li>
                </ul>
            </p>
        </div>
    )
}
