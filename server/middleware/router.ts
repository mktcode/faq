import type { H3Event } from 'h3'
import { checkSubscriptionStatus } from '~/server/utils/user'

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
  domain: string | null
  mailboxes: string[]
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

function redirectToRoot(event: H3Event): Promise<void> {
  const { public: { appHost } } = useRuntimeConfig()
  return sendRedirect(event, `https://${appHost}`, 307)
}

function getCanonicalUrl(event: H3Event, targetUser: TargetUser): string {
  const { public: { appHost } } = useRuntimeConfig()
  return targetUser.domain ? `https://${targetUser.domain}${event.node.req.url}` : `https://${targetUser.userName}.${appHost}${event.node.req.url}`
}

async function setProfileContextOrRedirect(event: H3Event, targetUser: TargetUser): Promise<void> {
  const { user: loggedInUser } = await getUserSession(event)
  const isOwned = loggedInUser ? loggedInUser.userName === targetUser.userName : false
  const isPublic = targetUser.published

  if (!isPublic && !isOwned) {
    await redirectToRoot(event)
    return
  }

  const settings = await getSettings(targetUser.userName)

  event.context.profile = {
    username: targetUser.userName,
    isSubscribed: checkSubscriptionStatus(targetUser.lastPaidAt),
    isOwned,
    isPublic,
    design: 'default',
    settings,
    canonicalUrl: getCanonicalUrl(event, targetUser),
    domain: targetUser.domain,
    domainIsExternal: targetUser.domain ? true : false,
    mailboxes: targetUser.mailboxes,
  }
}

function extractUsernameFromSubdomain(currentHost: string): string {
  return currentHost.split('.')[0]
}

async function handleCustomDomain(event: H3Event, domain: string): Promise<void> {
  const db = await getDatabaseConnection()

  const targetUser = await db.selectFrom('users')
    .select(['userName', 'published', 'lastPaidAt', 'domain', 'mailboxes'])
    .where('domain', '=', domain)
    .executeTakeFirst()

  if (!targetUser) {
    await redirectToRoot(event)
    return
  }

  setProfileContextOrRedirect(event, {
    ...targetUser,
    mailboxes: typeof targetUser.mailboxes === 'string' ? JSON.parse(targetUser.mailboxes) : [],
  })
}

async function handleSubdomain(event: H3Event, currentHost: string): Promise<void> {
  const db = await getDatabaseConnection()
  const username = extractUsernameFromSubdomain(currentHost)

  const targetUser = await db.selectFrom('users')
    .select(['userName', 'published', 'lastPaidAt', 'domain', 'mailboxes'])
    .where('userName', '=', username)
    .executeTakeFirst()

  if (!targetUser) {
    await redirectToRoot(event)
    return
  }

  setProfileContextOrRedirect(event, {
    ...targetUser,
    mailboxes: typeof targetUser.mailboxes === 'string' ? JSON.parse(targetUser.mailboxes) : [],
  })
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
