import type { FileMeta } from '~~/types/files'

export default defineEventHandler(async (event) => {
  const me = await requireMe(event)

  const keys = await useStorage('userfiles').getKeys(me.id.toString())

  const files: FileMeta[] = []

  for (const key of keys) {
    const meta = await useStorage('userfiles').getMeta(key, { userId: me.id.toString() }) as FileMeta
    files.push(meta)
  }
  
  return files
})