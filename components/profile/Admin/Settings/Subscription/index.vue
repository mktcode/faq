<script setup lang="ts">
const { showSubscriptionSettings, go } = useAdmin()

const { stripePortalUrl } = useRuntimeConfig().public
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
      }
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
      <div class="flex flex-col gap-4 p-6">
        <ProfileAdminSettingsSubscriptionCheckoutPending v-if="$profile.subscription.checkoutPending" />
        <template v-else-if="$profile.subscription.plan">
          <div class="flex flex-col items-center">
            <div class="text-gray-600 text-sm">
              Ihr Abonnement:
            </div>
            <div class="text-4xl">
              Paket {{ $profile.subscription.plan }}
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <UButton
              :to="stripePortalUrl"
              label="Zahlungsdetails ändern"
              icon="i-heroicons-pencil-square"
              class="w-full"
              trailing-icon="i-heroicons-arrow-right"
              :ui="{
                trailingIcon: 'ml-auto opacity-50',
              }"
            />
            <UButton
              v-if="$profile.subscription.plan === 'S'"
              label="Zu Paket L wechseln"
              icon="i-lucide-chevrons-up"
              trailing-icon="i-heroicons-arrow-right"
              :ui="{
                trailingIcon: 'ml-auto opacity-50',
              }"
            />
            <UButton
              v-if="$profile.subscription.plan === 'L'"
              label="Zu Paket S wechseln"
              icon="i-lucide-chevrons-down"
              trailing-icon="i-heroicons-arrow-right"
              :ui="{
                trailingIcon: 'ml-auto opacity-50',
              }"
            />
            <UButton
              label="Premium-Abonnement beenden"
              icon="i-heroicons-x-circle"
              trailing-icon="i-heroicons-arrow-right"
              :ui="{
                trailingIcon: 'ml-auto opacity-50',
              }"
            />
          </div>
        </template>
        <ProfileAdminSettingsSubscriptionUnsubscribed v-else />
      </div>
    </template>
  </USlideover>
</template>
