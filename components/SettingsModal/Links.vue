<script setup lang="ts">
const toast = useToast()

const emit = defineEmits(['update'])

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
  links: currentSettings.value?.links || [],
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
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <UButton
          icon="i-heroicons-information-circle"
          variant="soft"
        />
        <UInput
          placeholder="https://..."
          class="flex-1"
        />
        <UButton
          icon="i-heroicons-trash"
          variant="ghost"
          color="neutral"
        />
      </div>
      <div class="flex items-center gap-2">
        <UButton
          icon="i-heroicons-plus"
          variant="soft"
        />
        <UInput
          placeholder="https://..."
          class="flex-1 opacity-40"
          disabled
        />
      </div>
    </div>
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
