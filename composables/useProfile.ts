import { defaultSettings, type SettingsForm } from '~/types/db'

export const useProfile = async () => {
  const { ssrContext } = useNuxtApp()
  const appConfig = useAppConfig()
  const toast = useToast()

  const username = useState<string | null>('username', () => null)
  const isSubscribed = useState<boolean>('isSubscribed', () => false)
  const isOwned = useState<boolean>('isOwned', () => false)
  const isPublic = useState<boolean>('isPublic', () => false)
  const design = useState<string>('design', () => 'default')
  const settings = useState<SettingsForm['public']>('settings', () => defaultSettings.public)
  const isSavingSettings = ref(false)
  const showLegalDataWarning = computed(() => isOwned && (!settings.value?.company?.name || !settings.value?.company?.city || !settings.value?.company?.street || !settings.value?.company?.zip || !settings.value?.company?.email))
  const designRounded = computed(() => settings.value.design.rounded)
  const font = computed(() => settings.value.design.font)

  let refreshSettings = async () => {}

  if (ssrContext?.event.context.profile) {
    username.value = ssrContext.event.context.profile.username
    isSubscribed.value = ssrContext.event.context.profile.isSubscribed
    isOwned.value = ssrContext.event.context.profile.isOwned
    isPublic.value = ssrContext.event.context.profile.isPublic
    design.value = ssrContext.event.context.profile.design
    appConfig.ui.colors.primary = 'website'

    const { data: currentSettings, refresh } = await useFetch(`/api/settings`, {
      query: {
        username,
      },
    })

    if (currentSettings.value) {
      settings.value = currentSettings.value
    }
    refreshSettings = refresh
  }

  watch(settings.value, () => {
    appConfig.ui.button.defaultVariants.rounded = settings.value.design.rounded
    appConfig.ui.input.defaultVariants.rounded = settings.value.design.rounded
    appConfig.ui.select.defaultVariants.rounded = settings.value.design.rounded
    appConfig.ui.textarea.defaultVariants.rounded = settings.value.design.rounded
  }, { immediate: true })

  async function saveSettings() {
    if (isSavingSettings.value) return
    isSavingSettings.value = true

    await $fetch('/api/user/settings', {
      method: 'POST',
      body: settings.value,
    })
    toast.add({
      title: 'Einstellungen gespeichert',
      description: 'Deine Einstellungen wurden erfolgreich gespeichert.',
      color: 'primary',
    })
    refreshSettings()
    isSavingSettings.value = false
  }

  return {
    username,
    isSubscribed,
    isOwned,
    isPublic,
    design,
    settings,
    isSavingSettings,
    refreshSettings,
    saveSettings,
    showLegalDataWarning,
    designRounded,
    font,
  }
}
