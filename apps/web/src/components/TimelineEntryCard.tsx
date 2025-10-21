'use client'

import { useState } from 'react'
import { Trash2, Calendar, ExternalLink } from 'lucide-react'
import { TimelineEntry } from '@/lib/types'

interface TimelineEntryCardProps {
  entry: TimelineEntry
  onDelete: () => void
}

export default function TimelineEntryCard({ entry, onDelete }: TimelineEntryCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

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
          title={showDeleteConfirm ? 'Click again to confirm delete' : 'Delete entry'}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-800 mb-3 leading-relaxed">
          {entry.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={14} className="mr-1" />
            {formatDate(entry.date)}
          </div>
          
          {entry.link && (
            <a
              href={entry.link}
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
