export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  return await supportBookingsUtils.all()
})
