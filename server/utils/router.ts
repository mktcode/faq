import type { H3Event } from 'h3'
import Stripe from 'stripe'

interface TargetUser {
  userName: string
  published: boolean
  lastPaidAt: Date | null
  domain: string | null
  mailboxes: string[]
  plan: 'S' | 'L' | null
  stripeCheckoutSessionId: string | null
}

function getCurrentHost(event: H3Event): string {
  const host = event.node.req.headers.host

  if (!host) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Host header is missing',
    })
  }

  return host
}

function isRootDomain(currentHost: string): boolean {
  const { public: { appHost, lbIp } } = useRuntimeConfig()
  return currentHost === appHost || currentHost === lbIp
}

function isSubdomain(currentHost: string): boolean {
  const { public: { appHost } } = useRuntimeConfig()
  return !isRootDomain(currentHost) && currentHost.endsWith(`.${appHost}`)
}

function isCustomDomain(currentHost: string): boolean {
  return !isRootDomain(currentHost) && !isSubdomain(currentHost)
}

function extractUsernameFromSubdomain(currentHost: string) {
  return currentHost.split('.')[0] || null
}

function redirectToRoot(event: H3Event): Promise<void> {
  const { public: { appHost } } = useRuntimeConfig()
  return sendRedirect(event, `https://${appHost}`, 307)
}

function getCanonicalUri(targetUser: TargetUser): string {
  const { public: { appHost } } = useRuntimeConfig()
  return targetUser.domain ? `https://${targetUser.domain}` : `https://${targetUser.userName}.${appHost}`
}

function getCanonicalUrl(event: H3Event, targetUser: TargetUser): string {
  const canonicalUri = getCanonicalUri(targetUser)
  return `${canonicalUri}${event.node.req.url}`
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
  let checkoutSession: Stripe.Checkout.Session | null = null
  if (targetUser.stripeCheckoutSessionId) {
    try {
      checkoutSession = await stripe.getCheckoutSession(targetUser.stripeCheckoutSessionId)
    } catch (error) {
      console.error('Failed to retrieve Stripe checkout session:', error)
    }
  }

  event.context.profile = {
    username: targetUser.userName,
    subscription: {
      checkoutSession,
      plan: targetUser.plan,
      paid: checkLastPayment(targetUser.lastPaidAt),
    },
    isOwned,
    isPublic,
    design: 'default',
    settings,
    canonicalUrl: getCanonicalUrl(event, targetUser),
    canonicalUri: getCanonicalUri(targetUser),
    domain: targetUser.domain,
    domainIsExternal: targetUser.domain ? true : false,
    mailboxes: targetUser.mailboxes,
  }
}

async function getUserFromHost(currentHost: string): Promise<TargetUser | null> {
  if (isRootDomain(currentHost)) return null

  const db = await getDatabaseConnection()

  if (isCustomDomain(currentHost)) {
    const user = await db.selectFrom('users')
      .select(['userName', 'published', 'lastPaidAt', 'domain', 'mailboxes', 'plan', 'stripeCheckoutSessionId'])
      .where('domain', '=', currentHost)
      .executeTakeFirst() || null

    if (!user) return null

    return {
      ...user,
      mailboxes: typeof user.mailboxes === 'string' ? JSON.parse(user.mailboxes) : [],
    }
  }
  else if (isSubdomain(currentHost)) {
    const username = extractUsernameFromSubdomain(currentHost)
    if (!username) return null

    const user = await db
      .selectFrom('users')
      .select(['userName', 'published', 'lastPaidAt', 'domain', 'mailboxes', 'plan', 'stripeCheckoutSessionId'])
      .where('userName', '=', username)
      .executeTakeFirst() || null

    if (!user) return null

    return {
      ...user,
      mailboxes: typeof user.mailboxes === 'string' ? JSON.parse(user.mailboxes) : [],
    }
  }

  return null
}

export const router = {
  getUserFromHost,
  setProfileContextOrRedirect,
  redirectToRoot,
  isRootDomain,
  getCurrentHost,
}
