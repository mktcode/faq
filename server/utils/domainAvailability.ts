import { toASCII } from 'punycode/'
import { setTimeout as sleep } from 'node:timers/promises'
import * as dns from 'node:dns/promises'

export type AvailabilityReason
  = | 'available'
    | 'registered'
    | 'reserved'
    | 'blocked'
    | 'invalid'
    | 'tld-unsupported'
    | 'rate-limited'
    | 'network-error'
    | 'unknown'

export interface DomainAvailability {
  available: boolean
  reason: AvailabilityReason
  rdapServer?: string
  httpStatus?: number
  rdapStatuses?: string[]
  checkedAt: string
}

export interface CheckOptions {
  timeoutMs?: number
  retries?: number
  bootstrapUrl?: string
  userAgent?: string
  useRdapOrgFallback?: boolean
  /** Prüfreihenfolge überschreiben (nur für Advanced/Verify) */
  overrideServers?: string[]
}

export interface VerifyOptions extends CheckOptions {
  /** Anzahl einzelner Probes (Default 3) */
  probes?: number
  /** Mind. Bestätigungen „available“ (Default 2) */
  minConfirmations?: number
  /** Basisintervall zwischen Probes (Default 1200ms) */
  intervalMs?: number
  /** Cross-Server rotieren (Default true) */
  crossServer?: boolean
  /** Zusätzlich NS-Delegation prüfen (Default true) */
  dnsNsCheck?: boolean
  /** Harte Obergrenze für die gesamte Verifikation (Default 12s) */
  hardTimeoutMs?: number
}

export interface VerifyResult extends DomainAvailability {
  confirmations: number
  probes: Array<Pick<DomainAvailability, 'available' | 'reason' | 'rdapServer' | 'httpStatus'>>
  dns?: { delegated: boolean, ns?: string[], error?: string }
}

const DEFAULTS: Required<Omit<CheckOptions, 'overrideServers'>> = {
  timeoutMs: 5500,
  retries: 3,
  bootstrapUrl: 'https://data.iana.org/rdap/dns.json',
  userAgent: 'domain-check/1.0 (+https://example.com)',
  useRdapOrgFallback: true,
}

const VERIFY_DEFAULTS: Required<
  Omit<VerifyOptions, keyof CheckOptions | 'overrideServers'>
> = {
  probes: 3,
  minConfirmations: 2,
  intervalMs: 1200,
  crossServer: true,
  dnsNsCheck: true,
  hardTimeoutMs: 12_000,
}

type BootstrapCache = { fetchedAt: number, tldMap: Record<string, string[]> }
let BOOTSTRAP_CACHE: BootstrapCache | null = null
const BOOTSTRAP_TTL_MS = 24 * 60 * 60 * 1000 // 24h

/* ====================== PUBLIC API ====================== */

export async function checkDomainAvailability(
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

  if (servers.length === 0 && o.useRdapOrgFallback) servers = ['https://rdap.org/']
  if (servers.length === 0) return result(false, 'tld-unsupported')

  let lastErr: unknown = null
  for (const base of servers) {
    const url = new URL(`domain/${ascii}`, ensureSlash(base)).toString()
    try {
      const res = await fetchWithRetries(url, o)
      if (res.status === 404) return result(true, 'available', base, 404)

      if (res.status === 429) {
        const err: Error & { status?: number } = new Error('rate-limited')
        err.status = 429
        lastErr = err
        continue
      }
      if (res.status >= 500) {
        lastErr = new Error(`server error ${res.status}`)
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

      const err: Error & { status?: number } = new Error(`unexpected ${res.status}`)
      err.status = res.status
      lastErr = err
    }
    catch (e: unknown) {
      lastErr = e
      continue
    }
  }

  const lastStatus = getErrorStatus(lastErr)
  if (lastStatus === 429) return result(false, 'rate-limited')
  const lastName = getErrorName(lastErr)
  if (lastName === 'AbortError') return result(false, 'network-error')
  return result(false, 'unknown')
}

/**
 * Mehrstufige Verifikation:
 * - Mehrere RDAP-Probes (optional rotierend über verschiedene Server)
 * - Jitter/Backoff
 * - Optionaler DNS-NS-Check (Delegation ⇒ definitiv registriert)
 */
export async function verifyDomainAvailable(
  inputDomain: string,
  opts: VerifyOptions = {},
): Promise<VerifyResult> {
  const baseOpts = { ...DEFAULTS, ...opts }
  const v = { ...VERIFY_DEFAULTS, ...opts }

  const start = Date.now()
  const ascii = normaliseDomain(inputDomain)
  if (!ascii || !isValidAsciiDomain(ascii)) {
    return { ...result(false, 'invalid'), confirmations: 0, probes: [] }
  }

  // Ermittele bevorzugte Server-Reihenfolge einmalig
  const tld = ascii.split('.').pop()!
  let servers = opts.overrideServers && opts.overrideServers.length
    ? opts.overrideServers
    : await getRdapServersForTld(tld, baseOpts).catch(() => [])

  if (servers.length === 0 && baseOpts.useRdapOrgFallback) servers = ['https://rdap.org/']
  if (servers.length === 0) {
    return { ...result(false, 'tld-unsupported'), confirmations: 0, probes: [] }
  }

  const probes: VerifyResult['probes'] = []
  let confirmations = 0
  let decisive: DomainAvailability | null = null

  for (let i = 0; i < v.probes; i++) {
    if (Date.now() - start > v.hardTimeoutMs) break

    const server = v.crossServer ? servers[i % servers.length] : servers[0]
    const res = await checkDomainAvailability(ascii, { ...baseOpts, overrideServers: [server] })

    probes.push({ available: res.available, reason: res.reason, rdapServer: res.rdapServer, httpStatus: res.httpStatus })

    // Harte Gegenbeweise sofort abbrechen
    if (!res.available && (res.reason === 'registered' || res.reason === 'reserved' || res.reason === 'blocked')) {
      decisive = res
      break
    }

    if (res.available) confirmations++

    if (confirmations >= (v.minConfirmations ?? 2)) {
      // Optionaler DNS-NS-Check als „Sanity Check“
      if (v.dnsNsCheck) {
        const dnsRes = await checkNsDelegation(ascii, baseOpts.timeoutMs).catch(e => ({ delegated: false, error: String(e) }))
        if (dnsRes.delegated) {
          // Delegiert ⇒ doch registriert
          return {
            ...result(false, 'registered', res.rdapServer, res.httpStatus),
            confirmations,
            probes,
            dns: dnsRes,
          }
        }
        return {
          ...result(true, 'available', res.rdapServer, res.httpStatus),
          confirmations,
          probes,
          dns: dnsRes,
        }
      }
      return { ...result(true, 'available', res.rdapServer, res.httpStatus), confirmations, probes }
    }

    // Jitter/Backoff vor nächstem Probe
    const wait = v.intervalMs + Math.floor(Math.random() * 300) + i * 250
    await sleep(wait)
  }

  if (decisive) {
    return { ...decisive, confirmations, probes }
  }

  // Falls wir keine ausreichenden Bestätigungen haben → unknown/weak signal
  return { ...result(false, confirmations > 0 ? 'unknown' : 'network-error'), confirmations, probes }
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

async function fetchWithRetries(url: string, o: Required<CheckOptions>): Promise<Response> {
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

/** Einfache NS-Delegationsprüfung: wenn NS-Records vorhanden, ist die Domain definitiv registriert+delegiert */
async function checkNsDelegation(domainAscii: string, timeoutMs: number): Promise<{ delegated: boolean, ns?: string[], error?: string }> {
  const t = AbortController ? new AbortController() : null
  const timer = setTimeout(() => t?.abort(), Math.max(1000, Math.floor(timeoutMs * 0.6)))
  try {
    const ns = await dns.resolveNs(domainAscii) // nutzt System-Resolver
    return { delegated: Array.isArray(ns) && ns.length > 0, ns }
  }
  catch (e: unknown) {
    // NXDOMAIN, ENODATA etc. ⇒ nicht delegiert (aber kein Beweis für „frei“)
    const code = getErrorCode(e)
    if (code === 'ENODATA' || code === 'ENOTFOUND' || code === 'SERVFAIL' || code === 'REFUSED' || code === 'ETIMEOUT') {
      return { delegated: false, error: code }
    }
    return { delegated: false, error: String(e) }
  }
  finally {
    clearTimeout(timer)
  }
}

/* ===== additional type guards ===== */

function getErrorStatus(e: unknown): number | undefined {
  if (e && typeof e === 'object' && 'status' in e) {
    const val = (e as Record<string, unknown>).status
    if (typeof val === 'number') return val
  }
  return undefined
}

function getErrorName(e: unknown): string | undefined {
  if (e && typeof e === 'object' && 'name' in e) {
    const val = (e as Record<string, unknown>).name
    if (typeof val === 'string') return val
  }
  return undefined
}

function getErrorCode(e: unknown): string | undefined {
  if (e && typeof e === 'object' && 'code' in e) {
    const val = (e as Record<string, unknown>).code
    if (typeof val === 'string') return val
  }
  return undefined
}
