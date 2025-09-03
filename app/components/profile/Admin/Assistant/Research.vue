<script setup lang="ts">
import { marked } from 'marked'

const showModal = useState('showAssistantResearchModal', () => false)
const showAssistantTipsModal = useState('showAssistantTipsModal', () => false)
const showAssistantContextModal = useState('showAssistantContextModal', () => false)

const quota = useState('assistantQuota', () => 12)

const userInput = ref('')
const steps = ref<string[]>([])
const showSteps = ref(true)
const stepsDone = ref<boolean[]>([])
const deepResearch = ref(false)
watch(stepsDone.value, (newVal) => {
  if (newVal.filter(Boolean).length === steps.value.length) {
    showSteps.value = false
  }
})

const isGeneratingResponse = ref(false)
const currentActivity = ref<string | null>(null)
const report = ref('')

const reportContainer = ref<HTMLDivElement | null>(null)

async function generateResponse() {
  if (isGeneratingResponse.value) return
  isGeneratingResponse.value = true
  currentActivity.value = 'Lese Rechercheauftrag...'

  try {
    const responseStream = await fetch('/api/user/assistant/research', {
      method: 'POST',
      body: JSON.stringify({
        userInput: userInput.value,
        deepResearch: deepResearch.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!responseStream.body) {
      throw new Error(responseStream.statusText)
    }

    const responseStreamReader = responseStream.body.getReader()

    await readResponseStream(responseStreamReader, (event) => {
      if (event.type === 'response.created') {
        const metadata = event.response.metadata
        if (metadata?.step && typeof metadata.step === 'string') {
        }
      }
      if (event.type === 'response.completed') {
        const metadata = event.response.metadata
        if (metadata?.step && typeof metadata.step === 'string') {
          stepsDone.value[Number(metadata.step)] = true
        }
      }

      if (event.type === 'response.output_item.added') {
        if (event.item.type === 'reasoning') {
          currentActivity.value = 'Denke nach...'
        }
        if (event.item.type === 'web_search_call') {
          currentActivity.value = 'Suche im Internet...'
        }
        if (event.item.type === 'function_call') {
          if (event.item.name === 'break_down_research') {
            currentActivity.value = 'Unterteile die Recherche...'
          }
        }
        if (event.item.type === 'message') {
          if (stepsDone.value.length < steps.value.length) {
            currentActivity.value = `Verarbeite Schritt ${stepsDone.value.length + 1} von ${steps.value.length}...`
          }
          else {
            currentActivity.value = null
          }
        }
      }

      if (event.type === 'response.output_item.done') {
        if (event.item.type === 'function_call') {
          if (event.item.name === 'break_down_research') {
            let functionArguments: Record<string, any> = {}
            try {
              functionArguments = JSON.parse(event.item.arguments)
            }
            catch (error) {
              console.error('Error parsing arguments:', error)
            }

            steps.value.push(...functionArguments.steps)
          }
        }
      }

      if (event.type === 'response.output_text.delta' && stepsDone.value.length === steps.value.length) {
        report.value += event.delta
      }
    }, () => {
      isGeneratingResponse.value = false
    })
  }
  catch (error) {
    console.error('Error generating response:', error)
  }
  finally {
    isGeneratingResponse.value = false
    currentActivity.value = null
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
        name="i-lucide-search"
        class="inline-block size-6 opacity-50"
      />
      Recherche
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

      <UCollapsible
        v-if="steps.length"
        v-model:open="showSteps"
        class="flex flex-col gap-2"
        :ui="{
          root: 'border-b border-gray-200',
          content: 'p-3 flex flex-col gap-2 text-sm',
        }"
      >
        <UButton
          :label="stepsDone.filter(Boolean).length === steps.length ? 'Alle Schritte abgeschlossen' : `${stepsDone.filter(Boolean).length}/${steps.length}: ${steps[stepsDone.filter(Boolean).length]}`"
          color="neutral"
          variant="link"
          trailing-icon="i-heroicons-chevron-down"
        >
          <template #leading>
            <UIcon
              v-if="stepsDone.filter(Boolean).length === steps.length"
              name="i-heroicons-check-circle"
              class="inline-block text-green-600 size-5 shrink-0"
            />
            <UIcon
              v-else
              name="i-lucide-loader-2"
              class="inline-block text-gray-400 size-5 animate-spin shrink-0"
            />
          </template>
          <template #trailing>
            <div class="ml-auto flex items-center gap-2">
              <UIcon
                name="i-heroicons-chevron-down"
                class="transition-transform"
                :class="{ 'rotate-180': showSteps }"
              />
            </div>
          </template>
        </UButton>

        <template #content>
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex gap-2"
          >
            <UIcon
              :name="`${stepsDone[index] ? 'i-lucide-check-circle' : 'i-lucide-loader-2'}`"
              class="inline-block size-5 shrink-0"
              :class="stepsDone[index] ? 'text-green-600' : 'text-gray-400 animate-spin'"
            />
            <span :class="{ 'text-gray-600': stepsDone[index] }">
              {{ step }}
            </span>
          </div>
        </template>
      </UCollapsible>

      <div
        ref="reportContainer"
        class="flex flex-col flex-1 overflow-y-auto"
      >
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
        <div
          v-if="report"
          class="border-b last:border-b-0 border-gray-200 p-4"
        >
          <div class="font-semibold flex mb-1">
            <UIcon
              name="i-lucide-file-text"
              class="inline-block size-5 mr-2"
            />
            Bericht
          </div>
          <div
            class="prose prose-sm prose-sky"
            v-html="marked.parse(report, { async: false })"
          />
        </div>
      </div>

      <ProfileAdminAssistantContextSettings />
      <ProfileAdminAssistantTips />
    </template>

    <template #footer>
      <div class="flex flex-col w-full">
        <UTextarea
          v-model="userInput"
          placeholder="Ihr Rechercheauftrag"
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
          <USwitch
            v-model="deepResearch"
            label="Ausführliche Recherche"
          />
          <ProfileAdminAssistantRecordAudio
            class="ml-auto"
            @transcript="(transcript: string) => userInput = transcript"
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
