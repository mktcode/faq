<script setup lang="ts">
const toast = useToast()

const emit = defineEmits(['update'])

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
  offers: currentSettings.value?.offers || [],
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
    <div
      v-for="(offer, index) in form.offers"
      :key="index"
      class="flex flex-col gap-4"
    >
      <UButton
        icon="i-heroicons-trash"
        variant="soft"
        color="error"
        class="self-end"
        @click="form.offers.splice(index, 1)"
      />
      <UFormField
        label="Titel"
        description="Der Titel deines Angebots"
      >
        <UInput
          v-model="offer.title"
          placeholder="Website erstellen"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Beschreibung"
        description="Beschreibe dein Angebot"
      >
        <WysiwygEditor
          v-model="offer.description"
          placeholder="Hier kannst du deinen Willkommenstext eingeben..."
        />
      </UFormField>
    </div>
    <UButton
      icon="i-heroicons-plus"
      variant="soft"
      color="neutral"
      class="w-full"
      @click="form.offers.push({ title: '', description: '' })"
    >
      Angebot hinzufügen
    </UButton>
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
