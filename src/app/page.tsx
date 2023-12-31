'use client'

import React, { FormEvent, useState, useEffect } from 'react'
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
  Snippet,
  Link,
} from '@nextui-org/react'
import { DateTime } from 'luxon'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useForm } from 'react-hook-form'
import { type Itinerary } from '@/lib/types'
import { initializeEventDownload } from '@/lib/calendar'
import { trackPageView, trackEvent } from '@/lib/mixpanel'

const LOCAL_STORAGE_PREFIX_FORM = 'plan-together-form-'
const LOCAL_STORAGE_PREFIX_ANSWER = 'plan-together-answer-'

export default function Home() {
  const { user } = useUser()
  const [loadingAnswer, setLoadingAnswer] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [eventSaved, setEventSaved] = useState(false)
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const { reset, register } = useForm()

  useEffect(() => {
    trackPageView('Create')
    const eventName = localStorage.getItem(`${LOCAL_STORAGE_PREFIX_ANSWER}eventName`)
    if (!eventName) {
      // If the first key is empty, assume that no itinerary has been saved to localStorage
      return
    }
    const savedItinerary: Itinerary = {
      eventName,
      place: localStorage.getItem(`${LOCAL_STORAGE_PREFIX_ANSWER}place`) || '',
      startTime: localStorage.getItem(`${LOCAL_STORAGE_PREFIX_ANSWER}startTime`) || '',
      endTime: localStorage.getItem(`${LOCAL_STORAGE_PREFIX_ANSWER}endTime`) || '',
      details: localStorage.getItem(`${LOCAL_STORAGE_PREFIX_ANSWER}details`) || '',
    }
    setItinerary(savedItinerary)
  }, [])

  function safeLocalStorageGet(key: string) {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key)
    }
  }

  function saveFormToLocalStorage(event: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    const answers = Object.fromEntries(formData.entries())
    for (const ans in answers) {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX_FORM}${ans}`, answers[ans] as string)
    }
  }
  
  function saveEventToLocalStorage(itinerary: Itinerary) {
    for (const key in itinerary) {
      // hack with 'as any' to allow us to index through the object
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX_ANSWER}${key}`, (itinerary as any)[key] as string)
    }
  }

  function resetForm() {
    localStorage.removeItem((`${LOCAL_STORAGE_PREFIX_FORM}date`))
    localStorage.removeItem((`${LOCAL_STORAGE_PREFIX_FORM}group-size`))
    localStorage.removeItem((`${LOCAL_STORAGE_PREFIX_FORM}location`))
    localStorage.removeItem((`${LOCAL_STORAGE_PREFIX_FORM}interests`))
    reset({
      date: DateTime.local().toFormat('yyyy-MM-dd'),
      'group-size': '',
      location: '',
      interests: '',
    }, {
      keepValues: false,
      keepDirty: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
      keepSubmitCount: false,
      keepErrors: false,
    })
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    setItinerary(null)
    setLoadingAnswer(true)
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    trackEvent('form_submit', { form: Object.fromEntries(formData.entries()) })
    const response = await fetch('/api/open-ai', {
      method: 'POST',
      body: formData,
    })
 
    // Handle response if necessary
    const data = await response.json()
    const itinerary: Itinerary = data.itinerary
    
    setLoadingAnswer(false)
    if (!itinerary) {
      setError(data.error)
      return
    }
    trackEvent('form_answer', { itinerary })
    setItinerary(itinerary)
    // ensure that this response is saved even if we reload the page:
    saveEventToLocalStorage(itinerary)
    setEventSaved(false)
  }

  async function onSave(itinerary: Itinerary): Promise<void> {
    trackEvent('save', { itinerary })
    const response = await fetch('/api/supabase/events', {
      method: 'POST',
      body: JSON.stringify(itinerary),
    })
    const data = await response.json()
    // disables the Save button
    setEventSaved(data.saved)
  }

  function downloadEvent(itinerary: Itinerary) {
    trackEvent('download', { itinerary })
    initializeEventDownload(itinerary)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 max-w-5xl w-full">
        <form onSubmit={onSubmit} onChange={saveFormToLocalStorage} className="max-w-4xl">
          <Input
            label="Date"
            type="date"
            {...register('date')}
            defaultValue={safeLocalStorageGet(`${LOCAL_STORAGE_PREFIX_FORM}date`) || DateTime.local().toFormat('yyyy-MM-dd')}
          />
          <Spacer y={2} />
          <Input
            type="number"
            placeholder="count"
            label="Group Size"
            {...register('group-size')}
            defaultValue={safeLocalStorageGet(`${LOCAL_STORAGE_PREFIX_FORM}group-size`) || undefined}
          />
          <Spacer />
          <Input
            type="text"
            placeholder="city"
            label="Location"
            {...register('location')}
            defaultValue={safeLocalStorageGet(`${LOCAL_STORAGE_PREFIX_FORM}location`) || undefined}
          />
          <Spacer />
          <Textarea 
            placeholder="describe"
            label="Interests"
            aria-label="Interests"
            {...register('interests')}
            defaultValue={safeLocalStorageGet(`${LOCAL_STORAGE_PREFIX_FORM}interests`) || undefined}
          />
          <Spacer />
          <Button color="primary" type="submit" size="lg">Submit</Button>
          <Button
              color="danger"
              type="reset"
              size="sm"
              className="float-right mb-2"
              onClick={resetForm}
            >
              Clear
          </Button>

        </form>
        <Spacer y={5} />
        <Card className="itinerary" isBlurred>
          <CardHeader className="pb-0">
            <h2 className="font-bold text-large pb-0 mb-0">Itinerary</h2>
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
                    <li>
                      <b>Where:</b>{' '}
                      <Snippet className="border-none p-0 location" variant="bordered" hideSymbol>{itinerary.place}</Snippet>
                    </li>
                    <Spacer />
                    <li>
                      <b>When:</b>
                      {' '}
                      {itinerary.startTime}
                      {'-'}
                      {/* strip out the date from the event */}
                      {itinerary.endTime?.includes(',') ? itinerary.endTime.split(', ')[1] : itinerary.endTime}
                    </li>
                    <Spacer />
                    <li>
                      <b>Details:</b>
                      <ReactMarkdown>{itinerary.details}</ReactMarkdown>
                    </li>
                  </ul>
                  <Spacer y={4} />
                  {!user && (
                    <p><i>
                      Please{' '}
                      <Link href="/api/auth/login">sign in</Link>{' '}
                      to <b>Save</b> events
                    </i></p>
                  )}
                  <ButtonGroup>
                    <Button
                      color="secondary"
                      variant="ghost"
                      onClick={() => downloadEvent(itinerary)}
                    >
                      Add to Calendar
                    </Button>
                    <Button 
                      color="secondary"
                      variant="ghost"
                      onClick={() => onSave(itinerary)} 
                      isDisabled={!user || eventSaved}
                    >
                      Save Event
                    </Button>
                  </ButtonGroup>
                </>
              )}
              {error && (
                <p className="text-red-500 italic">{error}</p>
              )}
              {!error && !itinerary && !loadingAnswer && (
                <i>fill out form to get started</i>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}
