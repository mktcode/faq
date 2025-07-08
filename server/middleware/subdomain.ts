export default defineEventHandler(async (event) => {
  const { public: { appHost } } = useRuntimeConfig()

  const currentHost = event.node.req.headers.host

  if (!currentHost) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Host header is missing',
    })
  }

  const isRootDomain = currentHost === appHost
  const isSubdomain = !isRootDomain && currentHost.endsWith(`.${appHost}`)
  const isDomain = !isRootDomain && !isSubdomain

  const db = await getDatabaseConnection()
  const { user: loggedInUser } = await getUserSession(event)

  if (isDomain) {
    const targetUser = await db.selectFrom('users')
      .select(['userName', 'published'])
      .where('domain', '=', currentHost)
      .executeTakeFirst()

    if (targetUser && (targetUser.published || loggedInUser?.userName === targetUser.userName)) {
      event.context.username = targetUser.userName
      event.context.design = 'default'
    }
  }
  else if (isSubdomain) {
    const username = currentHost.split('.')[0]

    const targetUser = await db.selectFrom('users')
      .select(['published'])
      .where('userName', '=', username)
      .executeTakeFirst()

    if (!targetUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Profil nicht gefunden.',
      })
    }

    if (targetUser.published || loggedInUser?.userName === username) {
      event.context.username = username
      event.context.design = 'default'
    }
    else {
      throw createError({
        statusCode: 404,
        statusMessage: 'Profil nicht gefunden.',
      })
    }
  }
})
