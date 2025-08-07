import { defaultSettings, type SettingsForm } from "~/types/db"

export const useProfile = async () => {
  const { ssrContext } = useNuxtApp()
  const toast = useToast()
  const path = useRoute().path

  const username = useState<string | null>('username', () => null)
  const isSubscribed = useState<boolean>('isSubscribed', () => false)
  const isOwned = useState<boolean>('isOwned', () => false)
  const isPublic = useState<boolean>('isPublic', () => false)
  const design = useState<string>('design', () => 'default')
  const settings = useState<SettingsForm>('settings', () => defaultSettings)
  const showLegalDataWarning = computed(() => isOwned && (!settings.value?.company?.name || !settings.value?.company?.city || !settings.value?.company?.street || !settings.value?.company?.zip || !settings.value?.company?.email))
  const designRounded = computed(() => settings.value.design.rounded)

  let refreshSettings = async () => {}

  if (ssrContext?.event.context.profile) {
    username.value = ssrContext.event.context.profile.username
    isSubscribed.value = ssrContext.event.context.profile.isSubscribed
    isOwned.value = ssrContext.event.context.profile.isOwned
    isPublic.value = ssrContext.event.context.profile.isPublic
    design.value = ssrContext.event.context.profile.design
    
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

  async function saveSettings() {
    await $fetch('/api/user/settings', {
      method: 'POST',
      body: settings.value,
    })
    toast.add({
      title: 'Einstellungen gespeichert',
      description: 'Deine Einstellungen wurden erfolgreich gespeichert.',
      color: 'success',
    })
    refreshSettings()
  }

  return {
    username,
    isSubscribed,
    isOwned,
    isPublic,
    design,
    path,
    settings,
    refreshSettings,
    saveSettings,
    showLegalDataWarning,
    designRounded,
  }
}
