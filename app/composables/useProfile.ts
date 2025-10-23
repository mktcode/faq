export const useProfile = () => {
  const toast = useToast()
  const appConfig = useAppConfig()
  const $profile = useNuxtApp().$profile
  const isUpdatingProfile = ref(false)
  const isSavingSettings = ref(false)
  const unsavedSettings = useState('unsavedSettings', () => false)

  const showLegalDataWarning = computed(() => {
    return !$profile.settings.public.company.name ||
      !$profile.settings.public.company.street ||
      !$profile.settings.public.company.phone
  })

  function resetSettings() {
    $profile.settings.public = JSON.parse(JSON.stringify($profile.originalSettings.public))
    $profile.settings.private = JSON.parse(JSON.stringify($profile.originalSettings.private))
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
      progress: false,
    })
    await updateProfile()
    isSavingSettings.value = false
    unsavedSettings.value = false
  }

  async function updateProfile() {
    isUpdatingProfile.value = true

    const { profile } = await $fetch('/api/user/profile')

    if (profile) {
      $profile.canonicalUrl = profile.canonicalUrl
      $profile.domain = profile.domain
      $profile.domainIsExternal = profile.domainIsExternal
      $profile.isOwned = profile.isOwned
      $profile.isAdmin = profile.isAdmin
      $profile.isPublic = profile.isPublic
      $profile.mailboxes = profile.mailboxes
      $profile.settingsId = profile.settingsId
      $profile.settings = profile.settings
      $profile.originalSettings = profile.originalSettings
      $profile.subscription = profile.subscription
      $profile.username = profile.username
    }
    isUpdatingProfile.value = false
  }

  watch($profile.settings, () => {
    unsavedSettings.value = JSON.stringify($profile.settings) !== JSON.stringify($profile.originalSettings)

    appConfig.ui.button.defaultVariants.rounded = $profile.settings.public.design.rounded
    appConfig.ui.input.defaultVariants.rounded = $profile.settings.public.design.rounded
    appConfig.ui.select.defaultVariants.rounded = $profile.settings.public.design.rounded
    appConfig.ui.textarea.defaultVariants.rounded = $profile.settings.public.design.rounded
  })

  return {
    $profile,
    showLegalDataWarning,
    isSavingSettings,
    resetSettings,
    saveSettings,
    unsavedSettings,
    updateProfile,
    isUpdatingProfile,
  }
}
