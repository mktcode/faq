<script setup lang="ts">
defineProps<{
  version: {
    id: number
    createdAt: string
    note: string | null
  }
}>()

const showDeleteModal = ref(false)

const emit = defineEmits(['copy', 'delete'])

async function copyVersion(versionId: number) {
  await $fetch('/api/user/settings/versions/copy', {
    method: 'POST',
    body: { versionId },
  })

  emit('copy')
}

async function deleteVersion(versionId: number) {
  await $fetch('/api/user/settings/versions/delete', {
    method: 'POST',
    body: { versionId },
  })

  emit('delete')
}
</script>

<template>
  <div class="flex flex-col gap-2 border border-neutral-200 rounded-md p-2">
    <div class="flex gap-2 justify-between w-full">
      <div class="text-sm font-medium">
        {{ new Date(version.createdAt).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) }}
      </div>
      <USwitch
        label="öffentlich"
        :model-value="version.id === $profile.settingsId"
        :disabled="version.id === $profile.settingsId"
      />
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs text-neutral-500">
        {{ version.note || 'Keine Notiz' }}
      </div>
      <div class="flex gap-2">
        <UButton
          icon="i-lucide-copy"
          label="kopieren"
          variant="soft"
          size="md"
          @click="copyVersion(version.id)"
        />
        <UButton
          v-if="version.id !== $profile.settingsId"
          icon="i-lucide-pencil"
          label="bearbeiten"
          variant="soft"
          size="md"
        />
        <UBadge
          v-else
          label="in Bearbeitung"
          variant="outline"
          color="neutral"
          size="md"
        />
        <UButton
          v-if="version.id !== $profile.settingsId"
          icon="i-heroicons-trash"
          label="löschen"
          variant="soft"
          size="md"
          @click="showDeleteModal = true"
        />
      </div>
    </div>

    <UModal
      v-model:open="showDeleteModal"
      title="Version löschen"
    >
      <template #body>
        <p>Möchtest du diese Version der Website wirklich löschen? Das kann nicht rückgängig gemacht werden!</p>
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
          @click="deleteVersion(version.id)"
        />
      </template>
    </UModal>
  </div>
</template>