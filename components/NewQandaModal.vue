<script setup lang="ts">
const showModal = defineModel('show', {
  default: true,
  type: Boolean,
})

const question = ref('')
const answer = ref('')

const isSaving = ref(false)

async function saveQanda() {
  isSaving.value = true
  await $fetch('/api/user/qanda', {
    method: 'POST',
    body: {
      question: question.value,
      answer: answer.value,
    },
  })
  isSaving.value = false
  showModal.value = false
}
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField
          label="Frage"
          description="Geben Sie eine typische Frage Ihrer Zielgruppe ein."
        >
          <UTextarea
            v-model="question"
            placeholder="Was ist der Unterschied zwischen Vue und React?"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Antwort"
          description="Geben Sie eine möglichst genaue und umfassende Antwort auf diese Frage ein."
        >
          <UTextarea
            v-model="answer"
            placeholder="Vue ist ein progressives JavaScript-Framework, während React eine JavaScript-Bibliothek ist..."
            class="w-full"
          />
        </UFormField>
        <UButton
          icon="i-heroicons-plus"
          variant="solid"
          block
          :loading="isSaving"
          :disabled="!question || !answer"
          @click="saveQanda"
        >
          Frage hinzufügen
        </UButton>
      </div>
    </template>
  </UModal>
</template>
