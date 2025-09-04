<script setup lang="ts">
import type { WootConversation } from '~~/types/chatwoot';

const { go } = useAdmin()
const { currentConversationId } = useLiveChat()

const { conversation } = defineProps<{
  conversation: WootConversation
}>()

const latestMessage = computed(() => {
  return conversation.messages[conversation.messages.length - 1]
})

function selectConversation(conversationId: number) {
  currentConversationId.value = conversationId
  go('#support/livechat/conversation')
}

function renderDate(date: string | number | undefined) {
  if (!date) return ''

  const parsedDate = new Date(date)
  return parsedDate.toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })
}
</script>

<template>
  <UButton
    class="w-full rounded-none p-4 border-b border-gray-200"
    variant="ghost"
    color="neutral"
    trailing-icon="i-heroicons-chevron-right"
    :ui="{
      trailingIcon: 'ml-auto opacity-30',
    }"
    @click="selectConversation(conversation.id)"
  >
    <template #default>
      <div
        v-if="latestMessage"
        class="truncate text-left"
      >
        <div class="text-gray-500 text-xs">
          {{ renderDate(latestMessage.created_at) }}
        </div>
        {{ latestMessage.content || 'Keine Nachrichten' }}<br>
      </div>
    </template>
  </UButton>
</template>
