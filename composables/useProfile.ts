export const useProfile = () => {
  const toast = useToast()
  const appConfig = useAppConfig()
  const $profile = useNuxtApp().$profile
  const isSavingSettings = ref(false)
  const unsavedSettings = ref(false)

  function resetSettings() {
    // TODO: implement
    unsavedSettings.value = false
  }

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
    unsavedSettings.value = false
  }

  watch($profile.settings, () => {
    unsavedSettings.value = true

    appConfig.ui.button.defaultVariants.rounded = $profile.settings.public.design.rounded
    appConfig.ui.input.defaultVariants.rounded = $profile.settings.public.design.rounded
    appConfig.ui.select.defaultVariants.rounded = $profile.settings.public.design.rounded
    appConfig.ui.textarea.defaultVariants.rounded = $profile.settings.public.design.rounded
  })

  return {
    $profile,
    isSavingSettings,
    resetSettings,
    saveSettings,
    unsavedSettings,
  }
}
