<script setup lang="ts">
const { showWebsiteFiles, go } = useAdmin()

const { uploadFiles, isUploading, uploadProgress } = useUpload()
const showType = ref('all')
const sortBy = ref('newest')

const { data: files, refresh: refreshFiles } = await useFetch('/api/user/upload', {
  method: 'GET',
  query: {
    showType,
    sortBy,
  },
})

const { $profile } = useProfile()
const maxStorage = computed(() => {
  switch ($profile.subscription.plan) {
    case 'S':
      return 50 * 1024 * 1024
    case 'L':
      return 250 * 1024 * 1024
    default:
      return 10 * 1024 * 1024
  }
})

const storageUsedMb = computed(() => {
  return files.value ? (files.value.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)) : 0
})

const storageUsedPercent = computed(() => {
  return maxStorage.value ? (storageUsedMb.value / (maxStorage.value / (1024 * 1024)) * 100) : 0
})

const uploadQueue = ref<File[]>([])

watch(uploadQueue, async (newFiles) => {
  if (newFiles.length > 0) {
    await uploadFiles(newFiles, '')
    await refreshFiles()
    nextTick(() => {
      uploadQueue.value = []
    })
  }
})
</script>

<template>
  <USlideover
    :open="showWebsiteFiles"
    side="left"
    :ui="{
      wrapper: 'z-40',
      body: '!p-0 border-none',
      overlay: 'backdrop-blur-xs',
      footer: '!p-0',
      header: 'relative',
    }"
  >
    <template #header>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-folder-open"
          class="inline-block size-6 opacity-50"
        />
        Dokumente und Bilder
      </h3>
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        color="neutral"
        size="md"
        class="ml-auto"
        @click="go('#website')"
      />
      <UButton
        icon="i-heroicons-x-mark"
        variant="ghost"
        color="neutral"
        size="md"
        @click="go('')"
      />
      <Transition name="fade">
        <UProgress
          v-if="isUploading"
          v-model="uploadProgress"
          class="absolute bottom-0 left-0 right-0"
          :ui="{
            base: 'rounded-none',
            indicator: 'rounded-none'
          }"
        />
      </Transition>
    </template>

    <template #body>
      <UFileUpload
        v-slot="{ open }"
        v-model="uploadQueue"
        accept="image/*"
        :multiple="true"
      >
        <UButton
          label="Bilder hochladen"
          icon="i-lucide-image"
          class="w-full rounded-none p-4 border-b border-primary-200"
          variant="soft"
          trailing-icon="i-heroicons-plus"
          :ui="{
            trailingIcon: 'ml-auto opacity-30',
          }"
          @click="open()"
          :disabled="isUploading"
          :loading="isUploading"
        />
      </UFileUpload>
      <UFileUpload
        v-slot="{ open }"
        v-model="uploadQueue"
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv,application/rtf,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.spreadsheet,application/vnd.oasis.opendocument.presentation,application/zip,application/x-7z-compressed,application/x-rar-compressed"
        :multiple="true"
      >
        <UButton
          label="Dokumente hochladen"
          icon="i-lucide-file-text"
          class="w-full rounded-none p-4 border-b border-primary-200"
          variant="soft"
          trailing-icon="i-heroicons-plus"
          :ui="{
            trailingIcon: 'ml-auto opacity-30',
          }"
          @click="open()"
          :disabled="isUploading"
          :loading="isUploading"
        />
      </UFileUpload>

      <div class="p-4 border-b border-gray-200 flex items-center gap-4">
        <USelect
          v-model="showType"
          :items="[
            { label: 'Alle anzeigen', value: 'all' },
            { label: 'Nur Bilder', value: 'images' },
            { label: 'Nur Dokumente', value: 'documents' },
          ]"
          class="ml-auto flex-1"
        />
        <USelect
          v-model="sortBy"
          :items="[
            { label: 'Neueste zuerst', value: 'newest' },
            { label: 'Älteste zuerst', value: 'oldest' },
            { label: 'Name A-Z', value: 'name-asc' },
            { label: 'Name Z-A', value: 'name-desc' },
          ]"
          class="ml-auto flex-1"
        />
      </div>

      <TransitionGroup name="fade">
        <ProfileAdminWebsiteFilesFile
          v-for="file in files"
          :key="file.filename + file.size"
          :file="file"
          @refresh="refreshFiles"
        />
      </TransitionGroup>
    </template>

    <template #footer>
      <UProgress
        v-model="storageUsedPercent"
        status
        class="absolute bottom-0 left-0 right-0"
        :ui="{
          base: 'rounded-none',
          status: '!w-full justify-center',
        }"
      >
        <template #status>
          {{ storageUsedMb.toFixed(2) }} von {{ (maxStorage / (1024 * 1024)).toFixed(0) }} MB verwendet
        </template>
      </UProgress>
    </template>
  </USlideover>
</template>
