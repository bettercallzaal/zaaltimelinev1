import { TimelineEntry } from '@/lib/types'
import { calendarDateKey } from '@/lib/calendar-date'
import { safeLink, validateNewEntry } from '@/lib/validate'

/**
 * Entries older builds left in this browser's localStorage. Those builds saved
 * the whole timeline there whenever the API failed, so the list mixes copies of
 * database rows with entries that only ever existed in this browser.
 */
export const LOCAL_ENTRIES_KEY = 'timeline-entries'

/** Parse the saved list, dropping anything that is not a usable entry. */
export function readLocalEntries(raw: string | null): TimelineEntry[] {
  if (!raw) return []
  try {
    const value: unknown = JSON.parse(raw)
    if (!Array.isArray(value)) return []
    return value.filter((entry): entry is TimelineEntry =>
      !!entry && typeof entry === 'object' &&
      typeof entry.id === 'string' && typeof entry.photo === 'string' &&
      typeof entry.description === 'string' && typeof entry.date === 'string' &&
      !!calendarDateKey(entry.date),
    )
  } catch {
    return []
  }
}

/**
 * Older builds gave browser-only entries a `Date.now()` id. Database rows get a
 * cuid or uuid, never digits only, so a saved copy with a non-numeric id is a
 * copy of a database row. If that row is gone it was deleted on purpose and
 * must not be restored.
 */
export function isBrowserOnlyId(id: string): boolean {
  return /^\d+$/.test(id)
}

// Compare entries the way the server stores them (validate.ts trims the
// description and normalizes the link), so a saved copy of a row that is
// already in the database is not counted or restored twice. An invalid link
// is kept raw so it never matches a row that has no link.
export function entryIdentity(entry: TimelineEntry): string {
  const rawLink = entry.link ?? ''
  return JSON.stringify([
    entry.photo,
    entry.description.trim(),
    calendarDateKey(entry.date),
    rawLink ? safeLink(rawLink) ?? rawLink : '',
  ])
}

/** Local entries with no matching server row (matched one-for-one). */
export function unmatchedEntries(serverEntries: TimelineEntry[], localEntries: TimelineEntry[]): TimelineEntry[] {
  const available = new Map<string, number>()
  for (const entry of serverEntries) {
    const identity = entryIdentity(entry)
    available.set(identity, (available.get(identity) ?? 0) + 1)
  }
  const unmatched: TimelineEntry[] = []
  for (const localEntry of localEntries) {
    const identity = entryIdentity(localEntry)
    const count = available.get(identity) ?? 0
    if (count > 0) available.set(identity, count - 1)
    else unmatched.push(localEntry)
  }
  return unmatched
}

/** Browser-only entries the database does not have yet: the restore candidates. */
export function pendingLocalEntries(serverEntries: TimelineEntry[], localEntries: TimelineEntry[]): TimelineEntry[] {
  return unmatchedEntries(serverEntries, localEntries.filter(entry => isBrowserOnlyId(entry.id)))
}

/** Newest calendar day first. Ties keep their order. */
export function byCalendarDayDesc(a: TimelineEntry, b: TimelineEntry): number {
  return calendarDateKey(b.date).localeCompare(calendarDateKey(a.date))
}

export function mergeEntries(serverEntries: TimelineEntry[], localEntries: TimelineEntry[]): TimelineEntry[] {
  return [...serverEntries, ...pendingLocalEntries(serverEntries, localEntries)].sort(byCalendarDayDesc)
}

/** Why the server would refuse this entry, or null if it can be restored. */
export function restoreProblem(entry: TimelineEntry): string | null {
  // Check the JSON the restore request would send, not the in-memory object.
  const checked = validateNewEntry(JSON.parse(JSON.stringify(entry)))
  return checked.ok ? null : checked.error
}
