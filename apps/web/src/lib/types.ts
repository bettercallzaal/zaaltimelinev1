export interface TimelineEntry {
  id: string
  photo: string        // base64 or URL
  description: string  // user description
  date: Date          // when it happened
  link?: string       // optional link to website, repo, etc.
  createdAt: Date     // when uploaded
}
