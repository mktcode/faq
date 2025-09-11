<script setup lang="ts">
const { go } = useAdmin()
const selectedSubscription = useState<'S' | 'L' | null>('selectedSubscription', () => null)

function selectSubscription(plan: 'S' | 'L') {
  selectedSubscription.value = plan
  go('#settings/subscription/verification')
}
</script>

<template>
  <div class="text-center p-4">
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
    <div class="text-sm text-gray-500 mt-2 flex flex-col gap-1">
      <div>
        <UIcon
          name="i-heroicons-check"
          class="text-green-600"
        />
        Domain und 1 E-Mail-Postfach
      </div>
      <div>
        <UIcon
          name="i-heroicons-check"
          class="text-green-600"
        />
        mehr Gestaltungsmöglichkeiten
      </div>
      <div>
        <UIcon
          name="i-heroicons-check"
          class="text-green-600"
        />
        IT-Support nach Verfügbarkeit
      </div>
      <div>
        <UIcon
          name="i-heroicons-check"
          class="text-green-600"
        />
        monatlich kündbar
      </div>
    </div>
  </div>
  <UButton
    label="Paket S auswählen"
    class="w-full mt-4 rounded-none"
    size="xxl"
    trailing-icon="i-heroicons-arrow-right"
    block
    @click="selectSubscription('S')"
  />
  <div class="text-center p-4 mt-8">
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
    <div class="text-sm text-gray-500 mt-2 flex flex-col gap-1">
      <div>
        <UIcon
          name="i-heroicons-check"
          class="text-green-600"
        />
        alles aus Paket S
      </div>
      <div>
        <UIcon
          name="i-heroicons-check"
          class="text-green-600"
        />
        2 weitere E-Mail-Postfächer
      </div>
      <div>
        <UIcon
          name="i-heroicons-check"
          class="text-green-600"
        />
        priorisierter IT-Support
      </div>
      <div>
        <UIcon
          name="i-heroicons-check"
          class="text-green-600"
        />
        per Telefon und Fernwartung
      </div>
      <div>
        <UIcon
          name="i-heroicons-check"
          class="text-green-600"
        />
        persönlicher KI-Assistent
      </div>
      <div>
        <UIcon
          name="i-heroicons-check"
          class="text-green-600"
        />
        monatlich kündbar oder zurück auf Paket S
      </div>
    </div>
  </div>
  <UButton
    label="Paket L auswählen"
    class="w-full mt-4 rounded-none"
    size="xxl"
    trailing-icon="i-heroicons-arrow-right"
    block
    @click="selectSubscription('L')"
  />
  <ProfileAdminSettingsSubscriptionVerification />
</template>
