export default function useSupportAvailability() {
  const isSupportAvailable = useState('isSupportAvailable', () => false)

  const fetchSupportAvailability = async () => {
    try {
      const result = await $fetch('/api/support/availability')

      isSupportAvailable.value = result.isAvailable
    } catch (error) {
      console.error('Error fetching support availability:', error)
      isSupportAvailable.value = false
    }
  }

  fetchSupportAvailability()

  let refreshInterval: NodeJS.Timeout | null = null

  onMounted(() => {
    refreshInterval = setInterval(fetchSupportAvailability, 60 * 1000)
  })

  onUnmounted(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
  })

  return {
    isSupportAvailable,
  }
}
