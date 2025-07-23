import { settingsFormSchema, componentKeys } from '~/types/db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const userSettings = await db
    .selectFrom('users')
    .select(['settings'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()
  
  const settings = typeof userSettings.settings === 'string'
    ? JSON.parse(userSettings.settings)
    : userSettings.settings
  
  const validatedSettings = settingsFormSchema.parse(settings)
  const setComponentKeys = validatedSettings.displayedComponents || componentKeys

  const orderedComponentKeys = [
    ...setComponentKeys,
    ...componentKeys.filter((key) => !setComponentKeys.includes(key)),
  ]

  const availableComponents = {
    offer: {
      label: 'Angebot',
      icon: 'i-heroicons-megaphone',
      slot: 'offer',
    },
    faq: {
      label: 'Häufige Fragen',
      icon: 'i-heroicons-question-mark-circle',
      slot: 'faq',
    },
    form: {
      label: 'Kontaktformular',
      icon: 'i-heroicons-envelope',
      slot: 'form',
    },
    gallery: {
      label: 'Gallerie',
      icon: 'i-heroicons-photo',
      slot: 'gallery',
    },
    downloads: {
      label: 'Downloads',
      icon: 'i-heroicons-arrow-down-tray',
      slot: 'downloads',
    },
  }

  return orderedComponentKeys.map((component) => {
    return availableComponents[component] || undefined
  }).filter(Boolean)
})