<script setup lang="ts">
const emit = defineEmits(['refreshFiles'])

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const uploadFile = async (files: FileList | null) => {
  if (!files || files.length === 0) return

  const formData = new FormData()

  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i])
  }

  try {
    await $fetch('/api/files/upload', {
      method: 'POST',
      body: formData,
    })

    emit('refreshFiles')

    // Clear the input to allow selecting the same file again
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
  catch (error) {
    console.error('Error uploading files:', error)
  }
}

const handleInputChange = () => {
  uploadFile(fileInput.value?.files || null)
}

// Handle drag-and-drop events
const onDragEnter = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const onDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault() // Necessary to allow dropping
}

const onDrop = async (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false

  if (e.dataTransfer?.files) {
    uploadFile(e.dataTransfer.files)
  }
}
</script>

<template>
  <div
    :class="`relative flex flex-col items-center justify-center w-full h-auto border-2 ${isDragging ? 'border-primary-500' : 'border-gray-300'} border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <div class="flex flex-col items-center justify-center pt-5 p-4">
      <UIcon
        :class="`mb-2 size-12 text-gray-200`"
        name="i-heroicons-plus"
      />
      <p :class="`mb-1 text-xs text-gray-500`">
        <span class="font-semibold">Klicken</span> oder Bilder hierhin ziehen (JPG, PNG, GIF, max. 5 MB)
      </p>
    </div>
    <input
      id="dropzone-file"
      ref="fileInput"
      type="file"
      class="hidden"
      capture
      multiple
      @change="handleInputChange"
    >
    <label
      for="dropzone-file"
      class="w-full h-full absolute top-0 left-0 cursor-pointer"
    />
  </div>
</template>
