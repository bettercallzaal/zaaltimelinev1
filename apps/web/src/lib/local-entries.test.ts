import { describe, expect, it } from 'vitest'
import { TimelineEntry } from '@/lib/types'
import {
  byCalendarDayDesc,
  entryIdentity,
  isBrowserOnlyId,
  mergeEntries,
  pendingLocalEntries,
  readLocalEntries,
  restoreProblem,
  unmatchedEntries,
} from '@/lib/local-entries'

const PHOTO = 'https://example.com/a.jpg'

// Entries as they come back from JSON: dates are strings at runtime.
function entry(over: Partial<Record<keyof TimelineEntry, unknown>>): TimelineEntry {
  return {
    id: '1700000000000',
    photo: PHOTO,
    description: 'First day',
    date: '2024-05-01T00:00:00.000Z',
    createdAt: '2024-05-01T12:00:00.000Z',
    ...over,
  } as unknown as TimelineEntry
}

describe('readLocalEntries', () => {
  it('returns nothing for missing, broken or non-array data', () => {
    expect(readLocalEntries(null)).toEqual([])
    expect(readLocalEntries('{not json')).toEqual([])
    expect(readLocalEntries('{"id":"1"}')).toEqual([])
  })

  it('drops rows that are not usable entries', () => {
    const good = entry({})
    const raw = JSON.stringify([good, null, 'x', entry({ id: 5 }), entry({ date: 'garbage' }), entry({ photo: undefined })])
    expect(readLocalEntries(raw)).toEqual([good])
  })
})

describe('isBrowserOnlyId', () => {
  it('treats Date.now() ids as browser-only and database ids as not', () => {
    expect(isBrowserOnlyId('1700000000000')).toBe(true)
    expect(isBrowserOnlyId('clx1abc2d0000qwerty123456')).toBe(false)
    expect(isBrowserOnlyId('3f1c8a2e-4b7d-4e3a-9c1f-2a6b5d8e7f90')).toBe(false)
    expect(isBrowserOnlyId('')).toBe(false)
  })
})

describe('entryIdentity', () => {
  it('matches the way the server stores an entry', () => {
    const local = entry({ description: '  First day  ', link: 'https://x.com' })
    const server = entry({ id: 'clx1', description: 'First day', link: 'https://x.com/' })
    expect(entryIdentity(local)).toBe(entryIdentity(server))
  })

  it('treats a missing, null and empty link the same', () => {
    expect(entryIdentity(entry({ link: undefined }))).toBe(entryIdentity(entry({ link: null })))
    expect(entryIdentity(entry({ link: '' }))).toBe(entryIdentity(entry({ link: null })))
  })

  it('never matches an invalid link to a row with no link', () => {
    expect(entryIdentity(entry({ link: 'example.com' }))).not.toBe(entryIdentity(entry({ link: null })))
  })

  it('compares by calendar day', () => {
    expect(entryIdentity(entry({ date: '2024-05-01T00:00:00.000Z' })))
      .not.toBe(entryIdentity(entry({ date: '2024-05-02T00:00:00.000Z' })))
  })
})

describe('unmatchedEntries', () => {
  it('matches one-for-one, so a real duplicate still counts', () => {
    const server = [entry({ id: 'clx1' })]
    const local = [entry({ id: '1' }), entry({ id: '2' })]
    expect(unmatchedEntries(server, local).map(e => e.id)).toEqual(['2'])
  })
})

describe('pendingLocalEntries', () => {
  it('skips saved copies of database rows, including rows deleted since', () => {
    const kept = entry({ id: 'clx-kept', description: 'Still there' })
    const deletedCopy = entry({ id: 'clx-deleted', description: 'Deleted later' })
    const browserOnly = entry({ id: '1700000000001', description: 'Only here' })
    const pending = pendingLocalEntries([kept], [kept, deletedCopy, browserOnly])
    expect(pending.map(e => e.id)).toEqual(['1700000000001'])
  })

  it('skips browser-only entries the database already has', () => {
    const server = [entry({ id: 'clx1' })]
    expect(pendingLocalEntries(server, [entry({ id: '1700000000000' })])).toEqual([])
  })
})

describe('mergeEntries', () => {
  it('adds pending entries and sorts newest day first', () => {
    const server = [entry({ id: 'clx-a', description: 'A', date: '2024-03-01T00:00:00.000Z' })]
    const local = [
      entry({ id: '1', description: 'B', date: '2024-06-01T00:00:00.000Z' }),
      entry({ id: 'clx-gone', description: 'C', date: '2024-07-01T00:00:00.000Z' }),
    ]
    expect(mergeEntries(server, local).map(e => e.id)).toEqual(['1', 'clx-a'])
  })
})

describe('byCalendarDayDesc', () => {
  it('orders by day, not by stored time of day', () => {
    const late = entry({ id: 'late', date: '2024-05-01T23:00:00.000Z' })
    const next = entry({ id: 'next', date: '2024-05-02T00:00:00.000Z' })
    const sameDay = entry({ id: 'same', date: '2024-05-01T00:00:00.000Z' })
    expect([late, sameDay, next].sort(byCalendarDayDesc).map(e => e.id)).toEqual(['next', 'late', 'same'])
  })
})

describe('restoreProblem', () => {
  it('is null for an entry the server would accept', () => {
    expect(restoreProblem(entry({ link: 'https://x.com' }))).toBeNull()
  })

  it('gives the server reason for entries it would refuse', () => {
    expect(restoreProblem(entry({ link: 'example.com' }))).toMatch(/http/)
    expect(restoreProblem(entry({ photo: 'data:text/plain;base64,AAAA' }))).toMatch(/Photo/)
    expect(restoreProblem(entry({ description: '   ' }))).toMatch(/Description/)
  })
})
