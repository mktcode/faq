import { settingsFormSchema } from '~~/types/db'
import { isDeepStrictEqual } from 'node:util';
import z from 'zod';

const bodySchema = z.object({
  userId: z.number(),
  settings: settingsFormSchema,
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const { userId, settings } = await readValidatedBody(event, body => bodySchema.parse(body))
  const currentSettings = await getSettings(userId)

  if (!isDeepStrictEqual(currentSettings.public.company, settings.public.company)) {
    settings.public.company.lastMod = new Date().toISOString()
  }

  settings.public.pages = settings.public.pages.map(newPage => {
    const currentPage = currentSettings.public.pages.find(p => p.id === newPage.id)
    if (currentPage && !isDeepStrictEqual(currentPage, newPage)) {
      return {
        ...newPage,
        lastMod: new Date().toISOString(),
      }
    }
    return newPage
  })
  
  const db = await getDatabaseConnection()
  await db
    .updateTable('users')
    .set({
      settings: JSON.stringify(settings),
    })
    .where('id', '=', userId)
    .execute()

  return { success: true }
})
