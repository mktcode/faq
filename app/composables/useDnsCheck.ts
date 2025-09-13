export default function useDnsCheck() {
  const isCheckingDns = ref(false)
  const hasBeenChecked = ref(false)
  const isACorrect = ref(false)

  async function checkDns(domain: string) {
    if (isCheckingDns.value) return
    isCheckingDns.value = true

    // sleep for UX purposes
    await new Promise(resolve => setTimeout(resolve, 500))

    domain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '')
    const { hasARecord } = await $fetch('/api/user/domain/info', {
      method: 'POST',
      body: { domain },
    })

    hasBeenChecked.value = true
    isACorrect.value = hasARecord
    isCheckingDns.value = false
  }

  return {
    isCheckingDns,
    hasBeenChecked,
    isACorrect,
    checkDns,
  }
}
