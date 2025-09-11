export default function useExternalDDomain() {
  const { $profile } = useProfile()
  const { go } = useAdmin()

  const isUpdatingDomain = ref(false)

  async function updateDomain(domain: string) {
    if (isUpdatingDomain.value) return
    isUpdatingDomain.value = true

    try {
      await $fetch('/api/user/domain/updateExternal', {
        method: 'POST',
        body: { domain },
      })
  
      $profile.domain = domain
      $profile.domainIsExternal = true
      go('#settings/domain')
    }
    catch (error) {
      console.error('Error updating external domain:', error)
    }
    finally {
      isUpdatingDomain.value = false
    }
  }

  return {
    isUpdatingDomain,
    updateDomain,
  }
}
