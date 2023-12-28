'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Image from 'next/image'
import { FormEvent, useState } from 'react'
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
import { createEvent } from 'ics'
import { type Itinerary } from '@/app/types'
import { convertTimeToICSTimestamp } from '@/app/lib/time'

export default withPageAuthRequired(function Home() {
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
    const event = createEvent({
      title: itinerary.eventName,
      description: itinerary.details,
      location: itinerary.place,
      start: convertTimeToICSTimestamp(itinerary.startTime),
      end: convertTimeToICSTimestamp(itinerary.endTime),
    })
    if (event.value) {
      // create file for download
      const blob = new Blob([event.value], { type: 'text/calendar' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'event.ics')
      document.body.appendChild(link)

      // trigger download:
      link.click()

      // clean up:
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } else {
      alert('unable to download event')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full">
        <form onSubmit={onSubmit} className="max-w-4xl">
          <h1>
            <Image className="inline" src="/logo.png" width={35} height={35} alt="logo" />
            {' '}
            PlanTogether
          </h1>
          <Spacer y={2} />
          <Input type="number" placeholder="count" label="Group Size" name="group-size" />
          <Spacer />
          <Input type="text" placeholder="city" label="Location" name="location" />
          <Spacer />
          <Textarea placeholder="list" label="Interests" aria-label="Interests" name="interests" />
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
                      {itinerary.endTime}
                    </li>
                    <Spacer />
                    <li><b>Details:</b> {itinerary.details}</li>
                  </ul>
                  <Spacer y={4} />
                  <ButtonGroup>
                    <Button color="secondary" onClick={() => downloadEvent(itinerary)}>
                      Download Event
                    </Button>
                    <Button 
                      color="secondary" 
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
})
