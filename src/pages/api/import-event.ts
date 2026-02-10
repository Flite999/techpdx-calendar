import type { APIRoute } from 'astro'
import { convertIcsCalendar } from 'ts-ics'
import type { IcsEvent, IcsDateObject } from 'ts-ics'
import { importSchema } from '../../lib/zod'
import { addEventToDB } from '../../lib/db'
import { sanitizeText, sanitizeUrl, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_LOCATION_LENGTH, MAX_ICS_RESPONSE_BYTES } from '../../lib/sanitize'

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData()

  const validatedFields = importSchema.safeParse({
    ics_url: formData.get('ics_url'),
  })

  if (!validatedFields.success) {
    return redirect(`/add-event?form=import&error=${encodeURIComponent('Failed to import event. Please check the ICS URL.')}`)
  }

  try {
    const res = await fetch(validatedFields.data.ics_url)
    if (!res.ok) {
      return redirect(`/add-event?form=import&error=${encodeURIComponent('Could not fetch ICS file.')}`)
    }

    const contentLength = res.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > MAX_ICS_RESPONSE_BYTES) {
      return redirect(`/add-event?form=import&error=${encodeURIComponent('ICS file is too large.')}`)
    }

    const icsText = await res.text()
    if (icsText.length > MAX_ICS_RESPONSE_BYTES) {
      return redirect(`/add-event?form=import&error=${encodeURIComponent('ICS file is too large.')}`)
    }

    const calendar = convertIcsCalendar(undefined, icsText)

    if (!calendar || !calendar.events || calendar.events.length === 0) {
      return redirect(`/add-event?form=import&error=${encodeURIComponent('No events found in ICS file.')}`)
    }

    const event: IcsEvent = calendar.events[0]

    function icsDateToDate(icsDate: IcsDateObject | undefined): Date | null {
      if (!icsDate) return null
      if (icsDate.date) {
        const d = new Date(icsDate.date)
        if (isNaN(d.getTime())) return null
        return d
      }
      return null
    }

    const startDate = icsDateToDate(event.start)
    if (!startDate) {
      return redirect(`/add-event?form=import&error=${encodeURIComponent('Event has no valid start date.')}`)
    }

    const endDate = icsDateToDate(event.end) || new Date(startDate.getTime() + 60 * 60 * 1000)

    if (endDate < startDate) {
      return redirect(`/add-event?form=import&error=${encodeURIComponent('Event end time is before start time.')}`)
    }

    const title = sanitizeText(event.summary || '', MAX_TITLE_LENGTH)
    if (!title) {
      return redirect(`/add-event?form=import&error=${encodeURIComponent('Event has no valid title.')}`)
    }

    await addEventToDB({
      title,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      website: sanitizeUrl(event.url || ''),
      description: sanitizeText(event.description || '', MAX_DESCRIPTION_LENGTH),
      location: sanitizeText(event.location || '', MAX_LOCATION_LENGTH),
    })

    return redirect('/add-event?form=import&success=Event+imported+successfully!')
  } catch (error) {
    console.error('ICS import error:', error)
    return redirect(`/add-event?form=import&error=${encodeURIComponent('Error: Failed to import event.')}`)
  }
}
