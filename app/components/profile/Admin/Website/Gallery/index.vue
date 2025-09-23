<script setup lang="ts">
import type { GalleryComponentSchema } from '~~/types/db'

const toast = useToast()

const component = defineModel('component', {
  type: Object as () => GalleryComponentSchema,
  required: true,
})

const { $profile, saveSettings } = useProfile()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const galleryTypes = ref([
  {
    label: 'Raster',
    value: 'grid',
  },
  {
    label: 'Raster mit Kopfbild',
    value: 'grid-with-header',
  },
  {
    label: 'Mauerwerk',
    value: 'masonry',
    disabled: !$profile.subscription.plan,
  },
])

const uploadFile = async (files: FileList | null) => {
  if (!files || files.length === 0) return

  isUploading.value = true
  let uploadedFiles = 0

  for (const file of Array.from(files)) {
    const formData = new FormData()
    formData.append('files', file)
    try {
      const { imageUrls } = await $fetch('/api/user/upload/image', {
        method: 'POST',
        body: formData,
      })

      component.value.items = [
        ...component.value.items,
        ...imageUrls.map((url: string) => ({ url, title: '', description: '' })),
      ]

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
  const url = component.value.items[index]?.url
  if (!url) return

  const { success } = await $fetch('/api/user/upload/delete', {
    method: 'POST',
    body: JSON.stringify({ url }),
  })

  if (!success) {
    toast.add({
      title: 'Fehler',
      icon: 'i-heroicons-exclamation-circle',
      description: 'Die Datei konnte nicht gelöscht werden.',
      color: 'error',
      progress: false,
    })
    return
  }

  component.value.items.splice(index, 1)
  saveSettings()
}

const linkInput = ref('')
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex items-center gap-4 mb-4">
      <UFormField
        label="Titel der Sektion"
        class="flex-1"
      >
        <UInput
          v-model="component.title"
          placeholder="z.B. Bildergalerie"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Sichtbar">
        <USwitch
          v-model="component.showTitle"
          size="xl"
        />
      </UFormField>
    </div>

    <UFormField label="Beschreibung" hint="(optional)">
      <WysiwygEditor v-model="component.description" />
    </UFormField>
    
    <UFormField label="Variante">
      <USelect
        v-model="component.type"
        :items="galleryTypes"
        label="Galerie Layout"
        class="w-full"
      >
        <template #item-trailing="{ item }">
          <UBadge
            v-if="item.disabled"
            label="Premium"
            variant="outline"
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
    <UFormField
      label="Per Link hinzufügen"
      description="Falls Sie Bilder auf einer anderen Plattform bereits online zugänglich haben."
      :ui="{
        container: 'flex gap-2',
      }"
    >
      <UInput
        v-model="linkInput"
        placeholder="https://example.com/image.jpg"
        class="w-full"
      />
      <UButton
        icon="i-heroicons-plus"
        @click="() => {
          if (linkInput && linkInput.trim() !== '') {
            component.items.push({ url: linkInput.trim(), title: '', description: '' });
            linkInput = '';
          }
        }"
        :disabled="!linkInput || linkInput.trim() === ''"
      />
    </UFormField>
    <div class="flex flex-col gap-2">
      <TransitionGroup name="fade">
        <div
          v-for="(image, index) in component.items"
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
  </div>
</template>
