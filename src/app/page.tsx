'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { FormEvent, useState } from 'react'
import {
  Button,
  Input,
  Spacer,
  Progress,
  Card,
  CardBody,
  CardHeader,
  Textarea,
} from '@nextui-org/react'

export default withPageAuthRequired(function Home() {
  const [loadingAnswer, setLoadingAnswer] = useState(false)
  const [itinerary, setItinerary] = useState(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    setLoadingAnswer(true)
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/open-api', {
      method: 'POST',
      body: formData,
    })
 
    // Handle response if necessary
    const data = await response.json()
    setItinerary(data.itinerary)
    setLoadingAnswer(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full">
        <form onSubmit={onSubmit} className="max-w-4xl">
          <h1 className="text-lg">PlanTogether</h1>
          <Spacer y={2} />
          <Input type="number" placeholder="count" label="Group Size" name="group-size" />
          <Spacer />
          <Input type="text" placeholder="city" label="Location" name="location" />
          <Spacer />
          <Textarea placeholder="list" label="Interests" name="interests" />
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
            <p>
              {!!itinerary && (
                <>{itinerary}</>
              )}
              {!itinerary && !loadingAnswer && (
                <i>fill out form to get started</i>
              )}
            </p>
          </CardBody>
        </Card>
      </div>
    </main>
  )
})
