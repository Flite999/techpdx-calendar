'use server'
import prisma from '../../lib/prisma'
import { convertIcsCalendar, type IcsEvent } from 'ts-ics'
import { importSchema } from '../../lib/zod'
import { generateUniqueSlug } from '../../lib/hash';

export type ImportEventState = {
    message: string;
    errors: {
        ics_url?: string[];
    };
};

export type AddEventState = {
    message: string;
    errors: {
        title?: string[];
        start_time?: string[];
        end_time?: string[];
        location?: string[];
        website?: string[];
        description?: string[];
    };
};

export async function importEventFromICS(initialState: any, formData: FormData): Promise<ImportEventState> {
    const validatedFields = importSchema.safeParse({
        ics_url: formData.get('ics_url')
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to import event. Please check the ICS URL.'
        }
    }

    try {
        const res = await fetch(validatedFields.data.ics_url)
        if (!res.ok) {
            return {
                message: 'Failed to fetch ICS file.',
                errors: { ics_url: ['Could not fetch ICS file.'] }
            }
        }
        const icsText = await res.text()
        const calendar = convertIcsCalendar(undefined, icsText)
        if (!calendar || !calendar.events || calendar.events.length === 0) {
            return {
                message: 'No events found in ICS file.',
                errors: { ics_url: ['No events found in ICS file.'] }
            }
        }
        // Take first event only for now
        const event: IcsEvent = calendar.events[0]
        // Convert IcsDateObject to JS Date
        function icsDateToDate(icsDate: any): Date | null {
            if (!icsDate) return null;
            if (icsDate.date) return new Date(icsDate.date);
            if (icsDate.dateTime) return new Date(icsDate.dateTime);
            return null;
        }

        await prisma.event.create({
            data: {
                title: event.summary || 'Imported Event',
                start_time: icsDateToDate(event.start) || new Date(),
                end_time: event.end ? (icsDateToDate(event.end) || new Date()) : new Date(),
                website: '',
                description: event.description || '',
                location: event.location || '',
                slug: await generateUniqueSlug(event.summary)
            },
        })
        return {
            message: 'Event imported successfully!',
            errors: {}
        }
    } catch (error) {
        console.error('ICS import error:', error)
        return {
            message: 'Error: Failed to import event.',
            errors: {}
        }
    }
}
