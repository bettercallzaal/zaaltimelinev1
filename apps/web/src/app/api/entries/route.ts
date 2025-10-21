import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all entries
export async function GET() {
  try {
    const entries = await prisma.timelineEntry.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching entries:', error)
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
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
