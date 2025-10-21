'use client'

import { TimelineEntry } from '@/lib/types'
import TimelineEntryCard from '@/components/TimelineEntryCard'

interface TimelineProps {
  entries: TimelineEntry[]
  onDelete: (id: string) => void
}

export default function Timeline({ entries, onDelete }: TimelineProps) {
  // Group entries by month/year for better organization
  const groupedEntries = entries.reduce((groups, entry) => {
    const date = new Date(entry.date)
    const monthYear = date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
    
    if (!groups[monthYear]) {
      groups[monthYear] = []
    }
    groups[monthYear].push(entry)
    return groups
  }, {} as Record<string, TimelineEntry[]>)

  return (
    <div className="relative">
      {/* Timeline spine */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
      
      {Object.entries(groupedEntries).map(([monthYear, monthEntries]) => (
        <div key={monthYear} className="mb-8">
          {/* Month/Year header */}
          <div className="flex items-center mb-6">
            <div className="relative z-10 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {monthYear}
            </div>
          </div>
          
          {/* Entries for this month */}
          <div className="space-y-6">
            {monthEntries.map((entry, index) => (
              <div key={entry.id} className="relative">
                {/* Timeline node */}
                <div className="absolute left-6 w-4 h-4 bg-white border-4 border-blue-500 rounded-full z-10"></div>
                
                {/* Entry card */}
                <div className="ml-16">
                  <TimelineEntryCard 
                    entry={entry} 
                    onDelete={() => onDelete(entry.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
