<script setup lang="ts">
const toast = useToast()

const emit = defineEmits(['update'])

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
  headerImage: currentSettings.value?.headerImage || '',
  color: currentSettings.value?.color || 'sky',
  font: currentSettings.value?.font || 'roboto',
  rounded: currentSettings.value?.rounded || 'md',
})

async function saveSettings() {
  await $fetch('/api/user/settings', {
    method: 'POST',
    body: form.value,
  })
  toast.add({
    title: 'Einstellungen gespeichert',
    description: 'Deine Einstellungen wurden erfolgreich gespeichert.',
    color: 'success',
  })
  emit('update')
}

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const uploadFile = async (files: FileList | null) => {
  if (!files || files.length === 0) return

  const formData = new FormData()

  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i])
  }

  try {
    const { imageUrls } = await $fetch('/api/user/upload/image', {
      method: 'POST',
      body: formData,
    })

    form.value.headerImage = imageUrls[0] || ''

    await saveSettings()

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

const clickFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <div
      class="group h-36 relative flex flex-col items-center justify-center w-full rounded-lg cursor-pointer transition-all overflow-hidden hover:bg-gray-50"
      :class="{
        'border-2 border-dashed': !form.headerImage,
        'border-primary-500 bg-gray-50': isDragging,
        'border-gray-300': !isDragging,

      }"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <img
        v-if="form.headerImage"
        :src="form.headerImage"
        alt="Header Image"
        class="absolute w-full h-full object-cover z-0 opacity-80 group-hover:opacity-100 transition-opacity"
      >
      <div class="flex flex-col items-center justify-center pt-5 p-4 z-10">
        <UIcon
          :class="`mb-2 size-12 text-gray-200`"
          name="i-heroicons-plus"
        />
        <p
          class="mb-1 text-xs"
          :class="{ 'text-white': form.headerImage, 'text-gray-500': !form.headerImage }"
        >
          <span class="font-semibold">Klicken</span> oder Bilder hierhin ziehen (JPG, PNG, GIF, max. 5 MB)
        </p>
        <div
          v-if="form.headerImage"
          class="flex gap-2 mt-2"
        >
          <UButton
            label="Bild ändern"
            size="sm"
            @click="clickFileInput"
          />
          <UButton
            icon="i-heroicons-trash"
            color="error"
            size="sm"
            @click="form.headerImage = ''"
          />
        </div>
      </div>
      <input
        id="header-image-dropzone"
        ref="fileInput"
        type="file"
        class="hidden"
        capture
        multiple
        @change="handleInputChange"
      >
      <label
        v-if="!form.headerImage"
        for="header-image-dropzone"
        class="w-full h-full absolute top-0 left-0 cursor-pointer z-20"
      />
    </div>
    <div class="flex gap-2">
      <ColorPicker v-model:color="form.color" />
      <UFormField
        label="Stil"
        class="flex-1"
      >
        <USelect
          v-model="form.rounded"
          class="w-full"
          :items="[
            { label: 'Eckig', value: 'none' },
            { label: 'Rund', value: 'md' },
            { label: 'Sehr rund', value: 'xl' },
          ]"
        />
      </UFormField>
    </div>
    <FontPicker v-model:font="form.font" />
    <UButton
      label="Individuelles Design"
      variant="soft"
      color="primary"
      icon="i-heroicons-sparkles"
    />
    <UButton
      variant="solid"
      color="primary"
      @click="saveSettings"
    >
      Einstellungen speichern
    </UButton>
  </div>
</template>
