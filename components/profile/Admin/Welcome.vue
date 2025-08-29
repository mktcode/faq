<script setup lang="ts">
import { useClipboard, useLocalStorage } from '@vueuse/core'

const showModalLocal = useLocalStorage<boolean>('welcome', true)
const showModal = ref(false)

setTimeout(() => {
  showModal.value = showModalLocal.value
}, 1000)

function close() {
  showModal.value = false
  showModalLocal.value = false
}

const { copy, copied } = useClipboard()
</script>

<template>
  <UModal
    v-model:open="showModal"
    title="Willkommen bei Solohost!"
    description="Website und IT-Kompetenz für Selbständige und kleine Unternehmen"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <p class="text-gray-600">
          Ihre Website ist unter folgender Adresse erreichbar:
        </p>
        <div class="text-gray-600 text-lg border border-gray-200 rounded-lg p-2 pl-3 flex items-center justify-between">
          <span>
            {{ $profile.canonicalUrl.replace(/https?:\/\//, '').replace(/\/$/, '') }}
          </span>
          <UButton
            class="ml-2"
            :label="copied ? 'kopiert!' : 'kopieren'"
            variant="soft"
            size="sm"
            @click="copy($profile.canonicalUrl)"
          />
        </div>
        <p class="text-gray-600">
          Aktuell ist sie <strong>nur für Sie sichtbar</strong>. Vervollständigen Sie in den <UIcon
            name="i-heroicons-cog-6-tooth"
            class="size-5 inline-block align-text-bottom"
          /> Einstellungen Ihre <UIcon
            name="i-heroicons-building-office-2"
            class="size-5 inline-block align-text-bottom"
          /> Unternehmensdaten, um Ihre Website veröffentlichen zu können.
        </p>

        <p>
          Wenn Sie Unterstützung benötigen, egal ob mit Ihrer Website oder anderen Themen, erreichen Sie uns unter <UIcon
            name="i-lucide-message-circle-question-mark"
            class="size-5 inline-block align-text-bottom"
          /> Hilfe.
        </p>
        <UButton
          label="Schließen"
          class="mx-auto mt-4"
          @click="close"
        />
      </div>
    </template>
  </UModal>
</template>
