<script setup lang="ts">
const toast = useToast()

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
  title: currentSettings.value?.title || '',
  description: currentSettings.value?.description || '',
  headerImage: currentSettings.value?.headerImage || '',
  headerImageOverlay: currentSettings.value?.headerImageOverlay || {
    color: 'black',
    opacity: 50,
  },
  headerTitleFontSize: currentSettings.value?.headerTitleFontSize || 5,
  headerTitleColor: currentSettings.value?.headerTitleColor || 'white',
  headerDescriptionFontSize: currentSettings.value?.headerDescriptionFontSize || 3,
  headerDescriptionColor: currentSettings.value?.headerDescriptionColor || 'white',
  color: currentSettings.value?.color || 'sky',
  font: currentSettings.value?.font || 'roboto',
  rounded: currentSettings.value?.rounded || 'md',
  logo: currentSettings.value?.logo || '',
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
    <div class="flex gap-2">
      <UFormField
        label="Titel"
        class="flex-1 w-full"
      >
        <UInput
          v-model="form.title"
          placeholder="Gib den Titel deines Unternehmens ein"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Schriftgröße"
        class="w-32"
      >
        <UInputNumber
          v-model="form.headerTitleFontSize"
          size="xl"
        />
      </UFormField>
    </div>
    <div class="flex gap-2">
      <UFormField
        label="Willkommen / Slogan"
        class="flex-1 w-full"
      >
        <UInput
          v-model="form.description"
          placeholder="Gib eine kurze Beschreibung deines Unternehmens ein"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Schriftgröße"
        class="w-32"
      >
        <UInputNumber
          v-model="form.headerDescriptionFontSize"
          size="xl"
        />
      </UFormField>
    </div>
    <div class="p-1 border border-gray-200 rounded-lg flex flex-col gap-2">
      <div
        class="@container group relative flex flex-col items-center justify-center w-full rounded-lg cursor-pointer transition-all overflow-hidden hover:bg-gray-50"
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
          class="absolute w-full h-full object-cover z-0"
        >
        <div
          v-if="form.headerImage"
          class="absolute inset-0 z-10"
          :class="getColorClass(form.headerImageOverlay.color)"
          :style="{ opacity: form.headerImageOverlay.opacity / 100 }"
        />
        <div class="flex flex-col items-center justify-center pt-5 p-4 z-10">
          <UButton
            icon="i-heroicons-photo"
            variant="soft"
            color="neutral"
            block
            class="size-16 rounded-full mx-auto"
          />
          <h1
            v-if="form.title"
            class="text-lg font-semibold mt-2"
            :style="{ 'font-size': form.headerTitleFontSize + 'cqw' }"
          >
            {{ form.title }}
          </h1>
          <p
            v-if="form.description"
            class="text-sm text-center text-gray-500 mt-1"
            :style="{ 'font-size': form.headerDescriptionFontSize + 'cqw' }"
          >
            {{ form.description }}
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
      <div
        v-if="form.headerImage"
        class="flex gap-2"
      >
        <ColorPicker
          v-model:color="form.headerImageOverlay.color"
          :label="undefined"
        />
        <USlider
          v-model="form.headerImageOverlay.opacity"
          class="flex-1"
        />
      </div>
    </div>
    <div class="flex gap-2">
      <ColorPicker
        v-model:color="form.color"
        label="Primäre Farbe"
      />
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
