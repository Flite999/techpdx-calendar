'use server'

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


import { z } from 'zod'
import prisma from '../../lib/prisma'

const schema = z.object({
    title: z.string({ message: 'Invalid Title' }),
    start_time: z.string({ message: 'Invalid Date' }),
    end_time: z.string({ message: 'Invalid Date' }),
    website: z.string({ message: 'Invalid Website' }),
    description: z.string({ message: 'Invalid Description' }),
    location: z.string({ message: 'Invalid Location' })
})


export async function addEventToDB(initialState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        title: formData.get('title'),
        start_time: formData.get('start_time'),
        end_time: formData.get('end_time'),
        website: formData.get('website'),
        description: formData.get('description'),
        location: formData.get('location')
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to create event. Please check your inputs.'
        }
    }
    try {
        await prisma.event.create({
            data: {
                title: validatedFields.data.title,
                start_time: new Date(validatedFields.data.start_time),
                end_time: new Date(validatedFields.data.end_time),
                website: validatedFields.data.website,
                description: validatedFields.data.description,
                location: validatedFields.data.location,
            },
        })

        return {
            message: 'Event created successfully!',
            errors: {}
        }
    } catch (error) {
        console.error('Database error:', error)
        return {
            message: 'Error: Failed to create event.',
            errors: {}
        }
    }
}