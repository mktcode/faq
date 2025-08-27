<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const showModalLocal = useLocalStorage<boolean>('welcome', true)
const showModal = ref(false)

setTimeout(() => {
  showModal.value = showModalLocal.value
}, 1000)

function close() {
  showModal.value = false
  showModalLocal.value = false
}
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
          Aktuell ist Ihre Website nur für Sie sichtbar. Oben links finden Sie die
          <UIcon
            name="i-heroicons-bars-3"
            class="text-primary-500"
          /> Administration, über die Sie Ihre Website verwalten können.
        </p>
        <p class="text-gray-600">
          Für Fragen oder Feedback schreiben Sie uns gerne eine E-Mail an <a
            href="mailto:support@beispiel.de"
            class="italic"
          >support@solohost.de</a>.
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
