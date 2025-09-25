<script setup lang="ts">
const emit = defineEmits<{
  agreed: []
}>()

const { hasAgreedToBetaTerms, showBetaTermsModal } = useUserAgreements()
const { go } = useAdmin()

function agree() {
  hasAgreedToBetaTerms.value = true
  showBetaTermsModal.value = false
  emit('agreed')
}

function goToSupport() {
  showBetaTermsModal.value = false
  go('#support')
}
</script>

<template>
  <UModal
    v-model:open="showBetaTermsModal"
    title="Hinweis zum Website-Editor"
    :close="false"
  >
    <template #body>
      <p>
        Der Website-Editor befindet sich noch in der aktiven Entwicklung, kann aber bereits genutzt werden.
        Sollten Sie auf Probleme stoßen oder Funktionen vermissen, freuen wir uns über Ihr Feedback im Support Bereich!
      </p>
      <p class="mt-4">
        Für Anpassungen Ihrer Website oder gänzlich individuelle Lösungen stehen wir Ihnen dort ebenfalls gerne zur Verfügung.
      </p>
    </template>

    <template #footer>
      <UButton
        label="zum Support"
        icon="i-lucide-messages-square"
        variant="soft"
        class="mr-auto"
        @click="goToSupport"
      />
      <UButton
        label="Alles klar!"
        icon="i-heroicons-check"
        block
        @click="agree"
      />
    </template>
  </UModal>
</template>