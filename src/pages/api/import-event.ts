import type { APIRoute } from 'astro'
import prisma from '../../lib/prisma'
import { convertIcsCalendar } from 'ts-ics'
import type { IcsEvent, IcsDateObject } from 'ts-ics'
import { importSchema } from '../../lib/zod'
import { generateUniqueSlug } from '../../lib/hash'

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

    const icsText = await res.text()
    const calendar = convertIcsCalendar(undefined, icsText)

    if (!calendar || !calendar.events || calendar.events.length === 0) {
      return redirect(`/add-event?form=import&error=${encodeURIComponent('No events found in ICS file.')}`)
    }

    const event: IcsEvent = calendar.events[0]

    function icsDateToDate(icsDate: IcsDateObject | undefined): Date | null {
      if (!icsDate) return null
      if (icsDate.date) return new Date(icsDate.date)
      return null
    }

    await prisma.event.create({
      data: {
        title: event.summary || 'Imported Event',
        start_time: icsDateToDate(event.start) || new Date(),
        end_time: event.end ? (icsDateToDate(event.end) || new Date()) : new Date(),
        website: '',
        description: event.description || '',
        location: event.location || '',
        slug: await generateUniqueSlug(event.summary),
      },
    })

    return redirect('/add-event?form=import&success=Event+imported+successfully!')
  } catch (error) {
    console.error('ICS import error:', error)
    return redirect(`/add-event?form=import&error=${encodeURIComponent('Error: Failed to import event.')}`)
  }
}
