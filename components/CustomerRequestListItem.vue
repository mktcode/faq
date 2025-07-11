<script setup lang="ts">
import type { CustomerRequest } from '~/types/db'

const { customerRequest } = defineProps<{ customerRequest: CustomerRequest }>()

const { me } = await useMe()

const { data: messages } = await useFetch('/api/user/customerRequests/messages', {
  query: {
    customerRequestId: customerRequest.id,
  },
})

const replyMessage = ref('')
const isGeneratingReply = ref(false)
const isSendingReply = ref(false)

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

async function reply() {
  if (!replyMessage.value.trim()) return

  isSendingReply.value = true

  await $fetch('/api/user/customerRequests/reply', {
    method: 'POST',
    body: {
      customerRequestId: customerRequest.id,
      replyMessage: replyMessage.value,
    },
  })

  isSendingReply.value = false
}

const designRounded = useState('designRounded')
</script>

<template>
  <div
    class="border border-gray-200"
    :class="{
      'rounded-xl': designRounded === 'xl',
      'rounded-md': designRounded === 'md',
      'rounded-none': designRounded === 'none',
    }"
  >
    <div class="p-4">
      <h4 class="font-semibold">
        {{ customerRequest.name }}
        <span class="text-gray-400 text-sm ml-2">
          Am {{ new Date(customerRequest.createdAt).toLocaleDateString() }}
        </span>
      </h4>
      <div
        v-for="message in messages"
        :key="message.id"
        class="text-gray-600 my-2 flex gap-2 py-2"
      >
        <UIcon
          :name="message.isCustomer ? 'i-heroicons-user' : 'i-heroicons-chat-bubble-left'"
          class="inline-block size-6 shrink-0"
        />
        <div class="flex flex-col gap-1">
          <span class="text-gray-400">
            {{ new Date(message.createdAt).toLocaleTimeString() }}
          </span>
          <div class="text-sm">
            {{ message.body }}
          </div>
        </div>
      </div>
    </div>
    <div class="text-gray-400 border-t border-gray-200 p-4 flex flex-col gap-2">
      <div
        v-if="customerRequest.phone"
        class="flex items-center"
      >
        <UIcon
          name="i-heroicons-phone"
          class="inline-block mr-2"
        />
        {{ customerRequest.phone }}
        <div class="ml-auto flex gap-2">
          <UButton
            label="anrufen"
            variant="soft"
            size="sm"
            class="ml-auto sm:hidden"
          />
          <UButton
            label="kopieren"
            icon="i-heroicons-document-duplicate"
            variant="soft"
            color="neutral"
            size="sm"
            class="ml-auto"
          />
        </div>
      </div>
      <div
        v-if="customerRequest.email"
        class="flex items-center"
      >
        <UIcon
          name="i-heroicons-envelope"
          class="inline-block mr-2"
        />
        {{ customerRequest.email }}
        <UButton
          label="kopieren"
          icon="i-heroicons-document-duplicate"
          variant="soft"
          color="neutral"
          size="sm"
          class="ml-auto"
        />
      </div>
    </div>
    <div>
      <UTextarea
        v-model="replyMessage"
        placeholder="Ihre Antwort hier eingeben..."
        class="w-full"
        :rows="6"
        :ui="{
          base: 'rounded-none',
        }"
      />
      <div class="flex flex-col gap-2 p-4">
        <UButton
          v-if="!replyMessage.trim() && me?.isSubscribed"
          label="Antwort vorschlagen"
          icon="i-heroicons-sparkles"
          variant="soft"
          :loading="isGeneratingReply"
          :disabled="isGeneratingReply"
          @click="generateReply"
        />
        <UButton
          label="Antwort senden"
          icon="i-heroicons-envelope"
          :disabled="!replyMessage.trim() || isGeneratingReply || isSendingReply"
          :loading="isSendingReply"
          @click="reply"
        />
      </div>
    </div>
  </div>
</template>
