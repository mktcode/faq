<script setup lang="ts">
const toast = useToast()

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
  downloads: currentSettings.value?.downloads || [],
})

const saveSattingsDebounceInterval = ref<NodeJS.Timeout | null>(null)
async function saveSettings() {
  if (saveSattingsDebounceInterval.value) {
    clearTimeout(saveSattingsDebounceInterval.value)
  }
  saveSattingsDebounceInterval.value = setTimeout(async () => {
    await $fetch('/api/user/settings', {
      method: 'POST',
      body: form.value,
    })
    toast.add({
      title: 'Einstellungen gespeichert',
      description: 'Deine Einstellungen wurden erfolgreich gespeichert.',
      color: 'success',
    })
  }, 500)
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
    const { uploadedFiles } = await $fetch('/api/user/upload/file', {
      method: 'POST',
      body: formData,
    })

    form.value.downloads = [
      ...form.value.downloads,
      ...uploadedFiles,
    ]

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
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <p class="text-gray-400">
      Laden Sie hier Dateien hoch, die Sie Besuchern zum Herunterladen anbieten wollen,
      z.B. Preislisten, Fragebögen, Zertifikate oder Ihre AGB.
    </p>
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
          <span class="font-semibold">Klicken</span> oder Dateien hierhin ziehen (PDF, DOC, max. 5 MB)
        </p>
      </div>
      <input
        id="download-dropzone"
        ref="fileInput"
        type="file"
        class="hidden"
        capture
        multiple
        @change="handleInputChange"
      >
      <label
        for="download-dropzone"
        class="w-full h-full absolute top-0 left-0 cursor-pointer"
      />
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-for="(download, index) in form.downloads"
        :key="index"
        class="flex flex-col items-center justify-center w-full gap-2"
      >
        <div class="flex gap-2 w-full">
          <UInput
            v-model="download.title"
            class="flex-1"
            placeholder="Bildtitel"
            @blur="saveSettings"
          />
          <UButton
            variant="soft"
            icon="i-heroicons-arrow-down-tray"
            :href="download.url"
            target="_blank"
            download
          />
          <UButton
            color="error"
            variant="soft"
            icon="i-heroicons-trash"
            @click="form.downloads.splice(index, 1); saveSettings()"
          />
        </div>
        <UTextarea
          v-model="download.description"
          class="w-full"
          placeholder="Bildbeschreibung"
          @blur="saveSettings"
        />
      </div>
    </div>
  </div>
</template>
