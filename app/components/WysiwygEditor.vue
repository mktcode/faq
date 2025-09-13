<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import FileHandler from '@tiptap/extension-file-handler'
import Image from '@tiptap/extension-image'

const model = defineModel<string | null>()

const editor = useEditor({
  editorProps: {
    attributes: {
      class: 'p-2 bg-gray-100 prose prose-sm @sm:prose @lg:prose-lg @xl:prose-2xl mx-auto rounded-lg focus:outline-none focus:bg-gray-50',
    },
  },
  extensions: [
    StarterKit,
    Highlight,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Image.configure({
      allowBase64: true,
    }),
    FileHandler.configure({
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      onDrop: (currentEditor, files, pos) => {
        files.forEach(file => {
          const fileReader = new FileReader()

          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            currentEditor
              .chain()
              .insertContentAt(pos, {
                type: 'image',
                attrs: {
                  src: fileReader.result,
                },
              })
              .focus()
              .run()
          }
        })
      },
      onPaste: (currentEditor, files) => {
        files.forEach(file => {
          const fileReader = new FileReader()

          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            currentEditor
              .chain()
              .insertContentAt(currentEditor.state.selection.anchor, {
                type: 'image',
                attrs: {
                  src: fileReader.result,
                },
              })
              .focus()
              .run()
          }
        })
      },
    }),
  ],
  content: model.value || '',
  onUpdate: ({ editor }) => {
    model.value = editor.getHTML()
  },
})

function click(editor: Editor) {
  return editor.chain().focus()
}
</script>

<template>
  <ClientOnly>
    <div v-if="!editor">lade Editor...</div>
    <div v-else>
      <div class="flex gap-2 mb-2">
        <UButtonGroup size="md">
          <WysiwygEditorButton
            icon="i-lucide-undo-2"
            :is-active="editor.can().undo()"
            @click="click(editor).undo().run()"
          />
          <WysiwygEditorButton
            icon="i-lucide-redo-2"
            :is-active="editor.can().redo()"
            @click="click(editor).redo().run()"
          />
        </UButtonGroup>
        <UButtonGroup size="md" class="ml-auto">
          <WysiwygEditorButton
            icon="i-heroicons-list-bullet"
            :is-active="editor.isActive('bulletList')"
            @click="click(editor).toggleBulletList().run()"
          />
          <WysiwygEditorButton
            icon="i-heroicons-numbered-list"
            :is-active="editor.isActive('orderedList')"
            @click="click(editor).toggleOrderedList().run()"
          />
          <WysiwygEditorButton
            icon="i-heroicons-bold"
            :is-active="editor.isActive('bold')"
            @click="click(editor).toggleBold().run()"
          />
          <WysiwygEditorButton
            icon="i-heroicons-italic"
            :is-active="editor.isActive('italic')"
            @click="click(editor).toggleItalic().run()"
          />
          <WysiwygEditorButton
            icon="i-heroicons-strikethrough"
            :is-active="editor.isActive('strike')"
            @click="click(editor).toggleStrike().run()"
          />
          <WysiwygEditorButton
            label="Highlight"
            :is-active="editor.isActive('highlight')"
            @click="click(editor).toggleHighlight().run()"
          />
        </UButtonGroup>
      </div>
      <EditorContent
        :editor="editor"
        class="@container"
      />
    </div>
  </ClientOnly>
</template>
