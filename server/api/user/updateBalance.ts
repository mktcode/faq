export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  await updateUserBalance(user.id)

  return { success: true }
})
