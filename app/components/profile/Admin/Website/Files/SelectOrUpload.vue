<script setup lang="ts">
const show = ref(false)

const { uploadFiles, isUploading, uploadProgress } = useUpload()

const url = defineModel<string | null>({
  type: [String, null],
  default: null,
})

const emit = defineEmits<{
  url: [url: string]
}>()

const { data: files, refresh: refreshFiles } = await useFetch('/api/user/upload', {
  method: 'GET',
  query: {
    showType: 'images',
    sortBy: 'newest',
  },
})

function selectImage(selectedUrl: string) {
  url.value = selectedUrl
  emit('url', selectedUrl)
  show.value = false
}

const uploadQueue = ref<File[]>([])

watch(uploadQueue, async (newFiles) => {
  if (newFiles.length > 0) {
    for await (const uploadedUrl of uploadFiles(newFiles, '')) {
      url.value = uploadedUrl
      emit('url', uploadedUrl)
    }

    await refreshFiles()
    nextTick(() => {
      uploadQueue.value = []
    })
  }
})
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
      <UFileUpload
        v-slot="{ open }"
        v-model="uploadQueue"
        accept="image/*"
        :multiple="true"
        class="col-span-2 sm:col-span-4 w-full"
      >
        <UButton
          :label="`${isUploading ? 'Bilder werden hochgeladen...' : 'Bilder hochladen'}`"
          icon="i-lucide-image"
          variant="soft"
          trailing-icon="i-heroicons-arrow-up-tray"
          :ui="{
            trailingIcon: 'ml-auto opacity-30',
          }"
          class="rounded-none p-4"
          @click="open()"
          :disabled="isUploading"
          :loading="isUploading"
        />
      </UFileUpload>
      <UProgress
        v-if="isUploading"
        :model-value="uploadProgress"
        class="w-full col-span-2 sm:col-span-4 rounded-none"
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