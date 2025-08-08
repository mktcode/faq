<script setup lang="ts">
const toast = useToast()
const { settings, saveSettings, isSubscribed } = await useProfile()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const galleryTypes = ref([
  {
    label: 'Raster',
    value: 'grid'
  },
  {
    label: 'Mauerwerk',
    value: 'masonry',
    disabled: !isSubscribed.value,
  },
])

watch(() => settings.value.components.gallery.type, saveSettings)

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

      settings.value.components.gallery.items = [
        ...settings.value.components.gallery.items,
        ...imageUrls.map((url: string) => ({ url, title: '', description: '' })),
      ]

      await saveSettings()

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

async function deleteImage(index: number) {
  const url = settings.value.components.gallery.items[index].url
  const { success } = await $fetch('/api/user/upload/delete', {
    method: 'POST',
    body: JSON.stringify({ url }),
  })

  if (!success) {
    toast.add({
      title: 'Fehler',
      description: 'Die Datei konnte nicht gelöscht werden.',
      color: 'error',
    })
    return
  }

  settings.value.components.gallery.items.splice(index, 1)
  saveSettings()
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <UFormField label="Darstellung">
      <USelect
        v-model="settings.components.gallery.type"
        :items="galleryTypes"
        label="Galerie Layout"
        class="w-full"
      >
        <template #item-trailing="{ item }">
          <UBadge
            v-if="item.disabled"
            label="Premium"
            variant="outline"
            class="mr-2"
          />
        </template>
      </USelect>
    </UFormField>
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
      <TransitionGroup name="fade">
        <div
          v-for="(image, index) in settings.components.gallery.items"
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
                @click="deleteImage(index)"
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
      @click="saveSettings()"
    />
  </div>
</template>
