<script setup lang="ts">
import loader from '@monaco-editor/loader'
import type * as Monaco from 'monaco-editor'

const content = defineModel<string>('content')

const { language = 'html' } = defineProps<{
  language?: string
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

onBeforeUnmount(() => {
  editor?.dispose()
})
</script>

<template>
  <div ref="el" style="width:100%;height:400px;"></div>
</template>
