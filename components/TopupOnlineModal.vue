<script setup lang="ts">
import type { StripeElements } from '@stripe/stripe-js/dist/stripe-js'
import { loadStripe } from '@stripe/stripe-js/pure'

const { public: { stripeApiKey } } = useRuntimeConfig()

loadStripe.setLoadParameters({ advancedFraudSignals: false })
const stripe = await loadStripe(stripeApiKey)
const clientSecret = ref<string | null>(null)
const stripeElements = ref<StripeElements | null>(null)

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const { price } = defineProps({
  price: {
    type: Number,
    default: 15,
  },
})

async function createPaymentIntent() {
  if (!stripe) {
    console.error('Stripe not loaded')
    return
  }

  clientSecret.value = await $fetch('/api/stripe/createPaymentIntent', {
    method: 'POST',
    body: {
      amount: price,
    },
  })

  if (!clientSecret.value) {
    console.error('No client secret returned from server')
    return
  }

  stripeElements.value = stripe.elements({ clientSecret: clientSecret.value })
  const paymentElement = stripeElements.value.create('payment')
  paymentElement.mount('#payment-element')
}

function confirmPayment() {
  if (!stripe) {
    console.error('Stripe not loaded')
    return
  }

  if (!stripeElements.value) {
    console.error('No client secret available')
    return
  }

  stripe.confirmPayment({
    elements: stripeElements.value,
    confirmParams: {
      return_url: window.location.href,
    },
  }).then((result) => {
    if (result.error) {
      console.error('Payment confirmation error:', result.error)
    }
    else {
      console.log('Payment confirmed:', result)
      open.value = false
    }
  })
}

onMounted(createPaymentIntent)
</script>

<template>
  <UModal
    v-model:open="open"
    title="Guthaben aufladen"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <div id="payment-element" />
        <UButton @click="confirmPayment">
          Bestätigen
        </UButton>
      </div>
    </template>
  </UModal>
</template>
