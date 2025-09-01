export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  return {
    profile: event.context.profile,
  }
})
