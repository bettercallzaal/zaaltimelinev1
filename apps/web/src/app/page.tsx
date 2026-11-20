'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Timeline from '@/components/Timeline'
import AddEntryModal from '@/components/AddEntryModal'
import { TimelineEntry } from '@/lib/types'
import { WRITE_KEY_HEADER } from '@/lib/write-key-header'
import { formatCalendarDate } from '@/lib/calendar-date'
import {
  LOCAL_ENTRIES_KEY,
  byCalendarDayDesc,
  mergeEntries,
  pendingLocalEntries,
  readLocalEntries,
  restoreProblem,
} from '@/lib/local-entries'

const ADMIN_KEY_STORAGE = 'timeline-admin-key'

export default function Home() {
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [pendingEntries, setPendingEntries] = useState<TimelineEntry[]>([])
  const [recoveryKey, setRecoveryKey] = useState('')
  const [isRecovering, setIsRecovering] = useState(false)
  const [confirmDiscardId, setConfirmDiscardId] = useState('')

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
    // Until the server answers, every browser-only entry is a candidate.
    setPendingEntries(pendingLocalEntries([], savedEntries))
    try {
      const response = await fetch('/api/entries')
      
      if (response.ok) {
        const data = await response.json()
        // Older builds saved the whole list here, server rows included; only
        // browser-only rows the database lacks still need restoring.
        setPendingEntries(pendingLocalEntries(data, savedEntries))
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
      setEntries(prev => [entry, ...prev].sort(byCalendarDayDesc))
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error adding entry:', err)
      setError('Could not reach the server. Nothing was saved.')
    } finally {
      setIsLoading(false)
    }
  }

  // Remove one browser-only entry from this browser's saved copy. Other saved
  // rows are left exactly as they are.
  const removeLocalEntry = (id: string) => {
    setError('')
    try {
      const saved = readLocalEntries(localStorage.getItem(LOCAL_ENTRIES_KEY))
      const kept = saved.filter(entry => entry.id !== id)
      if (kept.length) localStorage.setItem(LOCAL_ENTRIES_KEY, JSON.stringify(kept))
      else localStorage.removeItem(LOCAL_ENTRIES_KEY)
    } catch {
      setError('This browser could not update its saved copy. Nothing was removed.')
      return
    }
    setPendingEntries(prev => prev.filter(entry => entry.id !== id))
    setEntries(prev => prev.filter(entry => entry.id !== id))
    setConfirmDiscardId('')
  }

  const deleteEntry = async (id: string) => {
    // Browser-only entries were never in the database; the API cannot delete them.
    if (pendingEntries.some(entry => entry.id === id)) {
      removeLocalEntry(id)
      return
    }
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
      const remaining: TimelineEntry[] = []
      let firstError = ''

      // Re-check against the current list: another tab or browser may have
      // restored some of these already.
      for (const localEntry of pendingLocalEntries(serverEntries, pendingEntries)) {
        // The server would refuse it; keep it here for the person to discard.
        if (restoreProblem(localEntry)) {
          remaining.push(localEntry)
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

  const unrestorable = pendingEntries
    .map(entry => ({ entry, problem: restoreProblem(entry) }))
    .filter((item): item is { entry: TimelineEntry; problem: string } => item.problem !== null)
  const restorable = pendingEntries.filter(entry => !restoreProblem(entry))
  const localIds = new Set(pendingEntries.map(entry => entry.id))

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
          {restorable.length > 0 && (
            <>
              <p className="font-medium text-amber-900">
                {restorable.length} older {restorable.length === 1 ? 'entry is' : 'entries are'} saved only on this browser.
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
            </>
          )}

          {unrestorable.length > 0 && (
            <div className={restorable.length > 0 ? 'mt-4 border-t border-amber-200 pt-4' : ''}>
              <p className="font-medium text-amber-900">
                {unrestorable.length} saved {unrestorable.length === 1 ? 'entry' : 'entries'} cannot be restored.
              </p>
              <p className="mt-1 text-sm text-amber-800">The server would refuse {unrestorable.length === 1 ? 'it' : 'them'}. Discarding removes the entry from this browser only.</p>
              <ul className="mt-3 space-y-2">
                {unrestorable.map(({ entry, problem }) => (
                  <li key={entry.id} className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-white p-3 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {entry.description.trim() || '(no description)'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCalendarDate(entry.date, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="mt-1 text-sm text-red-700">{problem}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => confirmDiscardId === entry.id ? removeLocalEntry(entry.id) : setConfirmDiscardId(entry.id)}
                      className={`rounded-lg px-3 py-1.5 text-sm ${
                        confirmDiscardId === entry.id
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'border border-red-300 text-red-700 hover:bg-red-50'
                      }`}
                    >
                      {confirmDiscardId === entry.id ? 'Click again to discard' : 'Discard'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Timeline */}
      {entries.length > 0 ? (
        <Timeline entries={entries} onDelete={deleteEntry} localIds={localIds} />
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
