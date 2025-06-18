<script setup lang="ts">
const { data: files } = await useFetch<UploadedFile[]>(`/api/files`)

const toast = useToast()

const emit = defineEmits(['refreshFiles'])

const { public: { s3Endpoint } } = useRuntimeConfig()

const isDeletingKey = ref<string | null>(null)

const deleteFile = async (file: UploadedFile) => {
  if (isDeletingKey.value === file.key) {
    return
  }
  isDeletingKey.value = file.key
  await $fetch(`/api/files/delete`, {
    method: 'POST',
    body: {
      key: file.key,
    },
  })
  isDeletingKey.value = null
  emit('refreshFiles', file)
  toast.add({
    title: 'Datei gelöscht',
    description: `Die Datei ${file.name} wurde erfolgreich gelöscht.`,
    color: 'success',
  })
}
</script>

<template>
  <div class="@container">
    <div class="grid @sm:grid-cols-2 @md:grid-cols-3 gap-4">
      <div
        v-for="file in files"
        :key="file.key"
        class="bg-white border border-gray-200 rounded-lg p-1"
      >
        <div
          v-if="file.type === 'pdf'"
          class="w-full h-40 flex flex-col items-center justify-center text-center"
        >
          <UIcon
            name="i-heroicons-document-text"
            class="text-gray-400 size-12"
          />
        </div>
        <img
          v-else
          :src="`${s3Endpoint}/mktcms/${file.key}`"
          alt="Kein Bild"
          class="w-full h-40 object-cover object-center rounded-lg checkered-background"
        >
        <div class="text-sm text-gray-500 mt-2 line-clamp-1">
          {{ file.name }}
        </div>
        <div class="flex items-center justify-between mt-2">
          <UButton
            size="sm"
            variant="soft"
            :to="`${s3Endpoint}/mktcms/${file.key}`"
            target="_blank"
            label="Öffnen"
            trailing-icon="i-heroicons-arrow-top-right-on-square"
          />
          <UButton
            size="sm"
            color="error"
            variant="soft"
            label="Löschen"
            icon="i-heroicons-trash"
            :loading="isDeletingKey === file.key"
            @click="deleteFile(file)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
