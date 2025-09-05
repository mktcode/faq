<script setup lang="ts">
const { showSubscriptionSettings, go } = useAdmin()
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
      <ProfileAdminSettingsSubscriptionSubscribed v-else-if="$profile.subscription.plan" />
      <ProfileAdminSettingsSubscriptionUnsubscribed v-else />
    </template>
  </USlideover>
</template>
