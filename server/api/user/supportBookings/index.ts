export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)

  return await supportBookingsUtils.listForUser($profile.id)
})
