import { z } from 'zod'

const bodySchema = z.object({
  partialId: z.number(),
  template: z.string().min(1, 'Die Eingabe darf nicht leer sein.'),
})

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { partialId, template } = await readValidatedBody(event, body => bodySchema.parse(body))
  
  const db = await getDatabaseConnection()

  const website = await db.selectFrom('websites')
    .selectAll()
    .where('userId', '=', $profile.id)
    .limit(1)
    .executeTakeFirst()
  
  if (!website) {
    return []
  }

  await db.updateTable('websitePartials')
    .set({ template })
    .where('id', '=', partialId)
    .where('websiteId', '=', website.id)
    .execute()
  
  return { success: true }
})
