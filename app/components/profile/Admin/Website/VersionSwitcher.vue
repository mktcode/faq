<script setup lang="ts">
const { data: versions, refresh: refreshVersions } = await useFetch('/api/user/settings/versions')

async function copyVersion(versionId: number) {
  const newVersion = await $fetch('/api/user/settings/versions/copy', {
    method: 'POST',
    body: { versionId },
  })

  await refreshVersions()
}
</script>

<template>
  <UPopover
    :content="{
      align: 'center',
      side: 'bottom',
    }"
    :ui="{
      content: 'max-w-sm',
    }"
  >
    <UButton
      label="Versionen"
      icon="i-lucide-timer-reset"
      variant="soft"
      size="md"
      class="ml-2"
    />

    <template #content>
      <div class="flex flex-col gap-2 p-2">
        <div
          v-for="version in versions"
          :key="version.id"
          class="flex gap-2"
        >
          <UBadge
            :color="version.id === $profile.settingsId ? 'success' : 'neutral'"
            variant="soft"
          >
            {{ version.id === $profile.settingsId ? 'online' : 'privat' }}
          </UBadge>
          <UBadge
            :color="version.id === $profile.settingsId ? 'primary' : 'neutral'"
            variant="soft"
          >
            {{ version.id === $profile.settingsId ? 'ausgewählt' : '' }}
          </UBadge>
          <div class="flex-grow text-left">
            <div class="text-sm font-medium">
              {{ new Date(version.createdAt).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) }}
            </div>
            <div class="text-xs text-neutral-500">
              {{ version.note || 'Keine Notiz' }}
            </div>
          </div>
          <UButton
            icon="i-lucide-copy"
            variant="ghost"
            size="md"
            @click="copyVersion(version.id)"
          />
          <UButton
            icon="i-lucide-pencil"
            variant="ghost"
            size="md"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>