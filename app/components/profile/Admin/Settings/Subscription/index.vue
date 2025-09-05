<script setup lang="ts">
const { showSubscriptionSettings, go } = useAdmin()

const { data: stripePortalSession } = await useFetch('/api/user/stripe/portal', {
  method: 'POST',
})
</script>

<template>
  <USlideover
    :open="showSubscriptionSettings"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: '!p-0',
    }"
    :close="{
      size: 'md',
      onClick: () => {
        go('#settings')
      },
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-rocket-launch"
          class="inline-block size-6 opacity-50"
        />
        Premium Abonnement
      </h3>
    </template>

    <template #body>
      <ProfileAdminSettingsSubscriptionCheckoutPending v-if="$profile.subscription.checkoutSession" />
      <template v-else-if="$profile.subscription.plan">
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
      <ProfileAdminSettingsSubscriptionUnsubscribed v-else />
    </template>
  </USlideover>
</template>
