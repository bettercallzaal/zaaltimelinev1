import { createHash, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { WRITE_KEY_HEADER } from './write-key-header'

/**
 * Adding and deleting entries need the admin key. The site is public, and before
 * this anyone could add or delete an entry with one request.
 *
 * TIMELINE_ADMIN_KEY unset means writes are OFF (503), never open: a fresh
 * deploy is read-only until the owner sets the key. The browser sends the key
 * in the x-timeline-key header.
 */
const digest = (s: string) => createHash('sha256').update(s).digest()

/** null when the request may write; otherwise the response to send. */
export function refuseWithoutKey(request: NextRequest): NextResponse | null {
  const expected = process.env.TIMELINE_ADMIN_KEY
  if (!expected) {
    return NextResponse.json(
      { error: 'Adding and deleting are turned off on this site.' },
      { status: 503 },
    )
  }
  const given = request.headers.get(WRITE_KEY_HEADER) ?? ''
  if (!given || !timingSafeEqual(digest(given), digest(expected))) {
    return NextResponse.json({ error: 'Wrong or missing admin key.' }, { status: 401 })
  }
  return null
}
