<script setup lang="ts">
const toast = useToast()

const emit = defineEmits(['update'])

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
  color: currentSettings.value?.color || 'sky',
  font: currentSettings.value?.font || 'roboto',
  rounded: currentSettings.value?.rounded || 'md',
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
    <UButton
      icon="i-heroicons-photo"
      variant="soft"
      color="neutral"
      block
      class="size-20 rounded-full mx-auto"
    />
    <div class="flex gap-2">
      <ColorPicker v-model:color="form.color" />
      <UFormField
        label="Stil"
        class="flex-1"
      >
        <USelect
          v-model="form.rounded"
          class="w-full"
          :items="[
            { label: 'Eckig', value: 'none' },
            { label: 'Rund', value: 'md' },
            { label: 'Sehr rund', value: 'xl' },
          ]"
        />
      </UFormField>
    </div>
    <FontPicker v-model:font="form.font" />
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
