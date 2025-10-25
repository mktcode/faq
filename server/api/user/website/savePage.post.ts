import { z } from 'zod'

const bodySchema = z.object({
  pageId: z.number(),
  template: z.string().min(1, 'Die Eingabe darf nicht leer sein.'),
})

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { pageId, template } = await readValidatedBody(event, body => bodySchema.parse(body))

  const db = await getDatabaseConnection()

  const website = await db.selectFrom('websites')
    .selectAll()
    .where('userId', '=', $profile.id)
    .limit(1)
    .executeTakeFirst()
  
  if (!website) {
    return []
  }

  await db.updateTable('websitePages')
    .set({ template })
    .where('id', '=', pageId)
    .where('websiteId', '=', website.id)
    .execute()
  
  return { success: true }
})
