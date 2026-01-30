import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hashId, generateUniqueSlug } from './hash'

// Mock Prisma
vi.mock('./prisma', () => ({
  default: {
    event: {
      findUnique: vi.fn()
    }
  }
}))

import prisma from './prisma'

describe('hashId', () => {
  it('returns an 8-character hex string', () => {
    const result = hashId('test')
    expect(result).toHaveLength(8)
    expect(result).toMatch(/^[0-9a-f]{8}$/)
  })

  it('produces consistent output for same input', () => {
    const result1 = hashId('hello world')
    const result2 = hashId('hello world')
    expect(result1).toBe(result2)
  })

  it('produces different output for different inputs', () => {
    const result1 = hashId('test1')
    const result2 = hashId('test2')
    expect(result1).not.toBe(result2)
  })

  it('handles empty string', () => {
    const result = hashId('')
    expect(result).toHaveLength(8)
    expect(result).toMatch(/^[0-9a-f]{8}$/)
  })

  it('handles special characters', () => {
    const result = hashId('test!@#$%^&*()')
    expect(result).toHaveLength(8)
    expect(result).toMatch(/^[0-9a-f]{8}$/)
  })

  it('handles unicode characters', () => {
    const result = hashId('test-日本語-emoji-🎉')
    expect(result).toHaveLength(8)
    expect(result).toMatch(/^[0-9a-f]{8}$/)
  })

  it('handles very long strings', () => {
    const longString = 'a'.repeat(10000)
    const result = hashId(longString)
    expect(result).toHaveLength(8)
    expect(result).toMatch(/^[0-9a-f]{8}$/)
  })

  it('produces expected hash for known input', () => {
    // SHA-256 of "test" starts with "9f86d081..."
    const result = hashId('test')
    expect(result).toBe('9f86d081')
  })
})

describe('generateUniqueSlug', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generates slug from title with hash suffix', async () => {
    vi.mocked(prisma.event.findUnique).mockResolvedValue(null)

    const slug = await generateUniqueSlug('Test Event')

    // Should be lowercase, limited to 5 chars, with hash suffix
    expect(slug).toMatch(/^test--[0-9a-f]{8}$/)
  })

  it('converts title to lowercase', async () => {
    vi.mocked(prisma.event.findUnique).mockResolvedValue(null)

    const slug = await generateUniqueSlug('UPPERCASE TITLE')

    expect(slug).toMatch(/^upper-[0-9a-f]{8}$/)
    expect(slug).not.toMatch(/[A-Z]/)
  })

  it('replaces non-alphanumeric characters with hyphens', async () => {
    vi.mocked(prisma.event.findUnique).mockResolvedValue(null)

    const slug = await generateUniqueSlug('Test!@#Event')

    expect(slug).toMatch(/^test--[0-9a-f]{8}$/)
  })

  it('trims hyphens from start and end of base slug', async () => {
    vi.mocked(prisma.event.findUnique).mockResolvedValue(null)

    const slug = await generateUniqueSlug('---Test---')

    expect(slug).toMatch(/^test-[0-9a-f]{8}$/)
    expect(slug).not.toMatch(/^-/)
    expect(slug).not.toMatch(/-{2,}[0-9a-f]{8}$/)
  })

  it('limits base slug length to 5 characters', async () => {
    vi.mocked(prisma.event.findUnique).mockResolvedValue(null)

    const slug = await generateUniqueSlug('Very Long Event Title That Exceeds Limit')

    // Base should be 5 chars + hyphen + 8 char hash = 14 chars
    const baseSlug = slug.split('-').slice(0, -1).join('-')
    expect(baseSlug.length).toBeLessThanOrEqual(5)
  })

  it('checks database for uniqueness', async () => {
    vi.mocked(prisma.event.findUnique).mockResolvedValue(null)

    await generateUniqueSlug('Test')

    expect(prisma.event.findUnique).toHaveBeenCalledWith({
      where: { slug: expect.any(String) }
    })
  })

  it('appends random suffix on collision', async () => {
    // First call returns existing event (collision), triggers random suffix
    vi.mocked(prisma.event.findUnique).mockResolvedValueOnce({
      id: 1,
      slug: 'test-abc12345'
    } as any)

    const slug = await generateUniqueSlug('Test')

    // Should have additional random 4-char suffix
    expect(slug).toMatch(/^test-[0-9a-f]{8}-[a-z0-9]{4}$/)
  })

  it('handles titles with only special characters', async () => {
    vi.mocked(prisma.event.findUnique).mockResolvedValue(null)

    const slug = await generateUniqueSlug('!@#$%')

    // Base slug would be empty after cleaning, just the hash
    expect(slug).toMatch(/^-[0-9a-f]{8}$/)
  })

  it('produces different hashes for different titles', async () => {
    vi.mocked(prisma.event.findUnique).mockResolvedValue(null)

    const slug1 = await generateUniqueSlug('Event A')
    const slug2 = await generateUniqueSlug('Event B')

    expect(slug1).not.toBe(slug2)
  })
})
