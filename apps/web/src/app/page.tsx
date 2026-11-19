'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Timeline from '@/components/Timeline'
import AddEntryModal from '@/components/AddEntryModal'
import { TimelineEntry } from '@/lib/types'
import { WRITE_KEY_HEADER } from '@/lib/write-key-header'
import { calendarDateKey } from '@/lib/calendar-date'
import { safeLink } from '@/lib/validate'

const LOCAL_ENTRIES_KEY = 'timeline-entries'
const ADMIN_KEY_STORAGE = 'timeline-admin-key'

function readLocalEntries(raw: string | null): TimelineEntry[] {
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

// Compare entries the way the server stores them (validate.ts trims the
// description and normalizes the link), so a saved copy of a row that is
// already in the database is not counted or restored twice. An invalid link
// is kept raw so it never matches a row that has no link.
function entryIdentity(entry: TimelineEntry): string {
  const rawLink = entry.link ?? ''
  return JSON.stringify([
    entry.photo,
    entry.description.trim(),
    calendarDateKey(entry.date),
    rawLink ? safeLink(rawLink) ?? rawLink : '',
  ])
}

/** Local entries with no matching server row (matched one-for-one). */
function unmatchedEntries(serverEntries: TimelineEntry[], localEntries: TimelineEntry[]): TimelineEntry[] {
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

function mergeEntries(serverEntries: TimelineEntry[], localEntries: TimelineEntry[]): TimelineEntry[] {
  return [...serverEntries, ...unmatchedEntries(serverEntries, localEntries)]
    .sort((a, b) => calendarDateKey(b.date).localeCompare(calendarDateKey(a.date)))
}

export default function Home() {
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [pendingEntries, setPendingEntries] = useState<TimelineEntry[]>([])
  const [recoveryKey, setRecoveryKey] = useState('')
  const [isRecovering, setIsRecovering] = useState(false)

  // Load entries from API on mount
  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    let savedEntries: TimelineEntry[] = []
    try {
      savedEntries = readLocalEntries(localStorage.getItem(LOCAL_ENTRIES_KEY))
    } catch {
      // Storage can be unavailable in private browsing; still try the API.
    }
    setPendingEntries(savedEntries)
    try {
      const response = await fetch('/api/entries')
      
      if (response.ok) {
        const data = await response.json()
        // Older builds saved the whole list here, server rows included; only
        // rows the database lacks still need restoring.
        setPendingEntries(unmatchedEntries(data, savedEntries))
        setEntries(mergeEntries(data, savedEntries))
      } else {
        setEntries(savedEntries)
      }
    } catch (error) {
      console.error('Error fetching entries:', error)
      setEntries(savedEntries)
    } finally {
      setIsLoaded(true)
    }
  }

  // Don't render until we've loaded from localStorage to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Timeline</h1>
            <p className="text-gray-600 mt-1">Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  // The admin key lives in this browser only. Adding and deleting send it; the
  // server refuses without it (lib/write-key.ts).
  const readKey = () => {
    try {
      return localStorage.getItem(ADMIN_KEY_STORAGE) ?? ''
    } catch {
      return ''
    }
  }

  const saveKey = (key: string) => {
    try {
      if (key) localStorage.setItem(ADMIN_KEY_STORAGE, key)
      else localStorage.removeItem(ADMIN_KEY_STORAGE)
    } catch {
      // Private mode: the key is used for this request only.
    }
  }

  const refusal = async (response: Response) => {
    if (response.status === 401) saveKey('')
    const body = await response.json().catch(() => ({}))
    return typeof body.error === 'string' ? body.error : `Request failed (${response.status})`
  }

  // A refused or failed save is shown as an error. It is never stored in this
  // browser and shown as saved, which is what the page did before.
  const addEntry = async (newEntry: Omit<TimelineEntry, 'id' | 'createdAt'>, key: string) => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', [WRITE_KEY_HEADER]: key },
        body: JSON.stringify(newEntry),
      })
      if (!response.ok) {
        setError(await refusal(response))
        return
      }
      saveKey(key)
      const entry = await response.json()
      setEntries(prev => [entry, ...prev].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ))
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error adding entry:', err)
      setError('Could not reach the server. Nothing was saved.')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteEntry = async (id: string) => {
    setError('')
    const key = readKey()
    if (!key) {
      setError('Deleting needs the admin key. Enter it in the Add Photo form once and it is remembered here.')
      return
    }
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
        headers: { [WRITE_KEY_HEADER]: key },
      })
      if (!response.ok) {
        setError(await refusal(response))
        return
      }
      setEntries(prev => prev.filter(entry => entry.id !== id))
    } catch (err) {
      console.error('Error deleting entry:', err)
      setError('Could not reach the server. Nothing was deleted.')
    }
  }

  const recoverLocalEntries = async () => {
    if (!recoveryKey.trim() || pendingEntries.length === 0 || isRecovering) return
    setIsRecovering(true)
    setError('')
    try {
      const listResponse = await fetch('/api/entries')
      if (!listResponse.ok) {
        setError(await refusal(listResponse))
        return
      }
      const serverEntries: TimelineEntry[] = await listResponse.json()
      const existingCounts = new Map<string, number>()
      for (const entry of serverEntries) {
        const identity = entryIdentity(entry)
        existingCounts.set(identity, (existingCounts.get(identity) ?? 0) + 1)
      }
      const remaining: TimelineEntry[] = []
      let firstError = ''

      for (const localEntry of pendingEntries) {
        const identity = entryIdentity(localEntry)
        const count = existingCounts.get(identity) ?? 0
        if (count > 0) {
          existingCounts.set(identity, count - 1)
          continue
        }
        try {
          const response = await fetch('/api/entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', [WRITE_KEY_HEADER]: recoveryKey.trim() },
            body: JSON.stringify(localEntry),
          })
          if (response.ok) {
            serverEntries.push(await response.json())
          } else {
            remaining.push(localEntry)
            firstError ||= await refusal(response)
          }
        } catch {
          remaining.push(localEntry)
          firstError ||= 'Could not reach the server. Unrestored entries remain on this browser.'
        }
      }

      try {
        if (remaining.length) localStorage.setItem(LOCAL_ENTRIES_KEY, JSON.stringify(remaining))
        else localStorage.removeItem(LOCAL_ENTRIES_KEY)
        if (!firstError) saveKey(recoveryKey.trim())
      } catch {
        firstError ||= 'Entries were restored, but this browser could not update its saved copy.'
      }
      setPendingEntries(remaining)
      setEntries(mergeEntries(serverEntries, remaining))
      if (firstError) setError(firstError)
      else setRecoveryKey('')
    } finally {
      setIsRecovering(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Timeline</h1>
          <p className="text-gray-600 mt-1">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Photo
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {pendingEntries.length > 0 && (
        <section className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4" aria-label="Restore older offline entries">
          <p className="font-medium text-amber-900">
            {pendingEntries.length} older {pendingEntries.length === 1 ? 'entry is' : 'entries are'} saved on this browser.
          </p>
          <p className="mt-1 text-sm text-amber-800">Enter the admin key to restore them to the database. Restored copies are removed from this browser.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="password"
              autoComplete="current-password"
              aria-label="Admin key for restoring entries"
              value={recoveryKey}
              onChange={event => setRecoveryKey(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-amber-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={recoverLocalEntries}
              disabled={!recoveryKey.trim() || isRecovering}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isRecovering ? 'Restoring...' : 'Restore entries'}
            </button>
          </div>
        </section>
      )}

      {/* Timeline */}
      {entries.length > 0 ? (
        <Timeline entries={entries} onDelete={deleteEntry} />
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Plus size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No entries yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start building your timeline by adding your first photo and moment
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Add Your First Entry
          </button>
        </div>
      )}

      {/* Add Entry Modal */}
      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addEntry}
        isSaving={isLoading}
      />
    </main>
  )
}
