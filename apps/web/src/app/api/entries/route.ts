import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all entries
export async function GET() {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set')
      return NextResponse.json({ 
        error: 'Database not configured. Please set DATABASE_URL environment variable.',
        debug: 'DATABASE_URL is missing'
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
        error: 'Database connection failed',
        debug: connectionError instanceof Error ? connectionError.message : 'Unknown connection error'
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
          error: 'Database table creation failed',
          debug: createError instanceof Error ? createError.message : 'Unknown table creation error'
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
      error: 'Failed to fetch entries. Check database connection.',
      debug: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST new entry
export async function POST(request: NextRequest) {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set')
      return NextResponse.json({ 
        error: 'Database not configured. Please set DATABASE_URL environment variable.',
        debug: 'DATABASE_URL is missing'
      }, { status: 500 })
    }

    const body = await request.json()
    const { photo, description, date, link } = body

    console.log('Creating new entry:', { description, date, hasPhoto: !!photo, hasLink: !!link })

    if (!photo || !description || !date) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        debug: { hasPhoto: !!photo, hasDescription: !!description, hasDate: !!date }
      }, { status: 400 })
    }

    // Try to connect to database
    try {
      await prisma.$connect()
      console.log('Database connection successful for POST')
    } catch (connectionError) {
      console.error('Database connection failed:', connectionError)
      return NextResponse.json({ 
        error: 'Database connection failed',
        debug: connectionError instanceof Error ? connectionError.message : 'Unknown connection error'
      }, { status: 500 })
    }

    const entry = await prisma.timelineEntry.create({
      data: {
        photo,
        description,
        date: new Date(date),
        link: link || null
      }
    })

    console.log('Entry created successfully:', entry.id)
    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Error creating entry:', error)
    return NextResponse.json({ 
      error: 'Failed to create entry',
      debug: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
