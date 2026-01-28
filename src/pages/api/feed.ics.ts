import type { APIRoute } from 'astro'
import prisma from '../../lib/prisma'
import { ICalCalendar } from 'ical-generator'

export const GET: APIRoute = async () => {
  const events = await prisma.event.findMany()
  const calendar = new ICalCalendar({
    name: 'TechPDX Calendar',
  })

  events.forEach((event) => {
    calendar.createEvent({
      start: event.start_time,
      end: event.end_time,
      summary: event.title,
      description: event.description,
      location: event.location,
    })
  })

  return new Response(calendar.toString(), {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=UTF-8',
      'Content-Disposition': 'attachment; filename="feed.ics"',
    },
  })
}
