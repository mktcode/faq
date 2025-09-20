<script setup lang="ts">
import type { UploadedFile } from '~~/server/utils/s3';

const open = ref(false)

defineProps<{
  file: UploadedFile
}>()

function fileKeyToLabel(key: string) {
  const parts = key.split('/')
  // remove user id
  parts.splice(0, 1)

  return {
    path: parts.slice(0, -1).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('/'),
    name: parts[parts.length - 1],
  }
}
</script>

<template>
  <UCollapsible
    v-model:open="open"
    class="flex flex-col border-b border-gray-200"
  >
    <UButton
      class="w-full flex rounded-none p-0 pr-4 gap-0"
      variant="ghost"
      color="neutral"
      trailing-icon="i-heroicons-chevron-down"
      :ui="{
        trailingIcon: 'ml-auto opacity-30',
      }"
    >
      <template #default>
        <template v-if="['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(file.type)">
          <img
            :src="file.url"
            alt="Vorschaubild"
            class="inline-block size-14 object-cover"
          />
        </template>

        <div class="text-left truncate p-2">
          <div class="text-xs opacity-50 font-normal">
            {{ fileKeyToLabel(file.key).path || 'Hauptverzeichnis' }}
          </div>
          <div class="font-medium truncate">
            {{ fileKeyToLabel(file.key).name }}
          </div>
        </div>
      </template>
    </UButton>

    <template #content>
      <div class="p-4 flex flex-col gap-2">
        <img
          :src="file.url"
          alt="Vorschaubild"
          class="w-full max-h-96 object-contain bg-gray-50 rounded-lg border border-gray-200 p-1"
        />
        <UButton
          label="Datei herunterladen"
          icon="i-heroicons-arrow-down-tray"
          class="w-full"
          variant="soft"
          color="primary"
          :href="file.url"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </template>
  </UCollapsible>
</template>