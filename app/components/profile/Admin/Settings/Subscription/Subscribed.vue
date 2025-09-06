<script setup lang="ts">
const isCreatingPortalSession = ref(false)
const isCreatingCancelSession = ref(false)

const { data: subscriptionSchedule } = await useFetch('/api/user/subscriptionSchedule')
const switchDate = computed(() => {
  if (subscriptionSchedule.value && subscriptionSchedule.value.phases) {
    const endDate = subscriptionSchedule.value.phases[0]?.end_date
    return endDate ? new Date(endDate * 1000) : null
  }
  return null
})

async function goToPortalSession() {
  isCreatingPortalSession.value = true
  const stripePortalSession = await $fetch('/api/user/stripe/portal', {
    method: 'POST',
  })
  if (stripePortalSession && stripePortalSession.url) {
    await navigateTo(stripePortalSession.url, { external: true } )
  }
  isCreatingPortalSession.value = false
}

async function goToCancelSession() {
  isCreatingCancelSession.value = true
  const stripeCancelSession = await $fetch('/api/user/stripe/cancel', {
    method: 'POST',
  })
  if (stripeCancelSession && stripeCancelSession.url) {
    await navigateTo(stripeCancelSession.url, { external: true } )
  }
  isCreatingCancelSession.value = false
}
</script>

<template>
  <div class="flex flex-col items-center p-6">
    <div class="text-gray-600 text-sm">
      Ihr Abonnement:
    </div>
    <div class="text-4xl">
      Paket {{ $profile.subscription.plan }}
    </div>
    <div v-if="switchDate" class="text-gray-600 text-sm">
      {{ `Paket S ab ${switchDate.toLocaleDateString()}` }}
    </div>
  </div>
  <div class="flex flex-col">
    <UButton
      @click="goToPortalSession"
      target="_blank"
      label="Abonnement verwalten"
      icon="i-heroicons-pencil-square"
      class="w-full rounded-none p-4 border-y border-gray-200"
      variant="ghost"
      color="neutral"
      trailing-icon="i-heroicons-chevron-right"
      :loading="isCreatingPortalSession"
      :ui="{
        trailingIcon: 'ml-auto opacity-30',
      }"
    />
    <UButton
      label="Abonnement beenden"
      icon="i-lucide-octagon-x"
      class="w-full rounded-none p-4 border-b border-gray-200"
      variant="ghost"
      color="neutral"
      trailing-icon="i-heroicons-chevron-right"
      @click="goToCancelSession"
      :loading="isCreatingCancelSession"
      :ui="{
        trailingIcon: 'ml-auto opacity-30',
      }"
    />
  </div>
</template>
