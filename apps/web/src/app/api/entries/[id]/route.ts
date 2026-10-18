import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { refuseWithoutKey } from '@/lib/write-key'

// DELETE entry by ID. Needs the admin key (lib/write-key.ts).
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const refused = refuseWithoutKey(request)
  if (refused) return refused

  try {
    const { id } = params

    await prisma.timelineEntry.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Entry deleted successfully' })
  } catch (error) {
    console.error('Error deleting entry:', error)
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}
