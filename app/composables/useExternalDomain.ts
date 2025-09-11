export default function useExternalDDomain() {
  const { $profile } = useProfile()

  const isUpdatingDomain = ref(false)
  const domainConnectedSuccessfully = ref(false)

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
      domainConnectedSuccessfully.value = true
    }
    catch (error) {
      console.error('Error updating external domain:', error)
      domainConnectedSuccessfully.value = false
    }
    finally {
      isUpdatingDomain.value = false
    }
  }

  return {
    isUpdatingDomain,
    domainConnectedSuccessfully,
    updateDomain,
  }
}
