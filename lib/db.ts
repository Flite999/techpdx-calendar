'use server'
import prisma from './prisma'
import { schema } from './zod'
import { generateUniqueSlug } from './hash'

export async function searchEvents(
    query: string,
    page: number = 1,
    limit: number = 10
) {
    const skip = (page - 1) * limit

    try {
        const [results, totalCount] = await Promise.all([
            prisma.event.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                },
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                    updatedAt: true,
                    start_time: true,
                    end_time: true,
                    website: true,
                    description: true,
                    location: true,
                    slug: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.event.count({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                }
            })
        ])

        return {
            results,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        }
    } catch (error) {
        console.error('Database search error:', error)
        throw new Error('Failed to search events')
    }
}



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
                slug: await generateUniqueSlug(validatedFields.data.title)
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

export async function loadEvent(slug: { slug: string }) {
    return await prisma.event.findUnique({
        where: { slug: slug.slug },
    });
}