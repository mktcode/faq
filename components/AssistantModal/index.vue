<script setup lang="ts">
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

const showModal = useState('showAssistantModal', () => false)
const showAssistantTipsModal = useState('showAssistantTipsModal', () => false)
const showAssistantContextModal = useState('showAssistantContextModal', () => false)
const { refreshPrivateSettings } = await usePrivateSettings()

const quota = useState('assistantQuota', () => 12)
const userInput = ref('')
const isGeneratingResponse = ref(false)
const previousResponseId = ref<string | null>(null)
const currentActivity = ref<string | null>(null)
const messages = ref<{ role: 'user' | 'assistant', content: string }[]>([
  // { role: 'user', content: 'Erzähle mir einen Witz.' },
  // { role: 'assistant', content: 'Warum können Elefanten nicht Fliegen? Weil sie zu schwer sind!' },
])
const messagesContainer = ref<HTMLDivElement | null>(null)
function scrollToBottom() {
  messagesContainer.value?.scrollTo(0, messagesContainer.value.scrollHeight)
}

async function generateResponse() {
  if (isGeneratingResponse.value) return
  isGeneratingResponse.value = true

  messages.value.push({ role: 'user', content: userInput.value })
  scrollToBottom()

  try {
    const responseStream = await fetch('/api/user/assistant/respond', {
      method: 'POST',
      body: JSON.stringify({
        userInput: userInput.value,
        responseId: previousResponseId.value || undefined,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!responseStream.body) {
      throw new Error(responseStream.statusText)
    }

    const responseStreamReader = responseStream.body.getReader()
    let nextMessageIndex: number | null = null

    await readResponseStream(responseStreamReader, (event) => {
      console.log('ResponseEvent', event)
      if (event.type === 'response.created') {
        previousResponseId.value = event.response.id
      }

      if (event.type === 'response.output_item.added') {
        if (event.item.type === 'reasoning') {
          currentActivity.value = 'Denke nach...'
        }
        if (event.item.type === 'web_search_call') {
          currentActivity.value = 'Suche im Internet...'
        }
        if (event.item.type === 'function_call') {
          if (event.item.name === 'tell_joke') {
            currentActivity.value = 'Denke Witz aus...'
          }
          if (event.item.name === 'ask_website_manual_assistant') {
            currentActivity.value = 'Lese Website-Handbuch...'
          }
          if (event.item.name === 'update_company_context') {
            currentActivity.value = 'Aktualisiere Unternehmenskontext...'
          }
        }
        if (event.item.type === 'message') {
          currentActivity.value = null
          messages.value.push({ role: 'assistant', content: '' })
          nextMessageIndex = messages.value.length - 1
        }
      }

      if (event.type === 'response.output_text.delta') {
        if (!nextMessageIndex) {
          throw new Error('No next message index found. Event order may be incorrect.')
        }

        messages.value[nextMessageIndex].content += event.delta
      }

      if (event.type === 'response.web_search_call.in_progress') {
        currentActivity.value = 'Web-Suche läuft...'
      }

      scrollToBottom()
    }, () => {
      isGeneratingResponse.value = false
    })
    refreshPrivateSettings()
  }
  catch (error) {
    console.error('Error generating response:', error)
  }
  finally {
    isGeneratingResponse.value = false
    userInput.value = ''
    currentActivity.value = null
  }
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
            <span class="animate-pulse italic">{{ currentActivity }}</span>
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
              @click="userInput = 'Befrage mich zu meinem Unternehmen.'"
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
              label="Verbessere meine Angebotstexte."
              color="neutral"
              variant="outline"
              class="w-full"
              icon="i-lucide-edit-2"
              trailing-icon="i-lucide-arrow-down"
              size="md"
              :ui="{
                trailingIcon: 'ml-auto opacity-40',
              }"
              @click="userInput = 'Verbessere meine Angebotstexte.'"
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
      <AssistantModalContextSettings />
      <AssistantModalTips />
    </template>

    <template #footer>
      <div class="flex flex-col w-full">
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
          <AssistantModalRecordAudio
            class="ml-auto"
            @transcript="transcript => userInput = transcript"
          />
          <UButton
            icon="i-lucide-send-horizontal"
            color="primary"
            :loading="isGeneratingResponse"
            :disabled="isGeneratingResponse || !userInput"
            @click="generateResponse"
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
