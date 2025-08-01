<script setup lang="ts">
const { settings, saveSettings } = await useProfile()

const form = ref({
  gallery: settings.value?.gallery || [],
})

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)

const uploadFile = async (files: FileList | null) => {
  if (!files || files.length === 0) return

  isUploading.value = true
  let uploadedFiles = 0
  
  for (let i = 0; i < files.length; i++) {
    const formData = new FormData()
    formData.append('files', files[i])
    try {
      const { imageUrls } = await $fetch('/api/user/upload/image', {
        method: 'POST',
        body: formData,
      })
  
      form.value.gallery = [
        ...form.value.gallery,
        ...imageUrls.map((url: string) => ({ url })),
      ]
  
      await saveSettings(form.value)

      uploadedFiles++
      uploadProgress.value = Math.round((uploadedFiles / files.length) * 100)
    }
    catch (error) {
      console.error('Error uploading files:', error)
    }
  }
  isUploading.value = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleInputChange = () => {
  uploadFile(fileInput.value?.files || null)
}

const onDragEnter = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const onDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const onDrop = async (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false

  if (e.dataTransfer?.files) {
    uploadFile(e.dataTransfer.files)
  }
}

const deleteItem = async (index: number) => {
  form.value.gallery.splice(index, 1)
  await saveSettings(form.value)
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
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
        id="image-dropzone"
        ref="fileInput"
        type="file"
        class="hidden"
        capture
        multiple
        @change="handleInputChange"
      >
      <label
        for="image-dropzone"
        class="w-full h-full absolute top-0 left-0 cursor-pointer"
      />
    </div>
    <UProgress
      v-if="isUploading"    
      v-model="uploadProgress"
    />
    <div class="flex flex-col gap-2">
      <TransitionGroup name="fade" mode="out-in">
        <div
          v-for="(image, index) in form.gallery"
          :key="index"
          class="flex items-center justify-center w-full gap-2"
        >
          <img
            :src="image.url"
            class="w-32 object-cover aspect-square rounded-lg"
          >
          <div class="flex flex-col gap-2 w-full">
            <div class="flex gap-2">
              <UInput
                v-model="image.title"
                placeholder="Bildtitel"
                class="flex-1"
              />
              <UButton
                icon="i-heroicons-trash"
                variant="soft"
                color="error"
                @click="deleteItem(index)"
              />
            </div>
            <UTextarea
              v-model="image.description"
              placeholder="Bildbeschreibung"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>
    <UButton
      label="Einstellungen speichern"
      variant="solid"
      color="primary"
      @click="saveSettings(form)"
    />
  </div>
</template>
