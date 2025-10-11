<script setup lang="ts">
import loader from '@monaco-editor/loader'
import type * as Monaco from 'monaco-editor'

const content = defineModel<string>('content')
const fullscreen = ref(false)
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

  // Add Monaco action + keybindings to toggle fullscreen
  editor.addAction?.({
    id: 'toggle-fullscreen',
    label: 'Toggle Fullscreen',
    // F11 and Ctrl/Cmd+Shift+F
    keybindings: [
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (monaco as any).KeyCode?.F11 ?? 0,
      (monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF),
    ],
    run: () => {
      fullscreen.value = !fullscreen.value
    },
  })
})

watch(content, (v) => {
  if (editor && v !== editor.getValue()) editor.setValue(v ?? '')
})

// React to fullscreen toggle: lock scroll and relayout editor
watch(fullscreen, async (v) => {
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
  <div :class="(fullscreen ?? false) ? 'fixed inset-0 z-50 w-screen h-screen bg-neutral-900/95' : 'relative w-full h-[400px]'">
    <!-- Toolbar overlay -->
    <div class="absolute top-2 right-2 z-[60] flex items-center gap-2">
      <button
        type="button"
        class="rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 px-2 py-1 text-xs shadow-sm backdrop-blur"
        @click="fullscreen = !(fullscreen ?? false)"
        aria-label="Toggle fullscreen"
        title="Toggle fullscreen (F11 / Ctrl+Shift+F)"
      >
        <span v-if="!fullscreen">Fullscreen</span>
        <span v-else>Exit Fullscreen</span>
      </button>
    </div>

    <!-- Editor host -->
    <div ref="el" class="w-full h-full"></div>
  </div>
</template>
