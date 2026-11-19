'use client'

import { useState } from 'react'
import { Trash2, Calendar, ExternalLink } from 'lucide-react'
import { TimelineEntry } from '@/lib/types'
import { safeLink } from '@/lib/validate'
import { formatCalendarDate } from '@/lib/calendar-date'

interface TimelineEntryCardProps {
  entry: TimelineEntry
  onDelete: () => void
  /** Saved only in this browser: deleting removes it here, not from the database. */
  isLocalOnly?: boolean
}

export default function TimelineEntryCard({ entry, onDelete, isLocalOnly = false }: TimelineEntryCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Rows saved before input checks existed may hold any string; only http(s) renders.
  const link = safeLink(entry.link)

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete()
    } else {
      setShowDeleteConfirm(true)
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Photo */}
      <div className="relative">
        <img
          src={entry.photo}
          alt={entry.description}
          className="w-full h-64 object-cover"
        />
        
        {/* Delete button */}
        <button
          onClick={handleDelete}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            showDeleteConfirm 
              ? 'bg-red-500 text-white' 
              : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
          }`}
          title={showDeleteConfirm
            ? 'Click again to confirm delete'
            : isLocalOnly ? 'Remove from this browser' : 'Delete entry'}
        >
          <Trash2 size={16} />
        </button>

        {isLocalOnly && (
          <span className="absolute top-3 left-3 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">
            Only on this browser
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-800 mb-3 leading-relaxed">
          {entry.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={14} className="mr-1" />
            {formatCalendarDate(entry.date, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full text-sm font-medium transition-colors"
              title="Open link in new tab"
            >
              <ExternalLink size={12} />
              Visit
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
