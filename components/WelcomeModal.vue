<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const showModalLocal = useLocalStorage<boolean>('welcome', true)
const showModal = ref(false)

setTimeout(() => {
  showModal.value = showModalLocal.value
}, 1000)
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold">
          Willkommen auf Ihrem Gewerbeprofil
        </h1>
        <p class="text-gray-600">
          Wie Sie sehen, ist es hier noch ziemlich leer. Ein Textfeld für Anfragen und Links zu Impressum und Datenschutzerklärung. Das war&apos;s.
        </p>
        <p class="text-gray-600">
          Anfragen können Sie direkt hier in der App beantworten. Hinterlegen Sie eine E-Mail-Adresse, um über neue Anfragen benachrichtigt zu werden.
        </p>
        <p class="text-gray-600">
          In den Einstellungen (oben links) machen Sie am besten gleich ein paar Angaben zu Ihrem Unternehmen, laden ein Logo hoch und schreiben einen kurzen Willkommensgruß für Besucher.
          Beschreiben Sie Ihr Angebot und verfassen Sie Antworten auf häufig gestellte Fragen. Laden Sie Bilder hoch und wählen Sie Farben und Schriftart aus, um Ihr Profil individueller zu gestalten.
        </p>
        <UButton
          label="Schließen"
          class="mx-auto mt-4"
          @click="showModal = false"
        />
      </div>
    </template>
  </UModal>
</template>
