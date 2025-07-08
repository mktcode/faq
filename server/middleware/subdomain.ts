import type { H3Event } from 'h3'

interface HostType {
  isRootDomain: boolean
  isSubdomain: boolean
  isCustomDomain: boolean
}

interface TargetUser {
  userName: string
  published: boolean
}

interface SessionUser {
  userName: string
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

function setUserContext(event: H3Event, username: string): void {
  event.context.username = username
  event.context.design = 'default'
}

function extractUsernameFromSubdomain(currentHost: string): string {
  return currentHost.split('.')[0]
}

function isUserAuthorizedToView(targetUser: TargetUser, loggedInUser: SessionUser | undefined): boolean {
  return targetUser.published || loggedInUser?.userName === targetUser.userName
}

async function handleCustomDomain(domain: string, loggedInUser: SessionUser | undefined, event: H3Event): Promise<void> {
  const db = await getDatabaseConnection()

  const targetUser = await db.selectFrom('users')
    .select(['userName', 'published'])
    .where('domain', '=', domain)
    .executeTakeFirst()

  if (targetUser && isUserAuthorizedToView(targetUser, loggedInUser)) {
    setUserContext(event, targetUser.userName)
  }
}

async function handleSubdomain(currentHost: string, loggedInUser: SessionUser | undefined, event: H3Event): Promise<void> {
  const db = await getDatabaseConnection()
  const username = extractUsernameFromSubdomain(currentHost)

  const targetUser = await db.selectFrom('users')
    .select(['userName', 'published'])
    .where('userName', '=', username)
    .executeTakeFirst()

  if (!targetUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Profil nicht gefunden.',
    })
  }

  if (isUserAuthorizedToView(targetUser, loggedInUser)) {
    setUserContext(event, username)
  }
  else {
    throw createError({
      statusCode: 404,
      statusMessage: 'Profil nicht gefunden.',
    })
  }
}

export default defineEventHandler(async (event) => {
  const { public: { appHost } } = useRuntimeConfig()
  const currentHost = validateHostHeader(event)
  const { isRootDomain, isSubdomain, isCustomDomain } = determineHostType(currentHost, appHost)

  if (isRootDomain) {
    return
  }

  const { user: loggedInUser } = await getUserSession(event)

  if (isCustomDomain) {
    await handleCustomDomain(currentHost, loggedInUser, event)
  }
  else if (isSubdomain) {
    await handleSubdomain(currentHost, loggedInUser, event)
  }
})
