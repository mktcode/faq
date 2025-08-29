<script setup lang="ts">
import { useClipboard } from '@vueuse/core';

const { showSupport } = useAdmin()
const { user } = useUserSession()
const { copy: copySupportId, copied: copiedSupportId } = useClipboard()
</script>

<template>
  <USlideover
    v-model:open="showSupport"
    side="right"
    :close="{
      size: 'md',
    }"
    :ui="{
      wrapper: 'z-40',
      overlay: 'backdrop-blur-xs',
      footer: 'justify-between',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-message-circle-question-mark"
          class="inline-block size-6 opacity-50"
        />
        Hilfe
      </h3>
    </template>

    <template #body>
      <p class="mb-4">
        Wenn Sie uns telefonisch oder per E-Mail kontaktieren, geben Sie bitte Ihre Support-ID an.
      </p>
      <div
      v-if="user"
      class="p-2 border border-gray-200 rounded-xl font-mono text-2xl bg-gray-50 flex items-center justify-between"
      >
        <div>
          <div class="text-sm text-gray-500">
            Support-ID:
          </div>
          {{ user.id }}
        </div>
        <UButton
          variant="soft"
          @click="copySupportId(user.id.toString())"
        >
          {{ copiedSupportId ? 'Kopiert!' : 'Kopieren' }}
        </UButton>
      </div>
    </template>
  </USlideover>
</template>
