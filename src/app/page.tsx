'use client'

import { FormEvent, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Button,
  ButtonGroup,
  Input,
  Spacer,
  Progress,
  Card,
  CardBody,
  CardHeader,
  Textarea,
} from '@nextui-org/react'
import { DateTime } from 'luxon'
import { type Itinerary } from '@/lib/types'
import { initializeEventDownload } from '@/lib/calendar'

export default function Home() {
  const [loadingAnswer, setLoadingAnswer] = useState(false)
  const [eventSaved, setEventSaved] = useState(false)
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    setItinerary(null)
    setLoadingAnswer(true)
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/open-ai', {
      method: 'POST',
      body: formData,
    })
 
    // Handle response if necessary
    const data = await response.json()
    setItinerary(data.itinerary)
    setLoadingAnswer(false)
    setEventSaved(false)
  }

  async function onSave(itinerary: Itinerary): Promise<void> {
    const response = await fetch('/api/supabase/events', {
      method: 'POST',
      body: JSON.stringify(itinerary),
    })
    const data = await response.json()
    // disables the Save button
    setEventSaved(data.saved)
  }

  function downloadEvent(itinerary: Itinerary) {
    initializeEventDownload(itinerary)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 max-w-5xl w-full">
        <form onSubmit={onSubmit} className="max-w-4xl">
          <Input label="Date" type="date" name="date" defaultValue={DateTime.local().toFormat('yyyy-MM-dd')} />
          <Spacer y={2} />
          <Input type="number" placeholder="count" label="Group Size" name="group-size" />
          <Spacer />
          <Input type="text" placeholder="city" label="Location" name="location" />
          <Spacer />
          <Textarea placeholder="describe" label="Interests" aria-label="Interests" name="interests" />
          <Spacer />
          <Button color="primary" type="submit" size="lg">Submit</Button>
        </form>
        <Spacer y={5} />
        <Card className="itinerary" isBlurred>
          <CardHeader>
            <h2 className="font-bold text-large">Itinerary</h2>
          </CardHeader>
          <CardBody>
            {loadingAnswer && (
              <Progress color="primary" isIndeterminate />
            )}
            <div>
              {!!itinerary && (
                <>
                  <ul>
                    <li><b>What:</b> {itinerary.eventName}</li>
                    <li><b>Where:</b> {itinerary.place}</li>
                    <Spacer />
                    <li>
                      <b>When:</b>
                      {' '}
                      {itinerary.startTime}
                      {'-'}
                      {/* strip out the date from the event */}
                      {itinerary.endTime.includes(',') ? itinerary.endTime.split(', ')[1] : itinerary.endTime}
                    </li>
                    <Spacer />
                    <li>
                      <b>Details:</b>
                      <ReactMarkdown>{itinerary.details}</ReactMarkdown>
                    </li>
                  </ul>
                  <Spacer y={4} />
                  <ButtonGroup>
                    <Button
                      color="secondary"
                      variant="ghost"
                      onClick={() => downloadEvent(itinerary)}
                    >
                      Download Event
                    </Button>
                    <Button 
                      color="secondary"
                      variant="ghost"
                      onClick={() => onSave(itinerary)} 
                      isDisabled={eventSaved}
                    >
                      Save Event
                    </Button>
                  </ButtonGroup>
                </>
              )}
              {!itinerary && !loadingAnswer && (
                <i>fill out form to get started</i>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}
