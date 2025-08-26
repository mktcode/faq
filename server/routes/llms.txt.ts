export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/plain')
  
  const currentHost = router.getCurrentHost(event)
  const user = await router.getUserFromHost(currentHost)

  if (user) {
    const settings = await getPublicSettings(user.userName)
    return `# ${settings.company.name}`
  }

  return `# Solohost`
})
