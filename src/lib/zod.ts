import { z } from 'zod'

export const schema = z.object({
    title: z.string({ message: 'Invalid Title' }),
    start_time: z.string({ message: 'Invalid Date' }),
    end_time: z.string({ message: 'Invalid Date' }),
    website: z.string({ message: 'Invalid Website' }),
    description: z.string({ message: 'Invalid Description' }),
    location: z.string({ message: 'Invalid Location' })
})

export const importSchema = z.object({
    ics_url: z.string().url({ message: 'Invalid ICS URL' })
})