/**
 * Input checks for a new entry. The API is public, so nothing here trusts the
 * browser: sizes are capped and links must be http(s), because a link is
 * rendered as an <a href> and a javascript: URL would run on click.
 */
export const MAX_DESCRIPTION = 2000
export const MAX_LINK = 2000
// Vercel caps a request body at 4.5 MB; base64 adds about a third.
export const MAX_PHOTO_CHARS = 4_000_000

const DATA_IMAGE = /^data:image\/(png|jpe?g|gif|webp|avif);base64,[A-Za-z0-9+/=]+$/

/** The link if it is an http(s) URL, else null. Also used when rendering stored rows. */
export function safeLink(raw: unknown): string | null {
  if (typeof raw !== 'string' || !raw.trim() || raw.length > MAX_LINK) return null
  try {
    const u = new URL(raw.trim())
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : null
  } catch {
    return null
  }
}

function safePhoto(raw: unknown): string | null {
  if (typeof raw !== 'string' || !raw || raw.length > MAX_PHOTO_CHARS) return null
  if (DATA_IMAGE.test(raw)) return raw
  const link = safeLink(raw)
  return link && link.startsWith('https:') ? link : null
}

export type NewEntry = { photo: string; description: string; date: Date; link: string | null }

export function validateNewEntry(body: unknown): { ok: true; entry: NewEntry } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Send a JSON object.' }
  const b = body as Record<string, unknown>
  const photo = safePhoto(b.photo)
  if (!photo) return { ok: false, error: 'Photo must be an image upload (under about 3 MB) or an https image URL.' }
  const description = typeof b.description === 'string' ? b.description.trim() : ''
  if (!description) return { ok: false, error: 'Description is required.' }
  if (description.length > MAX_DESCRIPTION) return { ok: false, error: `Description is over ${MAX_DESCRIPTION} characters.` }
  const date = typeof b.date === 'string' || typeof b.date === 'number' ? new Date(b.date) : null
  if (!date || Number.isNaN(date.getTime())) return { ok: false, error: 'Date is not a valid date.' }
  let link: string | null = null
  if (b.link !== undefined && b.link !== null && b.link !== '') {
    link = safeLink(b.link)
    if (!link) return { ok: false, error: 'Link must start with http:// or https://.' }
  }
  return { ok: true, entry: { photo, description, date, link } }
}
