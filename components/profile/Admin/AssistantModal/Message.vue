<script setup lang="ts">
import sanitizeHtml from 'sanitize-html'
import { marked } from 'marked'

defineProps<{
  message: {
    role: 'user' | 'assistant'
    content: string
  }
}>()
</script>

<template>
  <div class="border-b last:border-b-0 border-gray-200 p-4">
    <div class="font-semibold flex mb-1">
      <UIcon
        :name="message.role === 'user' ? 'i-lucide-user' : 'i-lucide-bot'"
        class="inline-block size-5 mr-2"
      />
      {{ message.role === 'user' ? 'Sie' : 'Assistent' }}
    </div>
    <div
      class="prose-sm prose-gray"
      v-html="sanitizeHtml(marked.parse(message.content, { async: false }))"
    />
  </div>
</template>