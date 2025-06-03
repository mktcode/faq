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
          Weitere Fragen beantwortet AutoFAQ automatisch aus den von dir hochgeladenen Dokumenten und bereitet Anfragen so vor, dass du keine Frage zweimal beantworten musst.
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
