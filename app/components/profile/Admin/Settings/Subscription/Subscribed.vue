<script setup lang="ts">
const isCreatingPortalSession = ref(false)
const isCreatingCancelSession = ref(false)
const isCreatingSwitchSession = ref(false)

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

async function goToSwitchSession() {
  isCreatingSwitchSession.value = true
  const stripeSwitchSession = await $fetch('/api/user/stripe/switch', {
    method: 'POST',
  })
  if (stripeSwitchSession && stripeSwitchSession.url) {
    await navigateTo(stripeSwitchSession.url, { external: true } )
  }
  isCreatingSwitchSession.value = false
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
      v-if="$profile.subscription.plan === 'S'"
      label="Zu Paket L wechseln"
      icon="i-lucide-chevrons-up"
      class="w-full rounded-none p-4 border-b border-gray-200"
      variant="ghost"
      color="neutral"
      trailing-icon="i-heroicons-chevron-right"
      :ui="{
        trailingIcon: 'ml-auto opacity-30',
      }"
      @click="goToSwitchSession"
      :loading="isCreatingSwitchSession"
    />
    <UButton
      v-if="$profile.subscription.plan === 'L'"
      label="Zu Paket S wechseln"
      icon="i-lucide-chevrons-down"
      class="w-full rounded-none p-4 border-b border-gray-200"
      variant="ghost"
      color="neutral"
      trailing-icon="i-heroicons-chevron-right"
      :ui="{
        trailingIcon: 'ml-auto opacity-30',
      }"
      @click="goToSwitchSession"
      :loading="isCreatingSwitchSession"
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
