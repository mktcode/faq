<script setup lang="ts">
import type { SettingsForm } from '~/types/db'

const showModal = defineModel('show', {
  default: true,
  type: Boolean,
})

const { currentSettings } = defineProps<{
  currentSettings: SettingsForm
}>()
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
  >
    <template #body>
      <h3 class="text-lg font-semibold mb-4">
        Auf zur Premium Website!
      </h3>
      <p class="text-gray-500 mb-4">
        Ein gut ausgefülltes Gewerbeprofil hilft uns, Ihnen schneller ein passendes Angebot zu machen und erste Designentwürfe zu erstellen.
      </p>
      <div class="text-lg">
        <div
          class="flex items-center gap-2 text-gray-500"
        >
          <UIcon
            v-if="currentSettings.links?.length"
            name="i-heroicons-check"
            class="text-green-600"
          />
          <UIcon
            v-else
            name="i-heroicons-x-mark"
            class="text-gray-300"
          />
          <UIcon
            name="i-heroicons-link"
            class="text-gray-400"
          />
          Externe Verlinkungen
        </div>
        <div
          class="flex items-center gap-2 text-gray-500"
        >
          <UIcon
            v-if="currentSettings.logo"
            name="i-heroicons-check"
            class="text-green-600"
          />
          <UIcon
            v-else
            name="i-heroicons-x-mark"
            class="text-gray-300"
          />
          <UIcon
            name="i-heroicons-photo"
            class="text-gray-400"
          />
          Logo
        </div>
      </div>
      <p class="text-gray-500 my-4">
        Wollen Sie Ihr Profil noch weiter ausfüllen oder sind Sie bereit für den nächsten Schritt?
      </p>
      <div class="flex items-center justify-between gap-2 mt-4">
        <UButton
          label="Profil weiter ausfüllen"
          variant="soft"
          icon="i-heroicons-pencil-square"
        />
        <UButton
          to="/premium"
          label="Weiter"
          trailing-icon="i-heroicons-arrow-right"
        />
      </div>
    </template>
  </UModal>
</template>
