import z from 'zod'
import type { FileMeta } from '~~/types/files'

const querySchema = z.object({
  showType: z.enum(['all', 'images', 'documents']),
  sortBy: z.enum(['newest', 'oldest', 'name-asc', 'name-desc']),
})

// TODO: implement pagination (to reduce s3 requests)
export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { showType, sortBy } = await getValidatedQuery(event, query => querySchema.parse(query))

  const keys = await useStorage('userfiles').getKeys($profile.id.toString())

  const files: FileMeta[] = []

  for (const key of keys) {
    const meta = await useStorage('userfiles').getMeta(key, { userId: $profile.id.toString() }) as FileMeta
    files.push(meta)
  }

  const filteredFiles = files.filter(file => {
    if (showType === 'all') return true
    if (showType === 'images') return file.type === 'image'
    if (showType === 'documents') return file.type === 'document'
    return true
  })
  
  const sortedFiles = filteredFiles.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    } else if (sortBy === 'oldest') {
      return new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
    } else if (sortBy === 'name-asc') {
      return a.filename.localeCompare(b.filename)
    } else if (sortBy === 'name-desc') {
      return b.filename.localeCompare(a.filename)
    }
    return 0
  })

  return sortedFiles
})