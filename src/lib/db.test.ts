import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchEvents, addEventToDB, loadEvent } from './db'

// Mock Prisma
vi.mock('./prisma', () => ({
  default: {
    event: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn()
    }
  }
}))

// Mock hash module
vi.mock('./hash', () => ({
  generateUniqueSlug: vi.fn().mockResolvedValue('test-slug-12345678')
}))

import prisma from './prisma'
import { generateUniqueSlug } from './hash'

describe('searchEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockEvents = [
    {
      id: 1,
      title: 'Tech Meetup',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      start_time: new Date('2024-06-15T18:00:00Z'),
      end_time: new Date('2024-06-15T21:00:00Z'),
      website: 'https://example.com',
      description: 'A great meetup',
      location: 'Portland, OR',
      slug: 'tech-12345678'
    }
  ]

  it('returns search results with pagination info', async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents)
    vi.mocked(prisma.event.count).mockResolvedValue(1)

    const result = await searchEvents('tech', 1, 10)

    expect(result.results).toHaveLength(1)
    expect(result.pagination).toEqual({
      page: 1,
      limit: 10,
      totalCount: 1,
      totalPages: 1
    })
  })

  it('queries with case-insensitive search on title and description', async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([])
    vi.mocked(prisma.event.count).mockResolvedValue(0)

    await searchEvents('test query', 1, 10)

    expect(prisma.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            expect.objectContaining({
              OR: [
                { title: { contains: 'test query', mode: 'insensitive' } },
                { description: { contains: 'test query', mode: 'insensitive' } }
              ]
            })
          ])
        })
      })
    )
  })

  it('filters out past events (end_time < now)', async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([])
    vi.mocked(prisma.event.count).mockResolvedValue(0)

    await searchEvents('test', 1, 10)

    expect(prisma.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            expect.objectContaining({
              end_time: { gte: expect.any(Date) }
            })
          ])
        })
      })
    )
  })

  it('calculates correct skip value for pagination', async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([])
    vi.mocked(prisma.event.count).mockResolvedValue(0)

    await searchEvents('test', 3, 10)

    expect(prisma.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 20, // (3-1) * 10
        take: 10
      })
    )
  })

  it('calculates total pages correctly', async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([])
    vi.mocked(prisma.event.count).mockResolvedValue(25)

    const result = await searchEvents('test', 1, 10)

    expect(result.pagination.totalPages).toBe(3) // ceil(25/10)
  })

  it('handles empty results', async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([])
    vi.mocked(prisma.event.count).mockResolvedValue(0)

    const result = await searchEvents('nonexistent', 1, 10)

    expect(result.results).toHaveLength(0)
    expect(result.pagination.totalCount).toBe(0)
    expect(result.pagination.totalPages).toBe(0)
  })

  it('converts null fields to undefined in results', async () => {
    const eventWithNulls = {
      ...mockEvents[0],
      description: null,
      website: null,
      location: null
    }
    vi.mocked(prisma.event.findMany).mockResolvedValue([eventWithNulls])
    vi.mocked(prisma.event.count).mockResolvedValue(1)

    const result = await searchEvents('tech', 1, 10)

    expect(result.results[0].description).toBeUndefined()
    expect(result.results[0].website).toBeUndefined()
    expect(result.results[0].location).toBeUndefined()
  })

  it('uses default values for page and limit', async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([])
    vi.mocked(prisma.event.count).mockResolvedValue(0)

    await searchEvents('test')

    expect(prisma.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0, // (1-1) * 10
        take: 10
      })
    )
  })

  it('orders results by createdAt descending', async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([])
    vi.mocked(prisma.event.count).mockResolvedValue(0)

    await searchEvents('test', 1, 10)

    expect(prisma.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: 'desc' }
      })
    )
  })

  it('throws error on database failure', async () => {
    vi.mocked(prisma.event.findMany).mockRejectedValue(new Error('DB error'))

    await expect(searchEvents('test', 1, 10)).rejects.toThrow('Failed to search events')
  })

  it('runs findMany and count in parallel', async () => {
    let findManyCalled = false
    let countCalled = false

    vi.mocked(prisma.event.findMany).mockImplementation(async () => {
      findManyCalled = true
      // Check that count was also called (parallel execution)
      await new Promise(resolve => setTimeout(resolve, 10))
      return []
    })

    vi.mocked(prisma.event.count).mockImplementation(async () => {
      countCalled = true
      await new Promise(resolve => setTimeout(resolve, 10))
      return 0
    })

    await searchEvents('test', 1, 10)

    expect(findManyCalled).toBe(true)
    expect(countCalled).toBe(true)
  })
})

describe('addEventToDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const validEventData = {
    title: 'New Event',
    start_time: '2024-06-15T18:00:00',
    end_time: '2024-06-15T21:00:00',
    website: 'https://example.com',
    description: 'Event description',
    location: 'Portland, OR'
  }

  it('creates event with correct data', async () => {
    vi.mocked(prisma.event.create).mockResolvedValue({} as any)

    await addEventToDB(validEventData)

    expect(prisma.event.create).toHaveBeenCalledWith({
      data: {
        title: 'New Event',
        start_time: expect.any(Date),
        end_time: expect.any(Date),
        website: 'https://example.com',
        description: 'Event description',
        location: 'Portland, OR',
        slug: 'test-slug-12345678'
      }
    })
  })

  it('converts string dates to Date objects', async () => {
    vi.mocked(prisma.event.create).mockResolvedValue({} as any)

    await addEventToDB(validEventData)

    const createCall = vi.mocked(prisma.event.create).mock.calls[0][0]
    expect(createCall.data.start_time).toBeInstanceOf(Date)
    expect(createCall.data.end_time).toBeInstanceOf(Date)
  })

  it('generates unique slug from title', async () => {
    vi.mocked(prisma.event.create).mockResolvedValue({} as any)

    await addEventToDB(validEventData)

    expect(generateUniqueSlug).toHaveBeenCalledWith('New Event')
  })

  it('propagates database errors', async () => {
    vi.mocked(prisma.event.create).mockRejectedValue(new Error('DB error'))

    await expect(addEventToDB(validEventData)).rejects.toThrow('DB error')
  })
})

describe('loadEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('finds event by slug', async () => {
    const mockEvent = {
      id: 1,
      title: 'Test Event',
      slug: 'test-12345678'
    }
    vi.mocked(prisma.event.findUnique).mockResolvedValue(mockEvent as any)

    const result = await loadEvent({ slug: 'test-12345678' })

    expect(prisma.event.findUnique).toHaveBeenCalledWith({
      where: { slug: 'test-12345678' }
    })
    expect(result).toEqual(mockEvent)
  })

  it('returns null for non-existent slug', async () => {
    vi.mocked(prisma.event.findUnique).mockResolvedValue(null)

    const result = await loadEvent({ slug: 'nonexistent' })

    expect(result).toBeNull()
  })
})
