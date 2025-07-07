export default defineEventHandler(async (event) => {
  const user = await getMe(event)

  return { data: user }
})
