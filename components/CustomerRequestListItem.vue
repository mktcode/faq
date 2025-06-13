<script setup lang="ts">
import type { CustomerRequest } from '~/types/db'

const { customerRequest } = defineProps<{ customerRequest: CustomerRequest }>()

const replyMessage = ref('')

const isGeneratingReply = ref(false)

async function generateReply() {
  isGeneratingReply.value = true

  const response = await $fetch('/api/user/customerRequests/generateReply', {
    query: {
      customerRequestId: customerRequest.id,
    },
  })

  replyMessage.value = response

  isGeneratingReply.value = false
}
</script>

<template>
  <div class="p-4 border border-gray-200 rounded-lg">
    <h4 class="font-semibold">
      {{ customerRequest.name }}
      <span class="text-gray-400 text-sm ml-2">
        Am {{ new Date(customerRequest.createdAt).toLocaleDateString() }}
      </span>
    </h4>
    <div class="text-gray-600 my-2">
      {{ customerRequest.message }}
    </div>
    <div class="text-gray-400">
      <p>{{ customerRequest.email }}</p>
      <p>{{ customerRequest.phone }}</p>
    </div>
    <div class="mt-4">
      <UTextarea
        v-model="replyMessage"
        placeholder="Ihre Antwort hier eingeben..."
        class="w-full"
      />
      <div class="mt-2 flex gap-2 justify-between">
        <UButton
          label="Antwort vorschlagen"
          icon="i-heroicons-sparkles"
          variant="soft"
          :loading="isGeneratingReply"
          :disabled="isGeneratingReply"
          @click="generateReply"
        />
        <UButton
          label="Antwort senden"
          :disabled="!replyMessage.trim() || isGeneratingReply"
          @click="() => { /* Logik zum Senden der Antwort */ }"
        />
      </div>
    </div>
  </div>
</template>
