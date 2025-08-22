<script setup lang="ts">
const showModal = useState('showLinksModal', () => false)
const { settings, saveSettings } = await useProfile()
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <USwitch
          v-model="settings.header.showShareButton"
          label="Teilen-Button anzeigen"
        />
        <div
          v-for="(link, index) in settings.header.links"
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
            @click="settings.header.links.splice(index, 1)"
          />
        </div>
        <UButton
          label="Link hinzufügen"
          icon="i-heroicons-plus"
          variant="soft"
          color="neutral"
          @click="settings.header.links.push({ title: '', url: '', icon: 'i-lucide-link' })"
        />
      </div>
      <UButton
        label="Einstellungen speichern"
        variant="solid"
        color="primary"
        class="mt-4"
        @click="saveSettings"
      />
    </template>
  </UModal>
</template>
