import prisma from './prisma'
import { generateUniqueSlug } from './hash'

export async function searchEvents(
    query: string,
    page: number = 1,
    limit: number = 10
) {
    const skip = (page - 1) * limit
    const now = new Date()

    try {
        const [results, totalCount] = await Promise.all([
            prisma.event.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                { title: { contains: query, mode: 'insensitive' } },
                                { description: { contains: query, mode: 'insensitive' } }
                            ]
                        },
                        { end_time: { gte: now } }
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
                    AND: [
                        {
                            OR: [
                                { title: { contains: query, mode: 'insensitive' } },
                                { description: { contains: query, mode: 'insensitive' } }
                            ]
                        },
                        { end_time: { gte: now } }
                    ]
                }
            })
        ])

        return {
            results: results.map(event => ({
                ...event,
                description: event.description ?? undefined,
                website: event.website ?? undefined,
                location: event.location ?? undefined,
            })),
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

export async function addEventToDB(data: {
    title: string
    start_time: string
    end_time: string
    website: string
    description: string
    location: string
}) {
    await prisma.event.create({
        data: {
            title: data.title,
            start_time: new Date(data.start_time),
            end_time: new Date(data.end_time),
            website: data.website,
            description: data.description,
            location: data.location,
            slug: await generateUniqueSlug(data.title)
        },
    })
}

export async function loadEvent(slug: { slug: string }) {
    return await prisma.event.findUnique({
        where: { slug: slug.slug },
    });
}
