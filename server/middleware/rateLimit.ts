import { createHash } from 'node:crypto'

const WINDOW_MS = 60_000
const MAX_REQUESTS = 1000
const CLEANUP_INTERVAL = 60_000

// TODO: Use redis
// TODO: Incorporate user-based rate limiting (per website)
const rateLimitMap = new Map<string, { count: number, lastReset: number }>()

setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.lastReset > WINDOW_MS * 2) {
      rateLimitMap.delete(ip)
    }
  }
}, CLEANUP_INTERVAL)

export default defineEventHandler(async (event) => {
  const ip = getRequestHeader(event, 'x-forwarded-for') || event.node.req.socket.remoteAddress || 'unknown'
  const userAgent = getRequestHeader(event, 'user-agent') || 'unknown'
  const idHash = createHash('sha256').update(`${ip}-${userAgent}`).digest('hex')
  const now = Date.now()

  const entry = rateLimitMap.get(idHash)

  if (!entry || now - entry.lastReset > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now })
  }
  else {
    if (entry.count >= MAX_REQUESTS) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Zu viele Anfragen',
        message: 'Sie haben das Anfrage-Limit überschritten. Bitte warten Sie einen Moment.',
      })
    }
    entry.count++
  }
})
