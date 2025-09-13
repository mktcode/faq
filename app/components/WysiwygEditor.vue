<script setup lang="ts">
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

const imageInput = ref<HTMLInputElement | null>(null)

function addImage() {
  imageInput.value?.click()
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result) {
          editor.value?.chain().focus().setImage({ src: reader.result as string }).run()
        }
      }
      reader.readAsDataURL(file)
    })
  }
  if (imageInput.value) {
    imageInput.value.value = ''
  }
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
            @click="editor.chain().focus().undo().run()"
          />
          <WysiwygEditorButton
            icon="i-lucide-redo-2"
            :is-active="editor.can().redo()"
            @click="editor.chain().focus().redo().run()"
          />
        </UButtonGroup>
        <UButtonGroup size="md" class="ml-auto">
          <WysiwygEditorButton
            icon="i-heroicons-list-bullet"
            :is-active="editor.isActive('bulletList')"
            @click="editor.chain().focus().toggleBulletList().run()"
          />
          <WysiwygEditorButton
            icon="i-heroicons-numbered-list"
            :is-active="editor.isActive('orderedList')"
            @click="editor.chain().focus().toggleOrderedList().run()"
          />
          <WysiwygEditorButton
            icon="i-heroicons-bold"
            :is-active="editor.isActive('bold')"
            @click="editor.chain().focus().toggleBold().run()"
          />
          <WysiwygEditorButton
            icon="i-heroicons-italic"
            :is-active="editor.isActive('italic')"
            @click="editor.chain().focus().toggleItalic().run()"
          />
          <WysiwygEditorButton
            icon="i-lucide-highlighter"
            :is-active="editor.isActive('highlight')"
            @click="editor.chain().focus().toggleHighlight().run()"
          />
          <WysiwygEditorButton
            icon="i-lucide-image"
            :is-active="editor.isActive('image')"
            @click="addImage()"
          />
        </UButtonGroup>
      </div>
      <EditorContent
        :editor="editor"
        class="@container"
      />
    </div>
    <input
      id="editor-image-upload"
      ref="imageInput"
      type="file"
      class="hidden"
      multiple
      accept="image/png, image/jpeg, image/gif, image/webp"
      @change="handleImageUpload"
    >
  </ClientOnly>
</template>
