<script setup lang="ts">
const { showSubscriptionSettings } = useAdmin()

const { stripePortalUrl } = useRuntimeConfig().public
const { user } = useUserSession()
const { updateProfile } = useProfile()

const updateProfileInterval = ref<NodeJS.Timeout | null>(null)
onMounted(() => {
  updateProfileInterval.value = setInterval(async () => {
    await updateProfile()
  }, 5000)
})

onBeforeUnmount(() => {
  if (updateProfileInterval.value) {
    clearInterval(updateProfileInterval.value)
  }
})
</script>

<template>
  <USlideover
    v-model:open="showSubscriptionSettings"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: '!p-0',
    }"
    :close="{
      size: 'md',
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
        <template v-if="$profile.subscription.checkoutPending">
          <p class="text-gray-600">
            Ihr Abonnement wird gerade verarbeitet.
          </p>
        </template>
        <template v-else-if="$profile.subscription.plan">
          <p class="text-gray-600">
            Aktuelles Paket: {{ $profile.subscription.plan }}
          </p>
          <p class="text-gray-600">
            Um Ihr Abonnement zu verwalten, werden Sie zu unserem Zahlungsdienstleister Stripe weitergeleitet.
            Geben Sie dort Ihre E-Mail-Adresse ({{ user?.email }}) ein, um einen Zugangscode zu erhalten.
            Aus Sicherheitsgründen ist dieser Code nur einmalig gültig.
          </p>
          <UButton
            :to="stripePortalUrl"
            label="Abonnement verwalten"
            icon="i-heroicons-pencil-square"
            class="w-full"
          />
        </template>
        <ProfileAdminSettingsSubscriptionUnsubscribed v-else />
      </div>
    </template>
  </USlideover>
</template>
