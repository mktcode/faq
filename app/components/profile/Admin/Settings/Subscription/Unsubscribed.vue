<script setup lang="ts">
const { go } = useAdmin()
const selectedSubscription = useState<'S' | 'L' | null>('selectedSubscription', () => null)

function selectSubscription(plan: 'S' | 'L') {
  selectedSubscription.value = plan
  go('#settings/subscription/verification')
}
</script>

<template>
  <div>
    <div class="p-4 text-center">
      <UBadge
        label="Paket S"
        variant="soft"
        class="mb-2"
      />
      <div class="flex items-baseline justify-center gap-2 mb-2">
        <span class="text-3xl font-bold text-gray-900 dark:text-white">17,85 €</span>
        <span class="text-lg text-gray-600">/mtl.</span>
      </div>
      <div class="text-sm text-gray-500 mb-1">
        15 € Netto + 2,85 € Umsatzsteuer
      </div>
    </div>
    <div class="text-gray-600 flex flex-col">
      <div
        v-for="feature in solohost.features.S" :key="feature"
        class="flex items-center gap-2 p-2 border-t border-gray-200 text-sm"
      >
        <UIcon
          name="i-heroicons-chevron-right"
          class="text-primary-600"
        />
        {{ feature }}
      </div>
    </div>
    <UButton
      label="Paket S auswählen"
      class="w-full rounded-none"
      size="xxl"
      trailing-icon="i-heroicons-arrow-right"
      block
      @click="selectSubscription('S')"
    />
  </div>
  <div>
    <div class="p-4 text-center">
      <UBadge
        label="Paket L"
        variant="soft"
        class="mb-2"
      />
      <div class="flex items-baseline justify-center gap-2 mb-2">
        <span class="text-3xl font-bold text-gray-900 dark:text-white">59,50 €</span>
        <span class="text-lg text-gray-600">/mtl.</span>
      </div>
      <div class="text-sm text-gray-500 mb-1">
        50 € Netto + 9,50 € Umsatzsteuer
      </div>
    </div>
    <div class="text-gray-600 flex flex-col">
      <div
        v-for="feature in solohost.features.L" :key="feature"
        class="flex items-center gap-2 p-2 border-t border-gray-200 text-sm"
      >
        <UIcon
          name="i-heroicons-chevron-right"
          class="text-primary-600"
        />
        {{ feature }}
      </div>
    </div>
    <UButton
      label="Paket L auswählen"
      class="w-full rounded-none"
      size="xxl"
      trailing-icon="i-heroicons-arrow-right"
      block
      @click="selectSubscription('L')"
    />
  </div>
  <ProfileAdminSettingsSubscriptionVerification />
</template>
