import { describe, it, expect } from 'vitest'
import { schema, importSchema } from './zod'

describe('schema (event form validation)', () => {
  const validEventData = {
    title: 'Tech Meetup',
    start_time: '2024-06-15T18:00:00',
    end_time: '2024-06-15T21:00:00',
    website: 'https://example.com',
    description: 'A great tech meetup',
    location: 'Portland, OR'
  }

  describe('valid inputs', () => {
    it('accepts valid event data', () => {
      const result = schema.safeParse(validEventData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Tech Meetup')
        expect(result.data.start_time).toBe('2024-06-15T18:00:00')
        expect(result.data.website).toBe('https://example.com')
      }
    })

    it('accepts empty strings for optional-like fields', () => {
      const data = {
        ...validEventData,
        website: '',
        description: '',
        location: ''
      }
      const result = schema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('accepts various date formats', () => {
      const data = {
        ...validEventData,
        start_time: '2024-06-15',
        end_time: '2024-06-16'
      }
      const result = schema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('invalid inputs', () => {
    it('rejects missing title', () => {
      const { title, ...data } = validEventData
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects null title', () => {
      const data = { ...validEventData, title: null }
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects missing start_time', () => {
      const { start_time, ...data } = validEventData
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects missing end_time', () => {
      const { end_time, ...data } = validEventData
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects missing website', () => {
      const { website, ...data } = validEventData
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects missing description', () => {
      const { description, ...data } = validEventData
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects missing location', () => {
      const { location, ...data } = validEventData
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects non-string title', () => {
      const data = { ...validEventData, title: 123 }
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects undefined values', () => {
      const data = { ...validEventData, title: undefined }
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects completely empty object', () => {
      const result = schema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('rejects null', () => {
      const result = schema.safeParse(null)
      expect(result.success).toBe(false)
    })
  })

  describe('error messages', () => {
    it('provides custom error message for invalid title', () => {
      const data = { ...validEventData, title: null }
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        const titleError = result.error.issues.find(i => i.path.includes('title'))
        expect(titleError).toBeDefined()
      }
    })
  })

  describe('sanitization transforms', () => {
    it('strips HTML from title', () => {
      const data = { ...validEventData, title: '<b>Bold</b> Meetup' }
      const result = schema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Bold Meetup')
      }
    })

    it('strips HTML from description', () => {
      const data = { ...validEventData, description: '<script>alert("xss")</script>Hello' }
      const result = schema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.description).not.toContain('<script>')
      }
    })

    it('strips HTML from location', () => {
      const data = { ...validEventData, location: '<em>Portland</em>, OR' }
      const result = schema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.location).toBe('Portland, OR')
      }
    })

    it('truncates long title to max length', () => {
      const data = { ...validEventData, title: 'A'.repeat(300) }
      const result = schema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toHaveLength(200)
      }
    })

    it('sanitizes website URL to reject javascript:', () => {
      const data = { ...validEventData, website: 'javascript:alert(1)' }
      const result = schema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.website).toBe('')
      }
    })

    it('sanitizes website URL to reject ftp:', () => {
      const data = { ...validEventData, website: 'ftp://example.com' }
      const result = schema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.website).toBe('')
      }
    })

    it('rejects title that is only HTML (empty after sanitization)', () => {
      const data = { ...validEventData, title: '<b></b>' }
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('normalizes whitespace in title', () => {
      const data = { ...validEventData, title: '  Too   many   spaces  ' }
      const result = schema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Too many spaces')
      }
    })
  })

  describe('date validation', () => {
    it('rejects invalid start_time string', () => {
      const data = { ...validEventData, start_time: 'not-a-date' }
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects invalid end_time string', () => {
      const data = { ...validEventData, end_time: 'not-a-date' }
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects end_time before start_time', () => {
      const data = {
        ...validEventData,
        start_time: '2024-06-15T21:00:00',
        end_time: '2024-06-15T18:00:00',
      }
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('accepts end_time equal to start_time', () => {
      const data = {
        ...validEventData,
        start_time: '2024-06-15T18:00:00',
        end_time: '2024-06-15T18:00:00',
      }
      const result = schema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})

describe('importSchema (ICS URL validation)', () => {
  describe('valid inputs', () => {
    it('accepts valid HTTPS URL', () => {
      const result = importSchema.safeParse({ ics_url: 'https://example.com/calendar.ics' })
      expect(result.success).toBe(true)
    })

    it('accepts valid HTTP URL', () => {
      const result = importSchema.safeParse({ ics_url: 'http://example.com/calendar.ics' })
      expect(result.success).toBe(true)
    })

    it('accepts URL with query parameters', () => {
      const result = importSchema.safeParse({ ics_url: 'https://example.com/cal.ics?token=abc123' })
      expect(result.success).toBe(true)
    })

    it('accepts URL with port number', () => {
      const result = importSchema.safeParse({ ics_url: 'https://example.com:8080/calendar.ics' })
      expect(result.success).toBe(true)
    })

    it('accepts URL with path segments', () => {
      const result = importSchema.safeParse({ ics_url: 'https://example.com/path/to/calendar.ics' })
      expect(result.success).toBe(true)
    })
  })

  describe('invalid inputs', () => {
    it('rejects missing ics_url', () => {
      const result = importSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('rejects null ics_url', () => {
      const result = importSchema.safeParse({ ics_url: null })
      expect(result.success).toBe(false)
    })

    it('rejects empty string', () => {
      const result = importSchema.safeParse({ ics_url: '' })
      expect(result.success).toBe(false)
    })

    it('rejects non-URL string', () => {
      const result = importSchema.safeParse({ ics_url: 'not-a-url' })
      expect(result.success).toBe(false)
    })

    it('rejects URL without protocol', () => {
      const result = importSchema.safeParse({ ics_url: 'example.com/calendar.ics' })
      expect(result.success).toBe(false)
    })

    it('rejects ftp protocol', () => {
      const result = importSchema.safeParse({ ics_url: 'ftp://example.com/calendar.ics' })
      expect(result.success).toBe(false)
    })

    it('rejects non-string value', () => {
      const result = importSchema.safeParse({ ics_url: 123 })
      expect(result.success).toBe(false)
    })
  })

  describe('error messages', () => {
    it('provides custom error message for invalid URL', () => {
      const result = importSchema.safeParse({ ics_url: 'not-a-url' })
      expect(result.success).toBe(false)
      if (!result.success) {
        const urlError = result.error.issues.find(i => i.path.includes('ics_url'))
        expect(urlError?.message).toContain('Invalid ICS URL')
      }
    })
  })
})
