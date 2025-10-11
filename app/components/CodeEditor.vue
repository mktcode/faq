<script setup lang="ts">
import loader from '@monaco-editor/loader'
import type * as Monaco from 'monaco-editor'

const content = defineModel<string>('content')

const { language = 'html', fullscreen = false } = defineProps<{
  language?: string
  fullscreen?: boolean
}>()

const el = ref<HTMLDivElement | null>(null)
let monaco: typeof Monaco | null = null
let editor: Monaco.editor.IStandaloneCodeEditor | null = null

onMounted(async () => {
  // Monaco laden (nur im Browser)
  monaco = await loader.init()
  if (!el.value || !monaco) return

  editor = monaco.editor.create(el.value, {
    value: content.value,
    language: language,
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: false },
  })

  // v-model Sync
  editor.onDidChangeModelContent(() => {
    const val = editor!.getValue()
    content.value = val
  })
})

watch(content, (v) => {
  if (editor && v !== editor.getValue()) editor.setValue(v ?? '')
})

// React to fullscreen toggle: lock scroll and relayout editor
watch(() => fullscreen, async (v) => {
  if (process.client) {
    document.documentElement.style.overflow = v ? 'hidden' : ''
  }
  await nextTick()
  editor?.layout()
}, { immediate: true })

onBeforeUnmount(() => {
  editor?.dispose()
  // Ensure scroll is reset if unmounting while in fullscreen
  if (process.client) {
    document.documentElement.style.overflow = ''
  }
})
</script>

<template>
  <div
    ref="el"
    :class="fullscreen ? 'fixed inset-0 z-50 w-screen h-screen' : 'w-full h-[400px]'"
  ></div>
</template>
