'use client'

import { FormEvent, useState } from 'react'

export default function Home() {
  const [itinerary, setItinerary] = useState(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/open-api', {
      method: 'POST',
      body: formData,
    })
 
    // Handle response if necessary
    const data = await response.json()
    setItinerary(data.itinerary)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <form onSubmit={onSubmit}>
          <input type="number" placeholder="Group Size" name="group-size"/>
          <input type="text" placeholder="Location" name="location"/>
          <input type="textarea" placeholder="Interests" name="interests"/>
          <button type="submit">Submit</button>
        </form>

        <div className="itinerary">
          {itinerary && (
            <p>
              {itinerary}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
