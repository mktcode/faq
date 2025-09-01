export default defineEventHandler(async () => {
  return await supportBookingsUtils.list()
})
