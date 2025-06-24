export default defineEventHandler(async (event) => {
  const { secure } = await requireUserSession(event)
  if (!secure || !secure.token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'You must be logged in to access this resource.',
    })
  }

  const accounts = await $fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
    headers: {
      Authorization: `Bearer ${secure.token}`,
    },
  })

  return accounts
})
