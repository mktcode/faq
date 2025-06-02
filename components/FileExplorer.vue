<script setup lang="ts">
const { public: { s3Endpoint } } = useRuntimeConfig()
const { data: files, refresh } = await useFetch('/api/files')
const showModal = ref(false)

withDefaults(defineProps<{
  buttonLabel?: string
}>(), {
  buttonLabel: 'Bild auswählen',
})

const emit = defineEmits<{
  select: [image: string]
}>()

function onSelect(image: string) {
  showModal.value = false
  emit('select', image)
}
</script>

<template>
  <UModal
    v-model:open="showModal"
    title="Bild auswählen"
    icon="i-heroicons-photo"
    size="xl"
  >
    <UButton
      :label="buttonLabel"
      icon="i-heroicons-photo"
    />

    <template #body>
      <div class="flex items-center justify-center w-full mb-4">
        <DropZone
          height="h-32"
          icon-size="size-12"
          :compact="true"
          @refresh-files="refresh"
        />
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="file in files"
          :key="file.key"
          class="cursor-pointer"
          @click="onSelect(file.key)"
        >
          <img
            :src="`${s3Endpoint}/mktcms/${file.key}`"
            alt="Kein Bild"
            class="w-full h-40 object-cover object-center rounded-lg opacity-90 hover:opacity-100 checkered-background"
          >
        </div>
      </div>
    </template>
  </UModal>
</template>
