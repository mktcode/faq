import type { FileMeta } from '~~/types/files'

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)

  const keys = await useStorage('userfiles').getKeys($profile.id.toString())

  const files: FileMeta[] = []

  for (const key of keys) {
    const meta = await useStorage('userfiles').getMeta(key, { userId: $profile.id.toString() }) as FileMeta
    files.push(meta)
  }
  
  return files
})