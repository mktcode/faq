<script setup lang="ts">
const { version } = defineProps<{
  version: {
    id: number
    createdAt: string
    note: string | null
  }
}>()

const { user } = useUserSession()

const showDeleteModal = ref(false)
const showPublishModal = ref(false)

const emit = defineEmits(['refresh'])

async function copyVersion() {
  await $fetch('/api/user/settings/versions/copy', {
    method: 'POST',
    body: { versionId: version.id },
  })

  emit('refresh')
}
  
async function deleteVersion() {
  await $fetch('/api/user/settings/versions/delete', {
    method: 'POST',
    body: { versionId: version.id },
  })

  showDeleteModal.value = false
  emit('refresh')
}

async function publishVersion() {
  await $fetch('/api/user/settings/versions/publish', {
    method: 'POST',
    body: { versionId: version.id },
  })

  showPublishModal.value = false
  emit('refresh')
}

async function editVersion() {
  await $fetch('/api/user/settings/versions/edit', {
    method: 'POST',
    body: { versionId: version.id },
  })

  emit('refresh')
}
</script>

<template>
  <div class="flex flex-col gap-2 border border-neutral-200 rounded-md p-2">
    <div class="flex gap-2 justify-between w-full">
      <div class="text-sm font-medium">
        {{ new Date(version.createdAt).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) }}
      </div>
      <UButton
        v-if="$profile.settingsId !== version.id"
        icon="i-lucide-rocket"
        label="veröffentlichen"
        variant="soft"
        size="md"
        @click="showPublishModal = true"
      />
      <UBadge
        v-else
        label="öffentliche Version"
        variant="outline"
        color="success"
        size="md"
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
          @click="copyVersion"
        />
        <UButton
          v-if="version.id !== user?.editSettingsId"
          icon="i-lucide-pencil"
          label="bearbeiten"
          variant="soft"
          size="md"
          @click="editVersion"
        />
        <UBadge
          v-else
          label="in Bearbeitung"
          variant="outline"
          color="neutral"
          size="md"
        />
        <UButton
          v-if="$profile.settingsId !== version.id"
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
          @click="deleteVersion"
        />
      </template>
    </UModal>

    <UModal
      v-model:open="showPublishModal"
      title="Version veröffentlichen"
    >
      <template #body>
        <p>Möchtest du diese Version der Website wirklich veröffentlichen? Sie wird dann für alle Besucher sichtbar sein.</p>
      </template>

      <template #footer>
        <UButton
          label="Abbrechen"
          variant="ghost"
          color="neutral"
          @click="showPublishModal = false"
        />
        <UButton
          label="Veröffentlichen"
          variant="solid"
          color="primary"
          @click="publishVersion"
        />
      </template>
    </UModal>
  </div>
</template>