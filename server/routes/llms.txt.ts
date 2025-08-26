export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/plain')

  if (event.context.profile) {
    const settings = await getPublicSettings(event.context.profile.username)
    return `# ${settings.company.name}`
  }

  return `# Solohost`
})
