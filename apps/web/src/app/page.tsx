'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Timeline from '@/components/Timeline'
import AddEntryModal from '@/components/AddEntryModal'
import { TimelineEntry } from '@/lib/types'
import { WRITE_KEY_HEADER } from '@/lib/write-key-header'

export default function Home() {
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Load entries from API on mount
  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries')
      
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
      } else {
        // Fallback to localStorage if API fails
        const savedEntries = localStorage.getItem('timeline-entries')
        if (savedEntries) {
          setEntries(JSON.parse(savedEntries))
        }
      }
    } catch (error) {
      console.error('Error fetching entries:', error)
      // Fallback to localStorage
      const savedEntries = localStorage.getItem('timeline-entries')
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries))
      }
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
      return localStorage.getItem('timeline-admin-key') ?? ''
    } catch {
      return ''
    }
  }

  const saveKey = (key: string) => {
    try {
      if (key) localStorage.setItem('timeline-admin-key', key)
      else localStorage.removeItem('timeline-admin-key')
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
