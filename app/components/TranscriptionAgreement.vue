<script setup lang="ts">
const emit = defineEmits<{
  agreed: []
}>()

const { hasAgreedToTranscriptions, showTranscriptionAgreementModal } = useUserAgreements()

function agree() {
  hasAgreedToTranscriptions.value = true
  showTranscriptionAgreementModal.value = false
  emit('agreed')
}
</script>

<template>
  <UModal
    v-model:open="showTranscriptionAgreementModal"
    title="Datenschutzhinweis für Audioaufnahmen"
  >
    <template #body>
      Für die Transkription Ihrer Sprachaufnahme wird diese an den KI-Dienst OpenAI (USA) übermittelt.
      Dazu erfordert es Ihre Zustimmung. Wenn Sie nicht damit einverstanden sind, nutzen Sie bitte ganz normal die Tastatur.
      Weitere Informationen finden Sie in der <a href="/datenschutz" class="text-sky-500 hover:underline" target="_blank">Datenschutzerklärung</a>.
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Abbrechen"
          variant="soft"
          @click="showTranscriptionAgreementModal = false"
        />
        <UButton
          label="Zustimmen und Aufnahme starten"
          @click="agree"
        />
      </div>
    </template>
  </UModal>
</template>