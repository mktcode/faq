<script setup lang="ts">
import type { WootConversation } from '~~/types/chatwoot'

const open = defineModel('open', {
  type: Boolean,
  required: true,
})

defineEmits<{
  delete: []
}>()

defineProps<{
  conversation: WootConversation
}>()
</script>

<template>
  <UModal
    v-model:open="open"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold text-center">
          Unterhaltung löschen?
        </h1>
        <p class="text-center text-gray-600">
          Sind Sie sicher, dass Sie diese Unterhaltung (auch für uns) dauerhaft löschen möchten?
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <UButton
            label="Abbrechen"
            variant="soft"
            icon="i-heroicons-x-mark"
            class="w-full"
            @click="open = false"
          />
          <UButton
            label="Löschen"
            icon="i-heroicons-trash"
            class="w-full"
            @click="$emit('delete')"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
