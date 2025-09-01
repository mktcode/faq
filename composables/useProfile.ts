export const useProfile = () => {
  const toast = useToast()
  const appConfig = useAppConfig()
  const $profile = useNuxtApp().$profile
  const isUpdatingProfile = ref(false)
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
      progress: false
    })
    isSavingSettings.value = false
    unsavedSettings.value = false
  }

  async function updateProfile() {
    isUpdatingProfile.value = true

    // wait 1 sec (This is not debugging, this is intentional for UX)
    await new Promise(resolve => setTimeout(resolve, 1000))

    const { profile } = await $fetch('/api/user/profile')

    if (profile) {
      $profile.canonicalUrl = profile.canonicalUrl
      $profile.domain = profile.domain
      $profile.domainIsExternal = profile.domainIsExternal
      $profile.isOwned = profile.isOwned
      $profile.isPublic = profile.isPublic
      $profile.mailboxes = profile.mailboxes
      $profile.settings = profile.settings
      $profile.subscription = profile.subscription
      $profile.username = profile.username
    }
    isUpdatingProfile.value = false
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
    updateProfile,
    isUpdatingProfile,
  }
}
