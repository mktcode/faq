<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import type { HtmlComponentSchema } from '~~/types/db';

const toast = useToast()

const { component } = defineProps<{
  component: HtmlComponentSchema;
}>()

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
const isGenerating = ref(false)
const previousResponseId = ref<string | undefined>(undefined)

async function generate() {
  if (!prompt.value) return

  isGenerating.value = true
  try {
    const { html, css, responseId } = await $fetch('/api/user/generateHtml', {
      method: 'POST',
      body: {
        prompt: prompt.value,
        html: component.html,
        css: component.css,
        responseId: previousResponseId.value,
      },
    })
    previousResponseId.value = responseId
    component.html = html
    component.css = css
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
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex items-center gap-4 mb-4">
      <UFormField
        label="Titel der Sektion"
        class="flex-1"
      >
        <UInput
          v-model="component.title"
          placeholder="z.B. Unsere Angebote"
          class="w-full"
        />
      </UFormField>
    </div>

    <div class="flex flex-col gap-2">
      <UFormField
        label="KI-Anweisung"
        description="Beschreiben Sie, was dargestellt bzw. geändert werden soll - sowohl textlich als auch optisch. Sie können auch Anweisungen für verschiedene Bildschirmgrößen geben (z.B. 'auf Mobilgeräten ist die Schrift zu groß.'). Sie können Sich auch auf andere Inhalte Ihrer Website beziehen und Dateien hochladen."
      >
        <UTextarea
          v-model="prompt"
          placeholder="Schreibe einen einleitenden Text für unsere Angebote."
          class="w-full"
          :rows="3"
          :disabled="isGenerating"
        />
      </UFormField>

      <UButton
        :label="`${isGenerating ? 'Anweisung wird verarbeitet...' : 'Anweisung abschicken'}`"
        icon="i-heroicons-sparkles"
        variant="solid"
        :loading="isGenerating"
        :disabled="!prompt"
        @click="generate"
      />
    </div>
    
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
  </div>
</template>
