export default function useDnsCheck() {
  const isCheckingDns = ref(false)
  const hasBeenChecked = ref(false)
  const isACorrect = ref(false)

  async function checkDns(domain: string) {
    if (isCheckingDns.value) return
    isCheckingDns.value = true

    domain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '')
    const result = await $fetch('/api/domain/checkDns', {
      method: 'POST',
      body: { domain },
    })

    hasBeenChecked.value = true
    isACorrect.value = result.isACorrect
    isCheckingDns.value = false
  }

  return {
    isCheckingDns,
    hasBeenChecked,
    isACorrect,
    checkDns,
  }
}