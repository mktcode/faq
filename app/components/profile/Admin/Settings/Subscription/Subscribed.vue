<script setup lang="ts">
const { data: stripePortalSession } = await useFetch('/api/user/stripe/portal', {
  method: 'POST',
})
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
      v-if="stripePortalSession && stripePortalSession.url"
      :to="stripePortalSession.url"
      target="_blank"
      label="Abonnement verwalten"
      icon="i-heroicons-pencil-square"
      class="w-full rounded-none p-4 border-y border-gray-200"
      variant="ghost"
      color="neutral"
      trailing-icon="i-heroicons-chevron-right"
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
    />
    <UButton
      label="Premium-Abonnement beenden"
      icon="i-heroicons-x-circle"
      class="w-full rounded-none p-4 border-b border-gray-200"
      variant="ghost"
      color="neutral"
      trailing-icon="i-heroicons-chevron-right"
      :ui="{
        trailingIcon: 'ml-auto opacity-30',
      }"
    />
  </div>
</template>
