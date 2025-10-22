import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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

    // Try to ensure database schema exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM timeline_entries LIMIT 1`
    } catch (tableError) {
      // Table might not exist yet, return empty array
      return NextResponse.json([])
    }

    const entries = await prisma.timelineEntry.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching entries:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch entries. Check database connection.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST new entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { photo, description, date, link } = body

    if (!photo || !description || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const entry = await prisma.timelineEntry.create({
      data: {
        photo,
        description,
        date: new Date(date),
        link: link || null
      }
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Error creating entry:', error)
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 })
  }
}
