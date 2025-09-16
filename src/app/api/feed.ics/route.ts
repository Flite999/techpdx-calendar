import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { ICalCalendar } from 'ical-generator';

export async function GET() {
    const events = await prisma.event.findMany();
    const calendar = new ICalCalendar({
        name: 'TechPDX Calendar'
    });

    events.forEach((event) => {
        calendar.createEvent({
            start: event.start_time,
            end: event.end_time,
            summary: event.title,
            description: event.description,
            location: event.location,
        });
    });

    return new NextResponse(calendar.toString(), {
        status: 200,
        headers: {
            'Content-Type': 'text/calendar; charset=UTF-8',
            'Content-Disposition': 'attachment; filename="feed.ics"',
        },
    })
}
