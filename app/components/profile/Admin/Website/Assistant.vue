<script setup lang="ts">
const toast = useToast()

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
    const { responseId, notes } = await $fetch('/api/user/generateHtml', {
      method: 'POST',
      body: {
        prompt: prompt.value,
        images: promptImages.value,
        responseId: previousResponseId.value,
      },
    })
    previousResponseId.value = responseId
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

const todos = ref([
  { title: 'Seite anlegen', done: true },
  { title: 'Sektion anlegen', done: false },
  { title: 'Sektion bearbeiten', done: false },
  { title: 'Design anpassen', done: false },
])
</script>

<template>
  <div class="flex flex-col border-t border-gray-200">
    <div class="bg-gray-50 border-b border-gray-200 p-3 text-sm">
      <div v-for="todo in todos" :key="todo.title" class="flex items-center gap-2 px-3 py-1">
        <UCheckbox
          v-if="todo.done"
          :model-value="true"
          :disabled="true"
        />
        <UIcon
          v-else
          name="i-lucide-loader-circle"
          class="text-gray-400 size-4 animate-spin"
        />
        <span :class="todo.done ? 'line-through text-gray-500' : ''">{{ todo.title }}</span>
      </div>
    </div>
    <UFormField
      label="KI-Anweisung"
      description="Beschreiben Sie die gewünschten Inhalte und das Layout bzw. die Änderungen, die Sie vornehmen möchten."
      :ui="{
        wrapper: 'p-3'
      }"
    >
      <UTextarea
        v-model="prompt"
        placeholder="Schreibe einen einleitenden Text für meine Angebote."
        class="w-full"
        :rows="3"
        :disabled="isGenerating"
        :ui="{
          base: 'rounded-none',
        }"
      />
      <div class="flex items-center gap-2 bg-gray-100 p-2">
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

    <div v-if="promptImages.length" class="grid grid-cols-5 relative">
      <TransitionGroup name="list">
        <div
          v-for="(image, index) in promptImages"
          :key="index"
          class="relative overflow-hidden"
        >
          <img
            :src="image"
            :alt="`Bild ${index + 1}`"
            class="object-cover size-24"
          />
          <UButton
            icon="i-heroicons-x-mark"
            size="sm"
            class="absolute top-1 right-1 rounded-full"
            @click="promptImages.splice(index, 1)"
          />
        </div>
      </TransitionGroup>
    </div>

    <UAlert
      v-if="responseNotes"
      variant="soft"
      icon="i-heroicons-information-circle"
      class="whitespace-pre-wrap rounded-none"
      title="Hinweise zur Generierung"
      :description="responseNotes"
    />

    <ProfileAdminWebsiteFilesSelectOrUpload @url="promptImages.push($event)">
      <UButton
        label="Bilder auswählen"
        icon="i-lucide-image"
        variant="soft"
        trailing-icon="i-heroicons-arrow-up-tray"
        class="w-full rounded-none"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
      />
    </ProfileAdminWebsiteFilesSelectOrUpload>

    <UButton
      :label="`${isGenerating ? 'Anweisung wird verarbeitet...' : 'Anweisung abschicken'}`"
      icon="i-heroicons-sparkles"
      variant="solid"
      class="rounded-none p-4"
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
</template>
