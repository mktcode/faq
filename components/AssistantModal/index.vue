<script setup lang="ts">
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

const showModal = useState('showAssistantModal', () => false)

const quota = useState('assistantQuota', () => 12)
const userInput = ref('')
const isGeneratingResponse = ref(false)
const messages = ref<{ role: 'user' | 'assistant', content: string }[]>([])

async function generateResponse() {
  if (isGeneratingResponse.value) return
  isGeneratingResponse.value = true

  try {
    messages.value.push({
      role: 'user',
      content: userInput.value,
    })
    userInput.value = ''

    const response = await $fetch('/api/user/assistant/respond', {
      method: 'POST',
      body: {
        messages: messages.value,
      },
    })

    messages.value.push({
      role: 'assistant',
      content: response.output_text,
    })
  }
  catch (error) {
    console.error('Error generating response:', error)
  }
  finally {
    isGeneratingResponse.value = false
    userInput.value = ''
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
      body: '!p-0',
    }"
    :close="{
      size: 'md',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-bot"
          class="inline-block size-6 opacity-50"
        />
        Assistent
      </h3>
    </template>

    <template #body>
      <DismissableAlert
        title="Ihr KI-Assistent"
        icon="i-lucide-info"
        storage-key="assistant-info-dismissed"
        class="rounded-none"
      >
        Ihr Assistent kennt Ihre Website und damit auch Ihr Unternehmen.
        Weitere Informationen können Sie hinzufügen, damit nicht immer wieder die selben Rückfragen kommen.
        Sie können Fragen stellen oder Änderungen an Ihrer Website besprechen und umsetzen lassen.
        Speichern Sie Ihre Eingaben als wiederverwendbare Vorlagen und nutzen Sie die mitgelieferten.
      </DismissableAlert>
      <UProgress
        v-model="quota"
        :ui="{ base: 'rounded-none' }"
      />
      <div class="p-4">
        <div class="flex flex-col gap-4">
          <UButton
            label="Informationen bearbeiten"
            icon="i-lucide-edit"
            color="neutral"
            variant="outline"
            class="w-full"
          />
        </div>
        <div class="flex flex-col gap-2 mt-4">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="p-2 bg-gray-100 rounded-lg"
          >
            <div class="text-sm text-gray-400 flex gap-2 items-center mb-2">
              <UIcon
                :name="message.role === 'user' ? 'i-lucide-user' : 'i-lucide-bot'"
                size="20"
              />
              <span>{{ message.role === 'user' ? 'Sie' : 'Assistent' }}</span>
            </div>
            <div
              class="prose text-sm"
              v-html="sanitizeHtml(marked.parse(message.content, { async: false }))"
            />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col w-full">
        <UTextarea
          v-model="userInput"
          placeholder="Frage an den Assistenten..."
          class="w-full"
          autoresize
          :rows="2"
          :maxrows="10"
          :ui="{
            base: 'rounded-b-none',
          }"
        />
        <div class="bg-gray-100 p-2 flex items-center gap-2 rounded-b-lg">
          <UButton
            v-if="messages.length > 0"
            label="Gesprächsverlauf leeren"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            @click="messages = []"
          />
          <AssistantModalRecordAudio
            class="ml-auto"
            @text="text => userInput = text"
          />
          <UButton
            icon="i-lucide-send-horizontal"
            color="primary"
            :disabled="isGeneratingResponse || !userInput"
            @click="generateResponse"
          />
        </div>
      </div>
    </template>
  </USlideover>
</template>
