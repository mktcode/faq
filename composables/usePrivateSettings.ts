export const usePrivateSettings = async () => {
  const toast = useToast()
  const isSavingPrivateSettings = ref(false)

  const { data: privateSettings, refresh: refreshPrivateSettings } = await useFetch(`/api/user/settings/private`)

  async function savePrivateSettings() {
    if (isSavingPrivateSettings.value) return
    isSavingPrivateSettings.value = true

    await $fetch('/api/user/settings/private', {
      method: 'POST',
      body: privateSettings.value,
    })
    toast.add({
      title: 'Einstellungen gespeichert',
      description: 'Deine Einstellungen wurden erfolgreich gespeichert.',
      color: 'primary',
    })
    refreshPrivateSettings()
    isSavingPrivateSettings.value = false
  }

  return {
    privateSettings,
    isSavingPrivateSettings,
    refreshPrivateSettings,
    savePrivateSettings,
  }
}
