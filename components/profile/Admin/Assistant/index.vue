<script setup lang="ts">
import type { ResponseStreamEvent } from 'openai/resources/responses/responses.mjs'

const { showAssistant } = useAdmin()
const router = useRouter()

const quota = useState('assistantQuota', () => 12)
const userInput = ref('')
const messagesContainer = ref<HTMLDivElement | null>(null)
function scrollToBottom() {
  messagesContainer.value?.scrollTo(0, messagesContainer.value.scrollHeight)
}

const showContentForm = ref(false)
const contentFormType = ref<'offer' | 'post' | 'other'>('offer')
const contentFormContent = ref<string>('')
const contentFormContentId = ref<string | null>(null)

const {
  isGeneratingResponse,
  currentActivity,
  messages,
  error,
  previousResponseId,
  parseActivity,
  parseError,
  parseResponseId,
  parseNextMessageId,
  parseMessageDelta,
  generateResponse,
} = useAssistant()

async function handleResponseEvents(event: ResponseStreamEvent) {
  parseError(event)
  parseResponseId(event)
  parseActivity(event)
  parseNextMessageId(event)
  parseMessageDelta(event)

  scrollToBottom()
}

function submit() {
  messages.value.push({ role: 'user', content: userInput.value })
  scrollToBottom()
  generateResponse(
    '/api/user/assistant/respond',
    {
      userInput: userInput.value,
      responseId: previousResponseId.value || undefined,
    },
    handleResponseEvents,
  )
}
</script>

<template>
  <USlideover
    v-model:open="showAssistant"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :ui="{
      body: '!p-0 flex flex-col overflow-y-hidden',
      footer: '!p-0 flex-col',
      title: 'flex items-center gap-2 flex-1',
      header: '*:first:flex-1 *:first:pr-8',
    }"
    :close="{
      size: 'md',
    }"
  >
    <template #title>
      <UIcon
        name="i-lucide-bot"
        class="inline-block size-6 opacity-50"
      />
      Assistent
      <UButton
        icon="i-lucide-settings"
        color="neutral"
        variant="ghost"
        class="ml-auto"
        size="md"
  @click="router.push({ hash: '#assistant/context' })"
      />
      <UButton
        icon="i-lucide-lightbulb"
        color="neutral"
        variant="ghost"
        size="md"
  @click="router.push({ hash: '#assistant/tips' })"
      />
    </template>

    <template #body>
      <DismissableAlert
        title="Ihr persönlicher Assistent"
        icon="i-lucide-info"
        storage-key="assistant-info-dismissed"
        class="rounded-none"
      >
        Ihr Assistent kennt Ihre Website und damit auch Ihr Unternehmen.
        Weitere Informationen können Sie im <strong>Unternehmenskontext</strong> hinzufügen.
        Der Balken am unteren Bildschirmrand zeigt Ihr aktuelles Kontingent an.
        Lesen Sie die Tipps, um mehr über die Funktionen des Assistenten zu erfahren.
      </DismissableAlert>

      <UAlert
        v-if="error"
        title="Ups! Etwas ist schiefgelaufen."
        color="error"
        variant="soft"
        icon="i-lucide-alert-circle"
        class="rounded-none"
        :description="error"
        :closable="true"
        @close="error = null"
      />

      <div
        ref="messagesContainer"
        class="flex flex-col flex-1 overflow-y-auto"
      >
        <ProfileAdminAssistantMessage
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
        />
        <Transition name="fade">
          <ProfileAdminAssistantActivity
            v-if="currentActivity"
            :current-activity="currentActivity"
          />
        </Transition>
        <Transition name="fade">
          <ProfileAdminAssistantInputSuggestions
            v-if="messages.length === 0"
            @update:user-input="userInput = $event"
          />
        </Transition>
      </div>
      <ProfileAdminAssistantContextSettings />
      <ProfileAdminAssistantTips />
    </template>

    <template #footer>
      <div class="flex flex-col w-full">
        <div
          v-if="showContentForm"
          class="w-full"
        >
          <UFormField
            :label="contentFormType === 'offer' ? 'Angebot' : contentFormType === 'post' ? 'Post' : 'Textbearbeitung'"
            :ui="{
              label: 'px-4 pt-4',
            }"
          >
            <WysiwygEditor
              v-model="contentFormContent"
              class="w-full rounded-none"
              rounded="none"
            />
          </UFormField>
          <div
            v-if="contentFormType === 'offer'"
            class="p-1 flex items-center gap-2 justify-end"
          >
            <UButton
              :label="`Angebot ${contentFormContentId ? 'speichern' : 'erstellen'}`"
              size="md"
            />
          </div>
        </div>
        <UTextarea
          v-model="userInput"
          placeholder="Frage an den Assistenten..."
          class="w-full"
          autoresize
          :disabled="isGeneratingResponse"
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
            :disabled="isGeneratingResponse"
          />
          <ProfileAdminAssistantRecordAudio
            class="ml-auto"
            @transcript="transcript => userInput = transcript"
          />
          <UButton
            icon="i-lucide-send-horizontal"
            color="primary"
            :loading="isGeneratingResponse"
            :disabled="isGeneratingResponse || !userInput"
            @click="submit"
          />
        </div>
      </div>
      <UProgress
        v-model="quota"
        :ui="{ base: 'rounded-none' }"
      />
    </template>
  </USlideover>
</template>
