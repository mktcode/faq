<script setup lang="ts">
import type { WootConversation } from '~~/types/chatwoot'

const { showSupportLiveChat, showSupportLiveChatConversation, go } = useAdmin()
const router = useRouter()

const userInput = ref('')
const isSendingResponse = ref(false)
const conversations = ref<WootConversation[]>([])

const { currentConversationId } = useLiveChat()

async function fetchConversations() {
  const { conversations: fetchedConversations } = await $fetch('/api/user/livechat/list-conversations')
  conversations.value = fetchedConversations
}

function selectConversation(conversationId: number) {
  currentConversationId.value = conversationId
  router.push({ hash: '#support/livechat/conversation' })
}

async function submit() {
  if (!userInput.value) return

  isSendingResponse.value = true

  try {
    const { conversationId } = await $fetch('/api/user/livechat/conversation', {
      method: 'POST',
      body: {
        message: userInput.value,
      },
    })
    userInput.value = ''
    selectConversation(conversationId)
    fetchConversations()
  }
  catch (error) {
    console.error('Error sending message:', error)
  }
  finally {
    isSendingResponse.value = false
  }
}

const fetchConversationsInterval = ref<NodeJS.Timeout | null>(null)

onMounted(() => {
  fetchConversations()
  fetchConversationsInterval.value = setInterval(fetchConversations, 60000)
})

onBeforeUnmount(() => {
  if (fetchConversationsInterval.value) {
    clearInterval(fetchConversationsInterval.value)
  }
})

watch(showSupportLiveChatConversation, (newValue, oldValue) => {
  if (oldValue === true && newValue === false) {
    fetchConversations()
  }
})
</script>

<template>
  <USlideover
    :open="showSupportLiveChat"
    side="right"
    :overlay="false"
    close-icon="i-heroicons-arrow-left"
    :close="{
      size: 'md',
      onClick: () => {
        go('#support')
      },
    }"
    :ui="{
      wrapper: 'z-40',
      footer: '!p-0 flex-col',
      body: '!p-0',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-messages-square"
          class="inline-block size-6 opacity-50"
        />
        Live-Chat
      </h3>
    </template>

    <template #body>
      <div
        v-if="conversations.length === 0"
        class="p-4 text-center text-gray-500"
      >
        Keine bisherigen Konversationen.
      </div>
      <ProfileAdminSupportLiveChatConversationListItem
        v-for="conversation in conversations"
        :key="conversation.id"
        :conversation="conversation"
      />
    </template>

    <template #footer>
      <div class="flex flex-col w-full">
        <UTextarea
          v-model="userInput"
          placeholder="Ihre Nachricht..."
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
            @transcript="(transcript: string) => userInput = transcript"
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

      <ProfileAdminSupportLiveChatConversation />
    </template>
  </USlideover>
</template>
