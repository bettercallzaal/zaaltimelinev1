/** Return the calendar day represented by an API/Prisma date without applying the viewer's timezone. */
export function calendarDateKey(value: Date | string): string {
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})/)
    if (match) {
      const date = new Date(`${match[1]}T00:00:00.000Z`)
      if (!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === match[1]) return match[1]
      return ''
    }
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export function formatCalendarDate(value: Date | string, options: Intl.DateTimeFormatOptions): string {
  const key = calendarDateKey(value)
  if (!key) return ''
  return new Date(`${key}T00:00:00.000Z`).toLocaleDateString('en-US', {
    ...options,
    timeZone: 'UTC',
  })
}

export function todayInputValue(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
