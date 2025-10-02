<script setup lang="ts">
import type { FileMeta } from '~~/types/files'

const showImageCropper = useState('showImageCropper', () => false)
const showDeleteModal = ref(false)

const toast = useToast()

const open = ref(false)

const { file } = defineProps<{
  file: FileMeta
}>()

const emit = defineEmits<{
  refresh: []
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

const deletingFile = ref(false)

async function deleteFile() {
  if (deletingFile.value) return
  deletingFile.value = true

  try {
    await $fetch('/api/user/upload/delete', {
      method: 'POST',
      body: {
        url: file.url,
      },
    })
    open.value = false
    emit('refresh')
  } catch (error) {
    toast.add({
      title: 'Fehler',
      icon: 'i-heroicons-exclamation-circle',
      description: 'Die Datei konnte nicht gelöscht werden. Bitte versuche es später erneut.',
      color: 'error',
      progress: false,
    })
  } finally {
    deletingFile.value = false
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
        <template v-if="file.type === 'image'">
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
          :src="file.url + '?t=' + Date.now()"
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
          download
        />
        <UButton
          v-if="file.type === 'image'"
          label="Bild zuschneiden"
          icon="i-heroicons-scissors"
          class="w-full"
          variant="soft"
          @click="showImageCropper = true"
        />
        <ClientOnly>
          <ProfileAdminWebsiteFilesImageCropper
            v-if="file.type === 'image'"
            :image-url="file.url"
            @refresh="$emit('refresh')"
          />
        </ClientOnly>
        <UButton
          label="Löschen"
          icon="i-heroicons-trash"
          class="w-full"
          variant="soft"
          color="error"
          @click="showDeleteModal = true"
        />
        <UModal
          v-model:open="showDeleteModal"
          title="Datei löschen"
        >
          <template #body>
            <p>Möchtest du die Datei wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.</p>
          </template>

          <template #footer>
            <UButton
              label="Abbrechen"
              variant="ghost"
              color="neutral"
              @click="showDeleteModal = false"
            />
            <UButton
              label="Löschen"
              variant="solid"
              color="error"
              :loading="deletingFile"
              @click="deleteFile"
            />
          </template>
        </UModal>
      </div>
    </template>
  </UCollapsible>
</template>