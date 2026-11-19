import { afterEach, describe, expect, it, vi } from 'vitest'
import { calendarDateKey, formatCalendarDate, todayInputValue } from '@/lib/calendar-date'

const originalTz = process.env.TZ

afterEach(() => {
  process.env.TZ = originalTz
  vi.useRealTimers()
})

describe('calendarDateKey', () => {
  it('reads the day from an ISO string', () => {
    expect(calendarDateKey('2024-05-01T00:00:00.000Z')).toBe('2024-05-01')
    expect(calendarDateKey('2024-05-01')).toBe('2024-05-01')
  })

  it('reads the UTC day from a Date', () => {
    expect(calendarDateKey(new Date('2024-12-31T00:00:00.000Z'))).toBe('2024-12-31')
  })

  it('rejects impossible and unparseable dates', () => {
    expect(calendarDateKey('2024-02-30T00:00:00.000Z')).toBe('')
    expect(calendarDateKey('2023-02-29')).toBe('')
    expect(calendarDateKey('not a date')).toBe('')
    expect(calendarDateKey(new Date(Number.NaN))).toBe('')
  })

  it('accepts a leap day', () => {
    expect(calendarDateKey('2024-02-29T00:00:00.000Z')).toBe('2024-02-29')
  })
})

describe('formatCalendarDate', () => {
  const options = { month: 'short', day: 'numeric', year: 'numeric' } as const

  it.each(['America/Los_Angeles', 'UTC', 'Pacific/Kiritimati'])('shows the stored day in %s', tz => {
    process.env.TZ = tz
    expect(formatCalendarDate('2024-05-01T00:00:00.000Z', options)).toBe('May 1, 2024')
    expect(formatCalendarDate('2024-01-01T00:00:00.000Z', { month: 'long', year: 'numeric' })).toBe('January 2024')
  })

  it('returns an empty string for a bad date', () => {
    expect(formatCalendarDate('garbage', options)).toBe('')
  })
})

describe('todayInputValue', () => {
  it('uses the local calendar day, not the UTC one', () => {
    process.env.TZ = 'America/Los_Angeles'
    vi.useFakeTimers()
    // 03:00 UTC on May 2 is still the evening of May 1 in Los Angeles.
    vi.setSystemTime(new Date('2024-05-02T03:00:00.000Z'))
    expect(new Date().getTimezoneOffset()).toBeGreaterThan(0)
    expect(todayInputValue()).toBe('2024-05-01')
  })
})
