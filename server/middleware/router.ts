import type { H3Event } from 'h3'

interface HostType {
  currentHost: string
  isRootDomain: boolean
  isSubdomain: boolean
  isCustomDomain: boolean
}

interface TargetUser {
  userName: string
  published: boolean
  lastPaidAt: Date | null
}

function validateHostHeader(event: H3Event): string {
  const host = event.node.req.headers.host

  if (!host) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Host header is missing',
    })
  }

  return host
}

function determineHostType(event: H3Event): HostType {
  const currentHost = validateHostHeader(event)
  const { public: { appHost, appIp } } = useRuntimeConfig()

  const isRootDomain = currentHost === appHost || currentHost === appIp
  const isSubdomain = !isRootDomain && currentHost.endsWith(`.${appHost}`)
  const isCustomDomain = !isRootDomain && !isSubdomain

  return {
    currentHost,
    isRootDomain,
    isSubdomain,
    isCustomDomain,
  }
}

function checkSubscriptionStatus(lastPaidAt: Date | null): boolean {
  if (!lastPaidAt) {
    return false
  }

  const now = new Date()
  const thirtyOneDaysAgo = new Date(now.getTime() - (31 * 24 * 60 * 60 * 1000))
  return lastPaidAt >= thirtyOneDaysAgo
}

async function setProfileContextOrRedirect(event: H3Event, targetUser: TargetUser | undefined): Promise<void> {
  if (!targetUser) {
    const { public: { appHost } } = useRuntimeConfig()
    sendRedirect(event, `https://${appHost}`, 307)
    return
  }

  const { user: loggedInUser } = await getUserSession(event)

  event.context.profile = {
    username: targetUser?.userName || null,
    isSubscribed: targetUser ? checkSubscriptionStatus(targetUser.lastPaidAt) : false,
    isOwned: loggedInUser ? loggedInUser.userName === targetUser?.userName : false,
    isPublic: targetUser ? targetUser.published : false,
    design: 'default',
  }
}

function extractUsernameFromSubdomain(currentHost: string): string {
  return currentHost.split('.')[0]
}

async function handleCustomDomain(event: H3Event, domain: string): Promise<void> {
  const db = await getDatabaseConnection()

  const targetUser = await db.selectFrom('users')
    .select(['userName', 'published', 'lastPaidAt'])
    .where('domain', '=', domain)
    .executeTakeFirst()

  setProfileContextOrRedirect(event, targetUser)
}

async function handleSubdomain(event: H3Event, currentHost: string): Promise<void> {
  const db = await getDatabaseConnection()
  const username = extractUsernameFromSubdomain(currentHost)

  const targetUser = await db.selectFrom('users')
    .select(['userName', 'published', 'lastPaidAt'])
    .where('userName', '=', username)
    .executeTakeFirst()

  setProfileContextOrRedirect(event, targetUser)
}

export default defineEventHandler(async (event) => {
  if (import.meta.dev) {
    // TODO: Remove when fixed in Nuxt
    event.node.req.headers['x-forwarded-proto'] = 'https'
  }

  const { currentHost, isRootDomain, isSubdomain, isCustomDomain } = determineHostType(event)

  if (isRootDomain) {
    return
  }

  if (isCustomDomain) {
    await handleCustomDomain(event, currentHost)
  }
  else if (isSubdomain) {
    await handleSubdomain(event, currentHost)
  }
})
