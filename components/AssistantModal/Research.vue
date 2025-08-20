<script setup lang="ts">
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

const showModal = useState('showAssistantResearchModal', () => false)
const showAssistantTipsModal = useState('showAssistantTipsModal', () => false)
const showAssistantContextModal = useState('showAssistantContextModal', () => false)
const { refreshPrivateSettings } = await usePrivateSettings()

const quota = useState('assistantQuota', () => 12)

const topic = ref('Versicherungen für Hausmeister')
const question = ref('Welche einfachen Versicherungen brauche ich als frisch gestarteter Hausmeister, um abgesichert zu sein, ohne gleich zu viel Geld auszugeben?')
const purpose = ref('Ich möchte wissen, was ich wirklich brauche, damit ich abgesichert bin, und was ich mir am Anfang sparen kann, weil ich noch nicht so viel verdiene.')
const depth = ref<'shallow' | 'deep'>('shallow')
const userInstructions = ref('')
const steps = ref<string[]>([])
const stepsDone = ref<boolean[]>([])

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
        topic: topic.value,
        question: question.value,
        purpose: purpose.value,
        depth: depth.value,
        userInstructions: userInstructions.value,
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
            } catch (error) {
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
    refreshPrivateSettings()
  }
  catch (error) {
    console.error('Error generating response:', error)
  }
  finally {
    isGeneratingResponse.value = false
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

      <div
        ref="reportContainer"
        class="flex flex-col flex-1 overflow-y-auto"
      >
        <div
          v-if="steps.length"
          class="flex flex-col gap-2 p-4 bg-gray-50 border-t border-gray-200 text-gray-400 text-xs"
        >
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex items-center gap-2"
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
            v-html="sanitizeHtml(marked.parse(report, { async: false }))"
          />
        </div>
      </div>

      <AssistantModalContextSettings />
      <AssistantModalTips />
    </template>

    <template #footer>
      <div class="flex flex-col w-full">
        <div class="flex flex-col">
          
          <UInput
            v-model="topic"
            placeholder="Thema"
            class="w-full"
            :ui="{
              base: 'rounded-none border-gray-200/80 border-b',
            }"
          />
        
          <UInput
            v-model="question"
            placeholder="Fragestellung"
            class="w-full"
            :ui="{
              base: 'rounded-none border-gray-200/80 border-b',
            }"
          />
          
          <UInput
            v-model="purpose"
            placeholder="Zweck der Recherche"
            class="w-full"
            :ui="{
              base: 'rounded-none border-gray-200/80 border-b',
            }"
          />

          <USelect
            v-model="depth"
            class="w-full"
            :items="[
              {
                label: 'Oberflächlich',
                value: 'shallow'
              },
              {
                label: 'Ausführlich',
                value: 'deep'
              }
            ]"
            :ui="{
              base: 'rounded-none border-gray-200/80 border-b',
            }"
          />
        </div>
        <UTextarea
          v-model="userInstructions"
          placeholder="Zusätzliche Anweisungen und Hinweise..."
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
          <AssistantModalRecordAudio
            class="ml-auto"
            @transcript="transcript => userInstructions = transcript"
          />
          <UButton
            icon="i-lucide-send-horizontal"
            color="primary"
            :loading="isGeneratingResponse"
            :disabled="isGeneratingResponse || !topic || !question"
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
