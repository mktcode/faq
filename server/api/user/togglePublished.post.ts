export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  if (!event.context.profile) {
    throw createError({ statusCode: 400, statusMessage: 'Profile context not set.' })
  }

  const existingUser = await db
    .selectFrom('users')
    .select(['published'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  const isPublished = !existingUser.published

  await db
    .updateTable('users')
    .set({
      published: isPublished,
    })
    .where('id', '=', user.id)
    .execute()

  if (isPublished) {
    await $fetch(`https://www.google.com/ping?sitemap=${event.context.profile.canonicalUrl}/sitemap.xml`)
  }

  return { success: true, published: isPublished }
})
