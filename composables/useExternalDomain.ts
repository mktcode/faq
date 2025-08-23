export default function useExternalDDomain() {
  const { $profile } = useProfile()

  const isUpdatingDomain = ref(false)
  const domainConnectedSuccessfully = ref(false)

  async function updateDomain(domain: string) {
    if (isUpdatingDomain.value) return
    isUpdatingDomain.value = true

    // TODO: catch errors in all these situations
    const { success } = await $fetch('/api/user/updateExternalDomain', {
      method: 'POST',
      body: { domain },
    })

    if (success) {
      $profile.domain = domain
      $profile.domainIsExternal = true
      domainConnectedSuccessfully.value = true
    }

    isUpdatingDomain.value = false
  }

  return {
    isUpdatingDomain,
    domainConnectedSuccessfully,
    updateDomain,
  }
}