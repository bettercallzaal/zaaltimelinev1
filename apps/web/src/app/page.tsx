'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Timeline from '@/components/Timeline'
import AddEntryModal from '@/components/AddEntryModal'
import { TimelineEntry } from '@/lib/types'

export default function Home() {
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  const addEntry = async (newEntry: Omit<TimelineEntry, 'id' | 'createdAt'>) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      })

      if (response.ok) {
        const entry = await response.json()
        setEntries(prev => [entry, ...prev].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ))
      } else {
        // Fallback to localStorage
        const entry: TimelineEntry = {
          ...newEntry,
          id: Date.now().toString(),
          createdAt: new Date(),
        }
        setEntries(prev => {
          const updated = [entry, ...prev].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          localStorage.setItem('timeline-entries', JSON.stringify(updated))
          return updated
        })
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding entry:', error)
      // Fallback to localStorage
      const entry: TimelineEntry = {
        ...newEntry,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      setEntries(prev => {
        const updated = [entry, ...prev].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        localStorage.setItem('timeline-entries', JSON.stringify(updated))
        return updated
      })
      setIsModalOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEntries(prev => prev.filter(entry => entry.id !== id))
      } else {
        // Fallback to localStorage
        setEntries(prev => {
          const updated = prev.filter(entry => entry.id !== id)
          localStorage.setItem('timeline-entries', JSON.stringify(updated))
          return updated
        })
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      // Fallback to localStorage
      setEntries(prev => {
        const updated = prev.filter(entry => entry.id !== id)
        localStorage.setItem('timeline-entries', JSON.stringify(updated))
        return updated
      })
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
      />
    </main>
  )
}
