<script setup lang="ts">
const toast = useToast()
const show = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

const url = defineModel<string | null>({
  type: [String, null],
  default: null,
})

const { data: files, refresh: refreshFiles } = await useFetch('/api/user/upload', {
  method: 'GET',
})

function selectImage(selectedUrl: string) {
  url.value = selectedUrl
  show.value = false
}

const uploadFile = async (files: FileList | null) => {
  if (!files || files.length === 0) return

  isUploading.value = true

  for (const file of Array.from(files)) {
    const formData = new FormData()
    formData.append('files', file)
    try {
      const { imageUrls } = await $fetch('/api/user/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (imageUrls[0]) {
        url.value = imageUrls[0]
      }

      show.value = false
      await refreshFiles()
    }
    catch (error) {
      toast.add({
        title: 'Fehler',
        icon: 'i-heroicons-x-circle',
        color: 'error',
        description: 'Fehler beim Hochladen der Datei.',
        progress: false,
      })
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
</script>

<template>
  <div @click.stop="show = true" class="inline">
    <slot />
  </div>
  <UModal
    title="Datei auswählen oder hochladen"
    description="Wähle eine vorhandene Datei aus oder lade eine neue Datei hoch."
    v-model:open="show"
    :ui="{
      body: '!p-0 grid grid-cols-2 sm:grid-cols-4',
    }"
  >
    <template #body>
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        multiple
        @change="handleInputChange"
      >
      <UButton
        icon="i-heroicons-arrow-up-on-square"
        label="Datei hochladen"
        class="col-span-2 sm:col-span-4 rounded-none p-4"  
        @click="fileInput?.click()"
        :loading="isUploading"
        :disabled="isUploading"
      />
      <div
        v-for="file in files"
        :key="file.key"
        class="cursor-pointer overflow-hidden group relative"
        :class="{
          'border-primary-500': url === file.url,
          'hover:border-gray-400': url !== file.url,
        }"
        @click="selectImage(file.url)"
      >
        <img
          :src="file.url"
          :alt="file.filename"
          class="w-full h-24 object-cover group-hover:scale-110 z-0 relative transition-transform duration-300"
        />
        <div class="text-xs p-1 text-center truncate bg-white z-10 relative">
          {{ file.filename }}
        </div>
      </div>
    </template>
  </UModal>
</template>