export default function useCheckoutSession() {
  const isStartingCheckout = ref(false)

  async function startCheckoutSession() {
    if (isStartingCheckout.value) return
    isStartingCheckout.value = true

    const { url } = await $fetch('/api/user/checkout/createSession', {
      method: 'POST',
    })

    isStartingCheckout.value = false

    if (url) {
      await navigateTo(url, { external: true })
    }
    else {
      console.error('Checkout session URL not found')
    }
  }

  return {
    isStartingCheckout,
    startCheckoutSession,
  }
}
