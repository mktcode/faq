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
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold">
          Willkommen auf Ihrer Website!
        </h1>
        <p class="text-gray-600">
          Aktuell ist Ihre Website nur für Sie sichtbar. Oben links finden Sie das
          <UIcon
            name="i-heroicons-bars-3"
            class="text-primary-500"
          /> Menü, über das Sie Ihre Website verwalten können.
        </p>
        <p class="text-gray-600">
          Für Fragen oder Feedback schreiben Sie uns gerne eine E-Mail an <a
            href="mailto:support@beispiel.de"
            class="italic"
          >support@solihost.de</a>.
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
