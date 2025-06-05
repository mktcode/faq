<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const showModal = useLocalStorage<boolean>('welcome', true)
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold text-center">
          Willkommen bei AutoFAQ
        </h1>
        <p class="text-center text-gray-600">
          Du kannst hier Informationen zu deinem Unternehmen und Antworten auf häufige Fragen angeben, die dann auf deiner Profilseite angezeigt werden.
        </p>
        <p class="text-center text-gray-600">
          Weitere Fragen von Interessenten beantwortet AutoFAQ automatisch aus Dokumenten, die du hochladen kannst, und bereitet Anfragen so vor, dass du keine Frage zweimal beantworten musst.
        </p>
        <p class="text-center text-gray-600">
          Zeige deine Google Bewertungen und verlinke ein Buchungstool oder deinen Kleinanzeigen-Shop.
        </p>
        <UButton
          label="Loslegen"
          class="mx-auto"
          @click="showModal = false"
        />
      </div>
    </template>
  </UModal>
</template>
