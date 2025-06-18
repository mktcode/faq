<script setup lang="ts">
import DropZone from '../DropZone.vue'

const toast = useToast()

const emit = defineEmits(['update'])

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
  gallery: currentSettings.value?.gallery || [],
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
  emit('update')
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <DropZone />
    <FilesGrid />
    <FileExplorer />
    <UButton
      variant="solid"
      color="primary"
      class="mt-4"
      @click="saveSettings"
    >
      Einstellungen speichern
    </UButton>
  </div>
</template>
