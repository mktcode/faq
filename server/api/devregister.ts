export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV !== 'development') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: This endpoint is only available in development mode.',
    })
  }

  const db = await getDatabaseConnection()

  const settings = {
      font: 'montserrat',
      color: 'black',
      title: 'Herzlich Willkommen',
      description: 'Auf unserer Website von Solihost.de',
      headerTitleColor: 'black',
      headerTitleFontSize: 10,
      headerDescriptionColor: 'black',
      headerDescriptionFontSize: 6,
      headerImageOverlay: {
        color: 'black',
        opacity: 4,
      },
      displayedComponents: ['offer', 'gallery', 'form', 'faq', 'downloads'],
      form: {
        title: 'Anfrage',
        description: 'Wir freuen uns auf Ihre Nachricht!',
      },
      company: {
        isSmallBusiness: true,
      }
    }

  const insertResult = await db
    .insertInto('users')
    .values({
      name: 'Dev User',
      userName: 'devuser',
      email: 'devuser@example.com',
      settings: JSON.stringify(settings),
      published: false,
    })
    .executeTakeFirstOrThrow()

  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', Number(insertResult.insertId))
    .executeTakeFirstOrThrow()

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      userName: user.userName,
      email: user.email,
    },
  })

  return true
})
