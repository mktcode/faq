import { settingsFormSchema } from '~~/types/db'
import { isDeepStrictEqual } from 'node:util';

export default defineEventHandler(async (event) => {
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
    .updateTable('users')
    .set({
      settings: JSON.stringify(settings),
    })
    .where('id', '=', $profile.id)
    .execute()

  return { success: true }
})
