import { createEvent } from 'ics'
import { convertTimeToICSTimestamp } from '@/lib/time'
import { 
    Itinerary,
    SupabaseItinerary,
    convertSavedToItinerary,
} from '@/lib/types'

export function initialializeSavedEventDownload(itinerary: SupabaseItinerary) {
    return initializeEventDownload(convertSavedToItinerary(itinerary))
}

export function initializeEventDownload(itinerary: Itinerary) {
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
