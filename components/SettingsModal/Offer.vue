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
    <p class="text-gray-400">
      Füge hier Texte zu deinen Angeboten und Dienstleistungen hinzu. Halte dich kurz und prägnant, damit deine Kunden schnell verstehen, was du anbietest.
    </p>
    <div
      v-for="(offer, index) in form.offers"
      :key="index"
      class="flex flex-col gap-4 border-b border-gray-200 pb-4"
    >
      <div class="flex items-center gap-4">
        <UFormField label="Titel" class="flex-1">
          <UInput
            v-model="offer.title"
            placeholder="Website erstellen"
            class="w-full"
          />
        </UFormField>
        <UButton
          icon="i-heroicons-trash"
          variant="soft"
          color="error"
          class="self-end"
          @click="form.offers.splice(index, 1)"
        />
      </div>
      <UFormField label="Beschreibung">
        <WysiwygEditor
          v-model="offer.description"
          placeholder="Hier kannst du deinen Willkommenstext eingeben..."
        />
      </UFormField>
    </div>
    <UButton
      icon="i-heroicons-plus"
      variant="soft"
      class="w-full"
      @click="form.offers.push({ title: '', description: '' })"
    >
      Angebot hinzufügen
    </UButton>
    <UButton
      variant="solid"
      color="primary"
      @click="saveSettings"
    >
      Einstellungen speichern
    </UButton>
  </div>
</template>
