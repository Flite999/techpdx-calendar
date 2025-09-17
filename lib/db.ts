import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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
                    location: true
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