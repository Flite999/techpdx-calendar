import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  parseYmParam,
  monthBoundariesUTC,
  formatYm,
  prevYm,
  nextYm,
  monthGrid
} from './dates'

describe('parseYmParam', () => {
  describe('with valid input', () => {
    it('parses a valid YYYY-MM string', () => {
      expect(parseYmParam('2024-06')).toEqual({ year: 2024, month: 6 })
    })

    it('parses January correctly', () => {
      expect(parseYmParam('2024-01')).toEqual({ year: 2024, month: 1 })
    })

    it('parses December correctly', () => {
      expect(parseYmParam('2024-12')).toEqual({ year: 2024, month: 12 })
    })

    it('handles year boundaries', () => {
      expect(parseYmParam('1999-12')).toEqual({ year: 1999, month: 12 })
      expect(parseYmParam('2030-01')).toEqual({ year: 2030, month: 1 })
    })
  })

  describe('with undefined input', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns current year and month when ym is undefined', () => {
      vi.setSystemTime(new Date('2024-07-15T12:00:00Z'))
      expect(parseYmParam(undefined)).toEqual({ year: 2024, month: 7 })
    })

    it('handles year boundary (January)', () => {
      vi.setSystemTime(new Date('2025-01-01T00:00:00Z'))
      expect(parseYmParam(undefined)).toEqual({ year: 2025, month: 1 })
    })

    it('handles year boundary (December)', () => {
      vi.setSystemTime(new Date('2024-12-31T23:59:59Z'))
      expect(parseYmParam(undefined)).toEqual({ year: 2024, month: 12 })
    })
  })

  describe('with invalid input', () => {
    it('throws for invalid format (missing hyphen)', () => {
      expect(() => parseYmParam('202406')).toThrow('Invalid ym parameter')
    })

    it('throws for invalid format (wrong separator)', () => {
      expect(() => parseYmParam('2024/06')).toThrow('Invalid ym parameter')
    })

    it('throws for invalid format (too short)', () => {
      expect(() => parseYmParam('24-06')).toThrow('Invalid ym parameter')
    })

    it('throws for invalid format (too long)', () => {
      expect(() => parseYmParam('2024-006')).toThrow('Invalid ym parameter')
    })

    it('throws for month out of range (0)', () => {
      expect(() => parseYmParam('2024-00')).toThrow('Month out of range')
    })

    it('throws for month out of range (13)', () => {
      expect(() => parseYmParam('2024-13')).toThrow('Month out of range')
    })

    it('throws for random string', () => {
      expect(() => parseYmParam('invalid')).toThrow('Invalid ym parameter')
    })

    it('treats empty string as falsy and returns current date', () => {
      // Empty string is falsy, so parseYmParam returns current date
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-07-15T12:00:00Z'))
      expect(parseYmParam('')).toEqual({ year: 2024, month: 7 })
      vi.useRealTimers()
    })
  })
})

describe('monthBoundariesUTC', () => {
  it('returns correct boundaries for a regular month', () => {
    const { first, nextFirst } = monthBoundariesUTC(2024, 6)
    expect(first.toISOString()).toBe('2024-06-01T00:00:00.000Z')
    expect(nextFirst.toISOString()).toBe('2024-07-01T00:00:00.000Z')
  })

  it('returns correct boundaries for January', () => {
    const { first, nextFirst } = monthBoundariesUTC(2024, 1)
    expect(first.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    expect(nextFirst.toISOString()).toBe('2024-02-01T00:00:00.000Z')
  })

  it('returns correct boundaries for December (year rollover)', () => {
    const { first, nextFirst } = monthBoundariesUTC(2024, 12)
    expect(first.toISOString()).toBe('2024-12-01T00:00:00.000Z')
    expect(nextFirst.toISOString()).toBe('2025-01-01T00:00:00.000Z')
  })

  it('handles leap year February', () => {
    const { first, nextFirst } = monthBoundariesUTC(2024, 2)
    expect(first.toISOString()).toBe('2024-02-01T00:00:00.000Z')
    expect(nextFirst.toISOString()).toBe('2024-03-01T00:00:00.000Z')
  })

  it('handles non-leap year February', () => {
    const { first, nextFirst } = monthBoundariesUTC(2023, 2)
    expect(first.toISOString()).toBe('2023-02-01T00:00:00.000Z')
    expect(nextFirst.toISOString()).toBe('2023-03-01T00:00:00.000Z')
  })

  it('boundaries are in UTC regardless of local timezone', () => {
    const { first, nextFirst } = monthBoundariesUTC(2024, 6)
    expect(first.getUTCHours()).toBe(0)
    expect(first.getUTCMinutes()).toBe(0)
    expect(first.getUTCSeconds()).toBe(0)
    expect(nextFirst.getUTCHours()).toBe(0)
  })
})

describe('formatYm', () => {
  it('formats year and month with zero-padded month', () => {
    expect(formatYm(2024, 6)).toBe('2024-06')
  })

  it('formats single-digit month with leading zero', () => {
    expect(formatYm(2024, 1)).toBe('2024-01')
    expect(formatYm(2024, 9)).toBe('2024-09')
  })

  it('formats double-digit month without extra padding', () => {
    expect(formatYm(2024, 10)).toBe('2024-10')
    expect(formatYm(2024, 12)).toBe('2024-12')
  })

  it('handles various years', () => {
    expect(formatYm(1999, 1)).toBe('1999-01')
    expect(formatYm(2000, 12)).toBe('2000-12')
    expect(formatYm(2030, 6)).toBe('2030-06')
  })
})

describe('prevYm', () => {
  it('returns previous month for mid-year', () => {
    expect(prevYm(2024, 6)).toBe('2024-05')
  })

  it('handles year rollback from January to December', () => {
    expect(prevYm(2024, 1)).toBe('2023-12')
  })

  it('returns previous month for December', () => {
    expect(prevYm(2024, 12)).toBe('2024-11')
  })

  it('returns previous month for February', () => {
    expect(prevYm(2024, 2)).toBe('2024-01')
  })
})

describe('nextYm', () => {
  it('returns next month for mid-year', () => {
    expect(nextYm(2024, 6)).toBe('2024-07')
  })

  it('handles year rollover from December to January', () => {
    expect(nextYm(2024, 12)).toBe('2025-01')
  })

  it('returns next month for January', () => {
    expect(nextYm(2024, 1)).toBe('2024-02')
  })

  it('returns next month for November', () => {
    expect(nextYm(2024, 11)).toBe('2024-12')
  })
})

describe('monthGrid', () => {
  it('returns a 6x7 grid', () => {
    const grid = monthGrid(2024, 6)
    expect(grid).toHaveLength(6)
    grid.forEach(row => {
      expect(row).toHaveLength(7)
    })
  })

  it('grid cells are Date objects', () => {
    const grid = monthGrid(2024, 6)
    expect(grid[0][0]).toBeInstanceOf(Date)
  })

  it('first row starts on Sunday', () => {
    const grid = monthGrid(2024, 6)
    expect(grid[0][0].getDay()).toBe(0) // Sunday
  })

  it('each row represents a week (7 consecutive days)', () => {
    const grid = monthGrid(2024, 6)
    for (const row of grid) {
      for (let i = 1; i < row.length; i++) {
        const prevDay = row[i - 1].getDate()
        const currDay = row[i].getDate()
        const prevMonth = row[i - 1].getMonth()
        const currMonth = row[i].getMonth()

        // Either consecutive days in same month, or month rollover
        if (prevMonth === currMonth) {
          expect(currDay).toBe(prevDay + 1)
        }
      }
    }
  })

  it('contains the first day of the month', () => {
    const grid = monthGrid(2024, 6)
    const flatGrid = grid.flat()
    const firstOfJune = flatGrid.find(d => d.getMonth() === 5 && d.getDate() === 1)
    expect(firstOfJune).toBeDefined()
  })

  it('contains the last day of the month', () => {
    // June 2024 has 30 days
    const grid = monthGrid(2024, 6)
    const flatGrid = grid.flat()
    const lastOfJune = flatGrid.find(d => d.getMonth() === 5 && d.getDate() === 30)
    expect(lastOfJune).toBeDefined()
  })

  describe('month starting on different weekdays', () => {
    it('handles month starting on Sunday (September 2024)', () => {
      const grid = monthGrid(2024, 9)
      // September 1, 2024 is a Sunday
      expect(grid[0][0].getMonth()).toBe(8) // September (0-indexed)
      expect(grid[0][0].getDate()).toBe(1)
    })

    it('handles month starting on Monday (July 2024)', () => {
      const grid = monthGrid(2024, 7)
      // July 1, 2024 is a Monday, so grid starts with Sunday June 30
      expect(grid[0][0].getMonth()).toBe(5) // June
      expect(grid[0][0].getDate()).toBe(30)
    })

    it('handles month starting on Saturday (June 2024)', () => {
      const grid = monthGrid(2024, 6)
      // June 1, 2024 is a Saturday, so grid starts with Sunday May 26
      expect(grid[0][0].getMonth()).toBe(4) // May
      expect(grid[0][0].getDate()).toBe(26)
    })
  })

  describe('months with different lengths', () => {
    it('handles 28-day month (February non-leap year)', () => {
      const grid = monthGrid(2023, 2)
      const flatGrid = grid.flat()
      const febDays = flatGrid.filter(d => d.getMonth() === 1)
      expect(febDays).toHaveLength(28)
    })

    it('handles 29-day month (February leap year)', () => {
      const grid = monthGrid(2024, 2)
      const flatGrid = grid.flat()
      const febDays = flatGrid.filter(d => d.getMonth() === 1)
      expect(febDays).toHaveLength(29)
    })

    it('handles 30-day month', () => {
      const grid = monthGrid(2024, 4) // April
      const flatGrid = grid.flat()
      const aprilDays = flatGrid.filter(d => d.getMonth() === 3)
      expect(aprilDays).toHaveLength(30)
    })

    it('handles 31-day month', () => {
      const grid = monthGrid(2024, 1) // January
      const flatGrid = grid.flat()
      const janDays = flatGrid.filter(d => d.getMonth() === 0)
      expect(janDays).toHaveLength(31)
    })
  })
})
