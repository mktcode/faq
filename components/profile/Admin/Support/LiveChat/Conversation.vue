<script setup lang="ts">
import type { WootConversation } from '~/types/chatwoot'

const toast = useToast()

const { showSupportLiveChatConversation, go } = useAdmin()

const userInput = ref('')
const isSendingResponse = ref(false)
const conversation = ref<WootConversation | null>(null)
const showDeleteModal = ref(false)

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
  }
  catch (error) {
    console.error('Error sending message:', error)
    toast.add({
      title: 'Fehler',
      icon: 'i-heroicons-exclamation-circle',
      description: 'Nachricht konnte nicht gesendet werden.',
      color: 'error',
      progress: false
    })
  }
  finally {
    isSendingResponse.value = false
  }
}

async function deleteConversation() {
  if (currentConversationId.value === null) return

  try {
    await $fetch(`/api/user/livechat/conversation/${currentConversationId.value}/delete`, {
      method: 'POST',
    })
    conversation.value = null
    currentConversationId.value = null
    go('#support/livechat')
    showDeleteModal.value = false
    toast.add({
      title: 'Erfolg',
      icon: 'i-heroicons-check',
      description: 'Unterhaltung wurde erfolgreich gelöscht.',
      progress: false
    })
  }
  catch (error) {
    console.error('Error deleting conversation:', error)
    toast.add({
      title: 'Fehler',
      icon: 'i-heroicons-exclamation-circle',
      description: 'Unterhaltung konnte nicht gelöscht werden.',
      color: 'error',
      progress: false
    })
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
    :open="showSupportLiveChatConversation"
    side="right"
    :overlay="false"
    close-icon="i-heroicons-arrow-left"
    :close="{
      size: 'md',
      onClick: () => {
        go('#support/livechat')
      }
    }"
    :ui="{
      header: '*:first:flex-1 *:first:pr-8',
      title: 'flex items-center gap-2 flex-1',
      body: '!p-0',
      footer: '!p-0 flex-col',
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
      <UButton
        icon="i-heroicons-trash"
        variant="ghost"
        color="neutral"
        class="ml-auto"
        size="md"
        :disabled="!conversation"
        @click="showDeleteModal = true"
      />
      <ProfileAdminSupportLiveChatConversationDelete
        v-if="conversation"
        v-model:open="showDeleteModal"
        :conversation="conversation"
        @delete="deleteConversation"
      />
    </template>

    <template #body>
      <template v-if="conversation">
        <TransitionGroup name="list">
          <div
            v-for="message in conversation.messages"
            :key="message.id"
            class="p-2 m-2 rounded-lg break-words"
            :class="{
              'bg-primary-600 text-primary-100': message.sender.type === 'user',
            }"
          >
            <div class="text-sm opacity-70 mb-1">
              {{ message.sender.type === 'contact' ? 'Sie' : 'Support' }} - {{ new Date(message.created_at * 1000).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) }}
            </div>
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
