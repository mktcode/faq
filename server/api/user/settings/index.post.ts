import { settingsFormSchema } from '~~/types/db'
import { isDeepStrictEqual } from 'node:util';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const $profile = await requireProfileWithPermission(event)
  const settings = await readValidatedBody(event, body => settingsFormSchema.parse(body))

  if (!isDeepStrictEqual($profile.settings.public.company, settings.public.company)) {
    console.log('Company info changed, updating lastMod')
    settings.public.company.lastMod = new Date().toISOString()
  }

  settings.public.pages = settings.public.pages.map(newPage => {
    const currentPage = $profile.settings.public.pages.find(p => p.id === newPage.id)
    if (currentPage && !isDeepStrictEqual(currentPage, newPage)) {
      console.log('Page changed, updating lastMod for', newPage.path)
      return {
        ...newPage,
        lastMod: new Date().toISOString(),
      }
    }
    return newPage
  })
  
  const db = await getDatabaseConnection()

  await db
    .selectFrom('settingsHistory')
    .select('id')
    .where('userId', '=', $profile.id)
    .where('id', '=', user.editSettingsId)
    .executeTakeFirstOrThrow()

  await db
    .updateTable('settingsHistory')
    .set({ settings: JSON.stringify(settings) })
    .where('id', '=', user.editSettingsId)
    .execute()

  return { success: true }
})
