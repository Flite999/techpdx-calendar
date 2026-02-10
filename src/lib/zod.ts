import { z } from 'zod'
import {
    sanitizeText,
    sanitizeUrl,
    MAX_TITLE_LENGTH,
    MAX_DESCRIPTION_LENGTH,
    MAX_LOCATION_LENGTH,
} from './sanitize'

export const schema = z.object({
    title: z.string({ message: 'Invalid Title' })
        .transform(v => sanitizeText(v, MAX_TITLE_LENGTH))
        .pipe(z.string().min(1, { message: 'Title is required' })),
    start_time: z.string({ message: 'Invalid Date' })
        .refine(v => !isNaN(new Date(v).getTime()), { message: 'Invalid start date' }),
    end_time: z.string({ message: 'Invalid Date' })
        .refine(v => !isNaN(new Date(v).getTime()), { message: 'Invalid end date' }),
    website: z.string({ message: 'Invalid Website' })
        .transform(v => sanitizeUrl(v)),
    description: z.string({ message: 'Invalid Description' })
        .transform(v => sanitizeText(v, MAX_DESCRIPTION_LENGTH)),
    location: z.string({ message: 'Invalid Location' })
        .transform(v => sanitizeText(v, MAX_LOCATION_LENGTH)),
}).refine(data => new Date(data.end_time) >= new Date(data.start_time), {
    message: 'End time must be on or after start time',
    path: ['end_time'],
})

export const importSchema = z.object({
    ics_url: z.string().url({ message: 'Invalid ICS URL' })
        .refine(v => {
            try {
                const url = new URL(v)
                return url.protocol === 'http:' || url.protocol === 'https:'
            } catch {
                return false
            }
        }, { message: 'Only HTTP and HTTPS URLs are allowed' })
})
