<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import type { HtmlComponentSchema } from '~~/types/db';

const toast = useToast()
const { uploadFiles, isUploading, uploadProgress } = useUpload()

const { component } = defineProps<{
  component: HtmlComponentSchema;
}>()

const showHtml = ref(false)
const showCss = ref(false)

watchDebounced(() => component.css, (newCss) => {
  // add or update a stylesheet to the document head with the css for this component
  const updatedCss = `#main #${component.key}-${component.id} {\n${newCss}\n}`
  const styleTagId = `html-component-style-${component.id}`
  const style = document.getElementById(styleTagId) as HTMLStyleElement | null
  if (style) {
    style.innerHTML = updatedCss
  } else {
    const newStyle = document.createElement('style')
    newStyle.id = styleTagId
    newStyle.innerHTML = updatedCss
    document.head.appendChild(newStyle)
  }
}, { debounce: 1500 })

const prompt = ref('')
const promptImages = ref<string[]>([])
const isGenerating = ref(false)
const previousResponseId = ref<string | undefined>(undefined)
const responseNotes = ref<string | null | undefined>(undefined)
const generationProgress = ref(0)

function randomProgressStep() {
  if (!isGenerating.value) return
  
  const progress = Math.floor(Math.random() * 5) + 1
  generationProgress.value = Math.min(100, generationProgress.value + progress)
  const interval = setTimeout(() => {
    if (generationProgress.value < 100) {
      randomProgressStep()
    }
  }, Math.floor(Math.random() * 12000) + 3000)
  return interval
}

async function generate() {
  if (!prompt.value) return

  isGenerating.value = true
  const interval = randomProgressStep()

  try {
    const { html, css, responseId, notes } = await $fetch('/api/user/generateHtml', {
      method: 'POST',
      body: {
        prompt: prompt.value,
        images: promptImages.value,
        html: component.html,
        css: component.css,
        responseId: previousResponseId.value,
      },
    })
    previousResponseId.value = responseId
    component.html = html
    component.css = css
    responseNotes.value = notes
    prompt.value = ''
  } catch (error) {
    toast.add({
      title: 'Fehler',
      icon: 'i-heroicons-exclamation-circle',
      description: 'Die Anweisung konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.',
      color: 'error',
      progress: false,
    })
  } finally {
    isGenerating.value = false

    generationProgress.value = 100
    clearInterval(interval)
    setTimeout(() => {
      generationProgress.value = 0
    }, 500)
  }
}

const uploadQueue = ref<File[]>([])

watch(uploadQueue, async (newFiles) => {
  if (newFiles.length > 0) {
    const { urls } = await uploadFiles(newFiles, '')
    promptImages.value.push(...urls)
    nextTick(() => {
      uploadQueue.value = []
    })
  }
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b border-gray-200">
      <div class="flex items-center gap-4 mb-4">
        <UFormField
          label="Titel der Sektion"
          class="flex-1"
        >
          <UInput
            v-model="component.title"
            placeholder="z.B. Mein Angebot"
            class="w-full"
          />
        </UFormField>
      </div>
  
      <div class="flex flex-col gap-2">
        <UFormField
          label="KI-Anweisung"
          description="Beschreiben Sie, was in dieser Sektion dargestellt bzw. geändert werden soll - sowohl textlich als auch optisch. Sie können auch Anweisungen für verschiedene Bildschirmgrößen geben (z.B. 'auf Mobilgeräten ist die Schrift zu groß.'). Sie können Sich auch auf andere Inhalte Ihrer Website beziehen und Dateien hochladen."
        >
          <UTextarea
            v-model="prompt"
            placeholder="Schreibe einen einleitenden Text für meine Angebote."
            class="w-full"
            :rows="3"
            :disabled="isGenerating"
            :ui="{
              base: 'rounded-b-none',
            }"
          />
          <div class="flex items-center gap-2 bg-gray-100 p-2 rounded-b-xl">
            <UButton
              v-if="prompt && !isGenerating"
              label="Eingabe löschen"
              icon="i-heroicons-x-mark"
              variant="ghost"
              @click="prompt = ''"
            />
            <ProfileAdminWebsiteHtmlRecordAudio
              class="ml-auto"
              @transcript="(transcript: string) => prompt = [prompt, transcript].filter(Boolean).join('\n')"
            />
          </div>
        </UFormField>

        <div v-if="promptImages.length" class="flex flex-wrap gap-2">
          <div
            v-for="(image, index) in promptImages"
            :key="index"
            class="relative size-24 rounded-lg overflow-hidden border border-gray-300"
          >
            <img
              :src="image"
              :alt="`Bild ${index + 1}`"
              class="object-cover w-full h-full"
            />
            <UButton
              icon="i-heroicons-x-mark"
              variant="ghost"
              size="sm"
              color="error"
              class="absolute top-1 right-1 bg-white bg-opacity-75 rounded-full p-1 hover:bg-opacity-100 transition"
              @click="promptImages.splice(index, 1)"
            />
          </div>
        </div>
  
        <UAlert
          v-if="responseNotes"
          variant="soft"
          icon="i-heroicons-information-circle"
          class="whitespace-pre-wrap"
          title="Hinweise zur Generierung"
          :description="responseNotes"
        />

        <UFileUpload
          v-slot="{ open }"
          v-model="uploadQueue"
          accept="image/*"
          :multiple="true"
        >
          <UButton
            :label="`${isUploading ? 'Bilder werden hochgeladen...' : 'Bilder hochladen'}`"
            icon="i-lucide-image"
            variant="soft"
            trailing-icon="i-heroicons-arrow-up-tray"
            :ui="{
              trailingIcon: 'ml-auto opacity-30',
            }"
            @click="open()"
            :disabled="isUploading"
            :loading="isUploading"
          />
        </UFileUpload>

        <Transition name="fade">
          <UProgress
            v-if="isUploading"
            v-model="uploadProgress"
          />
        </Transition>

        <UButton
          :label="`${isGenerating ? 'Anweisung wird verarbeitet...' : 'Anweisung abschicken'}`"
          icon="i-heroicons-sparkles"
          variant="solid"
          :loading="isGenerating"
          :disabled="!prompt"
          @click="generate"
        />
        <UProgress
          v-if="isGenerating || generationProgress > 0"
          :model-value="generationProgress"
          color="primary"
          class="w-full"
        />
      </div>
    </div>

    <UCollapsible
      v-model:open="showHtml"
      class="flex flex-col gap-2"
      :ui="{
        root: 'border-b border-gray-200 !gap-0',
        content: 'flex flex-col gap-4 p-4 border-t border-gray-200',
      }"
    >
      <template #default>
        <div class="flex items-center">
          <UButton
            icon="i-heroicons-code-bracket"
            label="HTML-Code bearbeiten"
            class="w-full rounded-none p-4"
            variant="ghost"
            color="neutral"
            trailing-icon="i-heroicons-chevron-down"
            :ui="{
              trailingIcon: `ml-auto transition-transform ${showHtml ? 'rotate-180' : ''}`,
            }"
          />
        </div>
      </template>

      <template #content>
        <UFormField
          label="HTML"
          description="Hier können Sie eigenen HTML-Code einfügen, der auf Ihrer Webseite angezeigt wird. Achten Sie darauf, dass der Code korrekt ist."
        >
          <UTextarea
            v-model="component.html"
            placeholder="<div>Dein HTML-Code hier</div>"
            class="w-full"
            :rows="6"
          />
        </UFormField>
      </template>
    </UCollapsible>

    <UCollapsible
      v-model:open="showCss"
      class="flex flex-col gap-2"
      :ui="{
        root: 'border-b border-gray-200 !gap-0',
        content: 'flex flex-col gap-4 p-4 border-t border-gray-200',
      }"
    >
      <template #default>
        <div class="flex items-center">
          <UButton
            icon="i-heroicons-code-bracket"
            label="CSS-Code bearbeiten"
            class="w-full rounded-none p-4"
            variant="ghost"
            color="neutral"
            trailing-icon="i-heroicons-chevron-down"
            :ui="{
              trailingIcon: `ml-auto transition-transform ${showCss ? 'rotate-180' : ''}`,
            }"
          />
        </div>
      </template>

      <template #content>
        <UFormField
          label="CSS"
          description="Hier können Sie eigenes CSS hinzufügen, um das Aussehen dieser Sektion anzupassen. Achten Sie darauf, dass der Code korrekt ist."
        >
          <UTextarea
            v-model="component.css"
            placeholder=".meine-klasse { color: red; }"
            class="w-full font-mono"
            :rows="6"
          />
        </UFormField>
      </template>
    </UCollapsible>
  </div>
</template>
