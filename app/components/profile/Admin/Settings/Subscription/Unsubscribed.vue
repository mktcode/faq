<script setup lang="ts">
const { go } = useAdmin()
const selectedSubscription = useState<'S' | 'L' | null>('selectedSubscription', () => null)

function selectSubscription(plan: 'S' | 'L') {
  selectedSubscription.value = plan
  go('#settings/subscription/verification')
}

const features = {
  'S': [
    '.de-Domain und 3 E-Mail-Postfächer',
    '50 MB Speicher für Dateien und Bilder',
    'mehr Designoptionen',
    'IT-Support nach Verfügbarkeit',
    'monatlich kündbar',
  ],
  'L': [
    'alles aus Paket S',
    '250 MB Speicher für Dateien und Bilder',
    'Terminwahl für IT-Support per Telefon und Fernwartung',
    'Websiteänderungen per Spracheingabe',
    'Shop-Sektion und Onlinezahlungen',
    'monatlich kündbar oder zurück auf Paket S',
  ],
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
        v-for="feature in features.S" :key="feature"
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
        v-for="feature in features.L" :key="feature"
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
