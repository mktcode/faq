<script setup lang="ts">
const toast = useToast()
const showModal = useState('showLinksModal', () => false)

const { settings, refreshSettings } = await useProfile()

const form = ref({
  links: settings.value?.links || [],
  showShareButton: settings.value?.showShareButton || true,
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
  refreshSettings()
}
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <USwitch
          v-model="form.showShareButton"
          label="Teilen-Button anzeigen"
        />
        <div
          v-for="(link, index) in form.links"
          :key="index"
          class="flex items-start gap-2"
        >
          <IconPicker v-model:icon="link.icon" />
          <div class="flex flex-col gap-2 flex-1">
            <UInput
              v-model="link.title"
              placeholder="Instagram"
              class="flex-1"
            />
            <UInput
              v-model="link.url"
              placeholder="https://..."
              class="flex-1"
            />
          </div>
          <UButton
            icon="i-heroicons-trash"
            variant="ghost"
            color="neutral"
            @click="form.links.splice(index, 1)"
          />
        </div>
        <UButton
          label="Link hinzufügen"
          icon="i-heroicons-plus"
          variant="soft"
          color="neutral"
          @click="form.links.push({ title: '', url: '', icon: 'i-lucide-link' })"
        />
      </div>
      <UButton
        variant="solid"
        color="primary"
        class="mt-4"
        @click="saveSettings"
      >
        Einstellungen speichern
      </UButton>
    </template>
  </UModal>
</template>
