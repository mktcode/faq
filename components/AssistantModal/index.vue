<script setup lang="ts">
import { marked } from 'marked'
import type OpenAI from 'openai'
import sanitizeHtml from 'sanitize-html'

const showModal = useState('showAssistantModal', () => false)
const { privateSettings, isSavingPrivateSettings, savePrivateSettings, refreshPrivateSettings } = await usePrivateSettings()

const editInfoOpen = ref(false)

const quota = useState('assistantQuota', () => 12)
const userInput = ref('')
const isGeneratingResponse = ref(false)
const response = ref<OpenAI.Responses.Response | null>(null)

async function generateResponse() {
  if (isGeneratingResponse.value) return
  isGeneratingResponse.value = true

  try {
    response.value = await $fetch('/api/user/assistant/respond', {
      method: 'POST',
      body: {
        userInput: userInput.value,
        responseId: response.value?.id || undefined,
      },
    })
    refreshPrivateSettings()
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
        <UCollapsible
          v-if="privateSettings"
          v-model:open="editInfoOpen"
          class="flex flex-col gap-2"
          :ui="{
            root: 'border border-primary-500 rounded-lg',
            content: 'flex flex-col gap-2 px-3 pb-3',
          }"
        >
          <UButton
            label="Kontext bearbeiten"
            color="primary"
            variant="link"
            trailing-icon="i-heroicons-chevron-down"
            :ui="{
              trailingIcon: `ml-auto transition-transform ${editInfoOpen ? 'rotate-180' : ''}`,
            }"
          />

          <template #content>
            <UTextarea
              v-model="privateSettings.assistant.context"
              placeholder="Kontext"
              class="w-full"
              autoresize
              :rows="2"
              :maxrows="10"
              :ui="{
                base: 'text-sm',
              }"
            />

            <UButton
              label="Speichern"
              :loading="isSavingPrivateSettings"
              @click="savePrivateSettings"
            />
          </template>
        </UCollapsible>
        <div
          v-if="response"
          class="mt-4 prose-sm"
          v-html="sanitizeHtml(marked.parse(response.output_text, { async: false }))"
        />
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
    </template>
  </USlideover>
</template>
