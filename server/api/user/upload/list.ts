export default defineEventHandler(async (event) => {
  const me = await requireMe(event)

  const files = await getUserFiles(me.id)
  
  return files
})