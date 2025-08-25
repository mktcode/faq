export const useProfile = () => {
  const toast = useToast()
  const $profile = useNuxtApp().$profile
  const isSavingSettings = ref(false)

  async function saveSettings() {
    if (isSavingSettings.value) return
    isSavingSettings.value = true

    await $fetch('/api/user/settings', {
      method: 'POST',
      body: $profile.settings,
    })
    toast.add({
      title: 'Einstellungen gespeichert',
      description: 'Deine Einstellungen wurden erfolgreich gespeichert.',
      color: 'primary',
    })
    isSavingSettings.value = false
  }

  return {
    $profile,
    isSavingSettings,
    saveSettings,
  }
}
