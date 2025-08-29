<script setup lang="ts">
import type { WootConversation } from '~/types/chatwoot'

const { showSupportLiveChatConversation } = useAdmin()

const userInput = ref('')
const isSendingResponse = ref(false)
const conversation = ref<WootConversation | null>(null)

const { currentConversationId } = useLiveChat()

const fetchInterval = ref<NodeJS.Timeout | null>(null)

async function fetchConversation() {
  if (currentConversationId.value === null) return
  
  const { conversation: fetchedConversation } = await $fetch(`/api/user/livechat/conversation/${currentConversationId.value}`)
  conversation.value = fetchedConversation
}

async function submit() {
  if (!userInput.value) return

  isSendingResponse.value = true

  try {
    await $fetch(`/api/user/livechat/conversation/${currentConversationId.value}/message`, {
      method: 'POST',
      body: {
        message: userInput.value,
      },
    })
    fetchConversation()
    userInput.value = ''
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    isSendingResponse.value = false
  }
}

watch(currentConversationId, (newId) => {
  if (newId !== null) {
    fetchConversation()
  }
})

onMounted(() => {
  fetchConversation()
  fetchInterval.value = setInterval(fetchConversation, 15000)
})

onBeforeUnmount(() => {
  if (fetchInterval.value) {
    clearInterval(fetchInterval.value)
  }
})
</script>

<template>
  <USlideover
    v-model:open="showSupportLiveChatConversation"
    side="right"
    :overlay="false"
    close-icon="i-heroicons-arrow-left"
    :close="{
      size: 'md',
    }"
    :ui="{
      wrapper: 'z-40',
      footer: '!p-0 flex-col',
      body: '!p-0',
    }"
    @after:leave="conversation = null; currentConversationId = null"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-messages-square"
          class="inline-block size-6 opacity-50"
        />
        Unterhaltung
      </h3>
    </template>

    <template #body>
      <template v-if="conversation">
        <TransitionGroup name="list">
          <div
            v-for="message in conversation.messages"
            :key="message.id"
            :class="{
              'bg-gray-300 text-gray-800': message.sender.type === 'user',
            }"
          >
            {{ message.sender.type === 'user' ? 'Sie' : 'Support' }} - {{ new Date(message.created_at).toLocaleString() }}
            {{ message.content }}
          </div>
        </TransitionGroup>
      </template>
      <div v-else>
        <div class="flex justify-center items-center h-24">
          <UIcon
            name="i-lucide-loader-2"
            class="inline-block size-6 opacity-50 animate-spin"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col w-full">
        <UTextarea
          v-model="userInput"
          placeholder="Wie können wir Ihnen helfen?"
          class="w-full"
          autoresize
          :disabled="isSendingResponse"
          :rows="3"
          :maxrows="10"
          :ui="{
            base: 'rounded-none border-gray-200',
          }"
        />
        <div class="p-2 flex items-center gap-2">
          <UButton
            icon="i-lucide-camera"
            variant="soft"
            :disabled="isSendingResponse"
          />
          <ProfileAdminAssistantRecordAudio
            class="ml-auto"
            @transcript="transcript => userInput = transcript"
          />
          <UButton
            icon="i-lucide-send-horizontal"
            color="primary"
            :loading="isSendingResponse"
            :disabled="isSendingResponse || !userInput"
            @click="submit"
          />
        </div>
      </div>
    </template>
  </USlideover>
</template>