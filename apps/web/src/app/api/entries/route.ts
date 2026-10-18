import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validateNewEntry } from '@/lib/validate'
import { refuseWithoutKey } from '@/lib/write-key'

// GET all entries
export async function GET() {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set')
      return NextResponse.json({ 
        error: 'Database not configured. Please set DATABASE_URL environment variable.'
      }, { status: 500 })
    }

    console.log('DATABASE_URL is set, attempting database connection...')

    // Try to connect to database
    try {
      await prisma.$connect()
      console.log('Database connection successful')
    } catch (connectionError) {
      console.error('Database connection failed:', connectionError)
      return NextResponse.json({ 
        error: 'Database connection failed'
      }, { status: 500 })
    }

    // Try to ensure database schema exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM timeline_entries LIMIT 1`
      console.log('Timeline table exists')
    } catch (tableError) {
      console.log('Timeline table might not exist, attempting to create...')
      try {
        // Try to create the table
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS timeline_entries (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
            photo TEXT NOT NULL,
            description TEXT NOT NULL,
            date TIMESTAMP(3) NOT NULL,
            link TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `
        console.log('Timeline table created successfully')
      } catch (createError) {
        console.error('Failed to create table:', createError)
        return NextResponse.json({ 
          error: 'Database table creation failed'
        }, { status: 500 })
      }
    }

    const entries = await prisma.timelineEntry.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    
    console.log(`Found ${entries.length} entries`)
    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching entries:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch entries. Check database connection.'
    }, { status: 500 })
  }
}

// POST new entry. Needs the admin key (lib/write-key.ts); input is checked
// before the database is touched (lib/validate.ts).
export async function POST(request: NextRequest) {
  const refused = refuseWithoutKey(request)
  if (refused) return refused

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Send a JSON object.' }, { status: 400 })
  }
  const checked = validateNewEntry(body)
  if (!checked.ok) return NextResponse.json({ error: checked.error }, { status: 400 })

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set')
    return NextResponse.json({ error: 'Database not configured.' }, { status: 500 })
  }

  try {
    const entry = await prisma.timelineEntry.create({ data: checked.entry })
    console.log('Entry created:', entry.id)
    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Error creating entry:', error)
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 })
  }
}
