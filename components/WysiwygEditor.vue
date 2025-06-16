<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'

const model = defineModel<string | null>()

const editor = useEditor({
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Highlight,
  ],
  editorProps: {
    attributes: {
      class: 'rounded-lg p-3 prose prose-sm focus:outline-none max-w-full focus:ring-2 focus:ring-sky-500',
    },
  },
  content: model.value || '<p>Beschreibung. 🎉</p>',
  onUpdate({ editor }) {
    model.value = editor.getHTML()
  },
})

function click(editor: Editor) {
  return editor.chain().focus()
}
</script>

<template>
  <div v-if="editor">
    <div class="rounded-lg border border-gray-300 p-1 flex gap-1">
      <WysiwygEditorButton
        :is-active="editor.can().undo()"
        @click="click(editor).undo().run()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </WysiwygEditorButton>
      <WysiwygEditorButton
        :is-active="editor.can().redo()"
        @click="click(editor).redo().run()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
          />
        </svg>
      </WysiwygEditorButton>
      <WysiwygEditorButton
        :is-active="editor.isActive('bulletList')"
        @click="click(editor).toggleBulletList().run()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </WysiwygEditorButton>
      <WysiwygEditorButton
        :is-active="editor.isActive('orderedList')"
        @click="click(editor).toggleOrderedList().run()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 1 1 1.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 0 1 0 2.25H3.74m0-.002h.375a1.125 1.125 0 0 1 0 2.25H2.99"
          />
        </svg>
      </WysiwygEditorButton>
      <WysiwygEditorButton
        :is-active="editor.isActive('bold')"
        @click="click(editor).toggleBold().run()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linejoin="round"
            d="M6.75 3.744h-.753v8.25h7.125a4.125 4.125 0 0 0 0-8.25H6.75Zm0 0v.38m0 16.122h6.747a4.5 4.5 0 0 0 0-9.001h-7.5v9h.753Zm0 0v-.37m0-15.751h6a3.75 3.75 0 1 1 0 7.5h-6m0-7.5v7.5m0 0v8.25m0-8.25h6.375a4.125 4.125 0 0 1 0 8.25H6.75m.747-15.38h4.875a3.375 3.375 0 0 1 0 6.75H7.497v-6.75Zm0 7.5h5.25a3.75 3.75 0 0 1 0 7.5h-5.25v-7.5Z"
          />
        </svg>
      </WysiwygEditorButton>
      <WysiwygEditorButton
        :is-active="editor.isActive('italic')"
        @click="click(editor).toggleItalic().run()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5.248 20.246H9.05m0 0h3.696m-3.696 0 5.893-16.502m0 0h-3.697m3.697 0h3.803"
          />
        </svg>
      </WysiwygEditorButton>
      <WysiwygEditorButton
        :is-active="editor.isActive('strike')"
        @click="click(editor).toggleStrike().run()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 12a8.912 8.912 0 0 1-.318-.079c-1.585-.424-2.904-1.247-3.76-2.236-.873-1.009-1.265-2.19-.968-3.301.59-2.2 3.663-3.29 6.863-2.432A8.186 8.186 0 0 1 16.5 5.21M6.42 17.81c.857.99 2.176 1.812 3.761 2.237 3.2.858 6.274-.23 6.863-2.431.233-.868.044-1.779-.465-2.617M3.75 12h16.5"
          />
        </svg>
      </WysiwygEditorButton>
      <WysiwygEditorButton
        :is-active="editor.isActive('highlight')"
        @click="click(editor).toggleHighlight().run()"
      >
        Highlight
      </WysiwygEditorButton>
    </div>
    <div class="mt-2">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<style>
.tiptap {
  border: 1px solid #e2e8f0;
  p {
    margin: 0;
  }
}
</style>
