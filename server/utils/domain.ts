import dns from 'dns/promises'
import { toASCII } from 'punycode'
import { setTimeout as sleep } from 'node:timers/promises'

async function checkA(domain: string) {
  const { public: { lbIp } } = useRuntimeConfig()

  try {
    const addresses = await dns.resolve4(domain)
    return addresses.includes(lbIp)
  }
  catch (err) {
    return false
  }
}

async function checkMx(domain: string) {
  try {
    const mxRecords = await dns.resolveMx(domain)
    const mailhost = `mxext.mailbox.org`

    const mxRecord = mxRecords.find(record => record.exchange === mailhost)
    if (mxRecord) {
      return true
    }
    else {
      return false
    }
  }
  catch (err) {
    return false
  }
}


type AvailabilityReason
  = | 'available'
    | 'registered'
    | 'reserved'
    | 'blocked'
    | 'invalid'
    | 'tld-unsupported'
    | 'rate-limited'
    | 'network-error'
    | 'unknown'

interface DomainAvailability {
  available: boolean
  reason: AvailabilityReason
  rdapServer?: string
  httpStatus?: number
  rdapStatuses?: string[]
  checkedAt: string
}

interface CheckOptions {
  timeoutMs?: number
  retries?: number
  bootstrapUrl?: string
  userAgent?: string
  useRdapOrgFallback?: boolean
  /** Prüfreihenfolge überschreiben (nur für Advanced) */
  overrideServers?: string[]
}

const DEFAULTS: Required<Omit<CheckOptions, 'overrideServers'>> = {
  timeoutMs: 5500,
  retries: 3,
  bootstrapUrl: 'https://data.iana.org/rdap/dns.json',
  userAgent: 'domain-check/1.0 (+https://example.com)',
  useRdapOrgFallback: true,
}

type BootstrapCache = { fetchedAt: number, tldMap: Record<string, string[]> }
let BOOTSTRAP_CACHE: BootstrapCache | null = null
const BOOTSTRAP_TTL_MS = 24 * 60 * 60 * 1000 // 24h
// rdap.org fallback is known to be non-authoritative/unreliable for these TLDs.
// For these, don't trust a 404 from rdap.org as "available".
const UNRELIABLE_FALLBACK_TLDS = new Set<string>(['de'])
// Known authoritative RDAP endpoints for TLDs that may be missing in IANA bootstrap
// or where the generic fallback is unreliable.
const AUTHORITATIVE_OVERRIDES: Record<string, string[]> = {
  de: ['https://rdap.denic.de/'],
}

/* ====================== PUBLIC API ====================== */

/**
 * Single, robust domain availability check.
 * - Normalizes and validates domain
 * - Resolves RDAP servers (IANA bootstrap, optional rdap.org fallback)
 * - Queries up to two servers (first two unique entries) with retries+timeout
 * - 404 => available; 2xx => parse RDAP status; 429 => rate-limited; 5xx/Abort => network/unknown
 */
async function checkAvailability(
  inputDomain: string,
  opts: CheckOptions = {},
): Promise<DomainAvailability> {
  const o = { ...DEFAULTS, ...opts }

  const ascii = normaliseDomain(inputDomain)
  if (!ascii || !isValidAsciiDomain(ascii)) {
    return result(false, 'invalid')
  }

  const tld = ascii.split('.').pop()!
  let servers = opts.overrideServers && opts.overrideServers.length
    ? opts.overrideServers
    : await getRdapServersForTld(tld, o).catch(() => [])

  // ensure fallback, dedupe, and cap to at most two servers
  // If IANA bootstrap returned nothing, try built-in authoritative overrides
  if (servers.length === 0 && AUTHORITATIVE_OVERRIDES[tld]) {
    servers = AUTHORITATIVE_OVERRIDES[tld]
  }
  // Track whether we have authoritative RDAP servers (from IANA/bootstrap or explicit override/built-in overrides)
  const hasAuthoritativeServers = servers.length > 0
  if (servers.length === 0 && o.useRdapOrgFallback) servers = ['https://rdap.org/']
  if (servers.length === 0) return result(false, 'tld-unsupported')
  servers = Array.from(new Set(servers)).slice(0, 2)

  let sawRateLimited = false
  let sawAbort = false
  let sawFallback404 = false

  for (const base of servers) {
    const url = new URL(`domain/${ascii}`, ensureSlash(base)).toString()
    try {
      const res = await fetchWithRetries(url, o)

      // Only trust 404 => available when querying an authoritative RDAP server.
      // When we only have the rdap.org fallback (non-authoritative for some TLDs like .de),
      // a 404 can simply mean "no RDAP data", not actual availability.
      if (res.status === 404) {
        if (hasAuthoritativeServers) return result(true, 'available', base, 404)
        // Fallback-only case
        if (UNRELIABLE_FALLBACK_TLDS.has(tld)) {
          // Don't trust 404 for unreliable TLDs
          sawFallback404 = true
          continue
        }
        // For other TLDs, accept rdap.org 404 as available to keep UX simple
        return result(true, 'available', base, 404)
      }

      if (res.status === 429) {
        sawRateLimited = true
        continue
      }
      if (res.status >= 500) {
        // try next server if available
        continue
      }

      if (res.ok) {
        const data = await safeJson(res)
        let statuses: string[] = []
        if (data && typeof data === 'object') {
          const s = (data as Record<string, unknown>).status
          statuses = normalizeStatuses(s)
        }
        if (statuses.some(s => s.includes('reserved'))) return result(false, 'reserved', base, res.status, statuses)
        if (statuses.some(s => s.includes('blocked'))) return result(false, 'blocked', base, res.status, statuses)
        return result(false, 'registered', base, res.status, statuses)
      }

      // unexpected but not decisive; try next
      continue
    }
    catch (e: unknown) {
      const name = getErrorName(e)
      if (name === 'AbortError') sawAbort = true
      // try next server
      continue
    }
  }

  if (sawRateLimited) return result(false, 'rate-limited')
  if (sawAbort) return result(false, 'network-error')
  if (sawFallback404) return result(false, 'unknown')
  return result(false, 'unknown')
}

async function requireAvailability(domain: string): Promise<void> {
  const availability = await checkAvailability(domain)
  if (!availability.available) {
    throw createError({ statusCode: 409, statusMessage: 'Domain not available' })
  }
}

/* ====================== helpers ====================== */

function normaliseDomain(d: string): string {
  const trimmed = d.trim().toLowerCase().replace(/\.$/, '')
  try {
    return toASCII(trimmed)
  }
  catch {
    return ''
  }
}

function isValidAsciiDomain(d: string): boolean {
  if (!/^[a-z0-9.-]+$/.test(d)) return false
  if (d.length < 1 || d.length > 253) return false
  if (d.includes('..') || d.startsWith('.') || d.endsWith('.')) return false
  const labels = d.split('.')
  for (const label of labels) {
    if (label.length < 1 || label.length > 63) return false
    if (label.startsWith('-') || label.endsWith('-')) return false
  }
  return true
}

function ensureSlash(u: string): string {
  return u.endsWith('/') ? u : u + '/'
}

async function getRdapServersForTld(
  tld: string,
  o: Readonly<Pick<Required<CheckOptions>, 'bootstrapUrl' | 'timeoutMs' | 'userAgent'>>,
): Promise<string[]> {
  const now = Date.now()
  if (!BOOTSTRAP_CACHE || now - BOOTSTRAP_CACHE.fetchedAt > BOOTSTRAP_TTL_MS) {
    const res = await fetchWithTimeout(o.bootstrapUrl, o.timeoutMs, o.userAgent)
    if (!res.ok) throw new Error(`bootstrap fetch failed: ${res.status}`)
    const data: unknown = await res.json()
    const map: Record<string, string[]> = {}
    const root = (data && typeof data === 'object') ? data as Record<string, unknown> : {}
    const services = root.services
    if (Array.isArray(services)) {
      for (const entry of services) {
        if (!Array.isArray(entry) || entry.length < 2) continue
        const tldsRaw = entry[0]
        const serversRaw = entry[1]
        const tlds = Array.isArray(tldsRaw) ? tldsRaw.filter((x): x is string => typeof x === 'string') : []
        const servers = Array.isArray(serversRaw) ? serversRaw.filter((x): x is string => typeof x === 'string') : []
        for (const t of tlds) map[t.toLowerCase()] = servers
      }
    }
    BOOTSTRAP_CACHE = { fetchedAt: now, tldMap: map }
  }
  return BOOTSTRAP_CACHE.tldMap[tld.toLowerCase()] ?? []
}

async function fetchWithRetries(
  url: string,
  o: Readonly<Pick<Required<CheckOptions>, 'timeoutMs' | 'retries' | 'userAgent'>>,
): Promise<Response> {
  let attempt = 0
  let lastErr: unknown = null
  while (attempt <= o.retries) {
    try {
      const res = await fetchWithTimeout(url, o.timeoutMs, o.userAgent)
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(String(res.status))
      }
      else {
        return res
      }
    }
    catch (e: unknown) {
      lastErr = e
      // AbortError → Timer gelaufen, retry
    }
    attempt++
    if (attempt <= o.retries) {
      const backoff = Math.min(1000 * 2 ** attempt, 6000) + Math.floor(Math.random() * 250)
      await sleep(backoff)
    }
  }
  if (lastErr instanceof Error) throw lastErr
  throw new Error(lastErr ? String(lastErr) : 'fetch failed')
}

async function fetchWithTimeout(url: string, timeoutMs: number, userAgent: string): Promise<Response> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    return await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/rdap+json, application/json;q=0.9, */*;q=0.1',
        'User-Agent': userAgent,
      },
      redirect: 'follow',
      signal: ctrl.signal,
    })
  }
  finally {
    clearTimeout(timer)
  }
}

async function safeJson(res: Response): Promise<unknown | undefined> {
  try {
    return await res.json()
  }
  catch {
    return undefined
  }
}

function normalizeStatuses(raw: unknown): string[] {
  const arr: unknown[] = Array.isArray(raw) ? raw : []
  return arr.map(v => String(v).toLowerCase())
}

function result(
  available: boolean,
  reason: AvailabilityReason,
  rdapServer?: string,
  httpStatus?: number,
  rdapStatuses?: string[],
): DomainAvailability {
  return {
    available,
    reason,
    rdapServer,
    httpStatus,
    rdapStatuses,
    checkedAt: new Date().toISOString(),
  }
}

/* ===== additional type guards ===== */

function getErrorName(e: unknown): string | undefined {
  if (e && typeof e === 'object' && 'name' in e) {
    const val = (e as Record<string, unknown>).name
    if (typeof val === 'string') return val
  }
  return undefined
}

export const domainUtils = {
  checkA,
  checkMx,
  checkAvailability,
  requireAvailability,
}