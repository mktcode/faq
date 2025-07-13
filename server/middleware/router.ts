import type { H3Event } from 'h3'

interface HostType {
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

function determineHostType(currentHost: string, appHost: string): HostType {
  const isRootDomain = currentHost === appHost
  const isSubdomain = !isRootDomain && currentHost.endsWith(`.${appHost}`)
  const isCustomDomain = !isRootDomain && !isSubdomain

  return {
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

async function setProfileContext(event: H3Event, targetUser: TargetUser | undefined): Promise<void> {
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

  setProfileContext(event, targetUser)
}

async function handleSubdomain(event: H3Event, currentHost: string): Promise<void> {
  const db = await getDatabaseConnection()
  const username = extractUsernameFromSubdomain(currentHost)

  const targetUser = await db.selectFrom('users')
    .select(['userName', 'published', 'lastPaidAt'])
    .where('userName', '=', username)
    .executeTakeFirst()

  setProfileContext(event, targetUser)
}

export default defineEventHandler(async (event) => {
  const { public: { appHost } } = useRuntimeConfig()
  const currentHost = validateHostHeader(event)
  const { isRootDomain, isSubdomain, isCustomDomain } = determineHostType(currentHost, appHost)

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
