export default defineEventHandler(async (event) => {
  return {
    profile: await requireProfileWithPermission(event),
  }
})
