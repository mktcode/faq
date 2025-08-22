<script setup lang="ts">
const isOpen = ref(true)
const { isStartingCheckout, startCheckoutSession } = useCheckoutSession()
const { settings, saveSettings, isSavingSettings } = await useProfile()

async function saveAndStartCheckout() {
  await saveSettings()
  startCheckoutSession()
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold text-center">
          E-Mail-Adresse verifiziert
        </h1>
        <p class="text-center text-gray-600">
          Vielen Dank! Sie können nun ein Abonnement abschließen, um Zugriff auf erweiterte Funktionen zu erhalten.
        </p>
        <div class="flex flex-col gap-2">
          <UFormField label="Name Ihres Unternehmens">
            <UInput
              v-model="settings.company.name"
              placeholder="Geben Sie den Titel Ihres Unternehmens ein"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Straße und Hausnummer">
            <UInput
              v-model="settings.company.street"
              placeholder="Geben Sie die Straße und Hausnummer ein"
              class="w-full"
            />
          </UFormField>
          <div class="flex flex-col sm:flex-row gap-4">
            <UFormField
              label="PLZ"
              class="w-32"
            >
              <UInput
                v-model="settings.company.zip"
                placeholder="Postleitzahl"
              />
            </UFormField>
            <UFormField
              label="Stadt"
              class="flex-1"
            >
              <UInput
                v-model="settings.company.city"
                placeholder="Geben Sie die Stadt ein"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>
        <UButton
          label="Abonnement abschließen"
          trailing-icon="i-heroicons-rocket-launch"
          class="w-full"
          :ui="{
            trailingIcon: 'ml-auto',
          }"
          :loading="isStartingCheckout || isSavingSettings"
          @click="saveAndStartCheckout"
        />
        <UButton
          label="Später"
          variant="soft"
          class="w-full"
          @click="isOpen = false"
        />
      </div>
    </template>
  </UModal>
</template>
