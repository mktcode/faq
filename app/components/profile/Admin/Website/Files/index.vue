<script setup lang="ts">
const { showWebsiteFiles, go } = useAdmin()

const { data: files, refresh: refreshFiles } = await useFetch('/api/user/upload/list', {
  method: 'GET',
})

const { $profile } = useProfile()
const maxStorage = computed(() => {
  switch ($profile.subscription.plan) {
    case 'S':
      return 50 * 1024 * 1024 // 50 MB
    case 'L':
      return 200 * 1024 * 1024 // 100 MB
    default:
      return 10 * 1024 * 1024 // 10 MB
  }
})

const storageUsedMb = computed(() => {
  return files.value ? (files.value.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)) : 0
})

const storageUsedPercent = computed(() => {
  return maxStorage.value ? (storageUsedMb.value / (maxStorage.value / (1024 * 1024)) * 100) : 0
})
</script>

<template>
  <USlideover
    :open="showWebsiteFiles"
    side="left"
    :close="{
      size: 'md',
      onClick: () => {
        go('#website')
      },
    }"
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
        Dateien und Bilder
      </h3>
      <UButton
        icon="i-heroicons-x-mark"
        variant="ghost"
        color="neutral"
        size="md"
        class="ml-auto"
        @click="go('#website')"
      />
    </template>

    <template #body>
      <UButton
        label="Dateien oder Bilder hochladen"
        icon="i-lucide-file-image"
        class="w-full rounded-none p-4 border-b border-primary-200"
        variant="soft"
        trailing-icon="i-heroicons-plus"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
      />

      <TransitionGroup name="fade">
        <ProfileAdminWebsiteFilesFile
          v-for="file in files"
          :key="file.name"
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
