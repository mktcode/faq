<script setup lang="ts">
import { marked } from 'marked'
import type { ResponseStreamEvent } from 'openai/resources/responses/responses.mjs'
import sanitizeHtml from 'sanitize-html'

const showModal = useState('showAssistantModal', () => false)
const showAssistantTipsModal = useState('showAssistantTipsModal', () => false)
const showAssistantContextModal = useState('showAssistantContextModal', () => false)

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
  nextMessageIndex,
  error,
  previousResponseId,
  parseActivity,
  parseError,
  parseResponseId,
  parseNextMessageId,
  parseMessageDelta,
  generateResponse
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
    handleResponseEvents
  )
}
</script>

<template>
  <USlideover
    v-model:open="showModal"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
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
        @click="showAssistantContextModal = !showAssistantContextModal"
      />
      <UButton
        icon="i-lucide-lightbulb"
        color="neutral"
        variant="ghost"
        size="md"
        @click="showAssistantTipsModal = !showAssistantTipsModal"
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
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="border-b last:border-b-0 border-gray-200 p-4"
        >
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
        <Transition name="fade">
          <div
            v-if="currentActivity"
            class="text-gray-400 flex items-center justify-center gap-2 p-4"
          >
            <UIcon
              name="i-lucide-loader-circle"
              class="inline-block size-5 animate-spin"
            />
            <span class="animate-pulse italic">{{ currentActivity.label }}</span>
          </div>
        </Transition>
        <Transition name="fade">
          <div
            v-if="messages.length === 0"
            class="p-4 flex flex-col gap-1 mt-auto"
          >
            <UButton
              label="Befrage mich zu meinem Unternehmen."
              color="neutral"
              variant="outline"
              class="w-full"
              icon="i-lucide-message-circle-question-mark"
              trailing-icon="i-lucide-arrow-down"
              size="md"
              :ui="{
                trailingIcon: 'ml-auto opacity-40',
              }"
              @click="userInput = 'Befrage mich zu meinem Unternehmen und lass uns gemeinsam den Unternehmenskontext aufbauen.'"
            />
            <UButton
              label="Erzähle mir einen Witz über Online-Marketing."
              color="neutral"
              variant="outline"
              class="w-full"
              icon="i-lucide-smile"
              trailing-icon="i-lucide-arrow-down"
              size="md"
              :ui="{
                trailingIcon: 'ml-auto opacity-40',
              }"
              @click="userInput = 'Erzähle mir einen Witz über Online-Marketing.'"
            />
            <UButton
              label="Lass uns die Angebotstexte bearbeiten."
              color="neutral"
              variant="outline"
              class="w-full"
              icon="i-lucide-edit-2"
              trailing-icon="i-lucide-arrow-down"
              size="md"
              :ui="{
                trailingIcon: 'ml-auto opacity-40',
              }"
              @click="userInput = 'Lass uns die Angebotstexte bearbeiten.'"
            />
            <UButton
              label="Erstelle einen Post für Social Media mit Bild."
              color="neutral"
              variant="outline"
              class="w-full"
              icon="i-lucide-image-plus"
              trailing-icon="i-lucide-arrow-down"
              size="md"
              :ui="{
                trailingIcon: 'ml-auto opacity-40',
              }"
              @click="userInput = 'Erstelle ein Bild für Social Media.'"
            />
            <UButton
              label="Wie ändere ich das Bild oben?"
              color="neutral"
              variant="outline"
              class="w-full"
              icon="i-lucide-book-open-text"
              trailing-icon="i-lucide-arrow-down"
              size="md"
              :ui="{
                trailingIcon: 'ml-auto opacity-40',
              }"
              @click="userInput = 'Wie ändere ich das Bild oben?'"
            />
          </div>
        </Transition>
      </div>
      <ProfileAdminAssistantModalContextSettings />
      <ProfileAdminAssistantModalTips />
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
              label: 'px-4 pt-4'
            }"
          >
            <WysiwygEditor
              v-model="contentFormContent"
              class="w-full rounded-none"
              rounded="none"
            />
          </UFormField>
          <div v-if="contentFormType === 'offer'" class="p-1 flex items-center gap-2 justify-end">
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
          <ProfileAdminAssistantModalRecordAudio
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
