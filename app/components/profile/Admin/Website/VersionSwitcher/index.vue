<script setup lang="ts">
const { data: versions, refresh: refreshVersions } = await useFetch('/api/user/settings/versions')
const { updateProfile } = useProfile()
const { fetch: fetchUserSession } = useUserSession()

async function refresh() {
  refreshVersions()
  updateProfile()
  fetchUserSession()
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
      <div class="flex flex-col gap-2 p-2 relative">
        <ProfileAdminWebsiteVersionSwitcherVersion
          v-for="version in versions"
          :key="version.id"
          :version="version"
          @refresh="refresh"
        />
      </div>
    </template>
  </UPopover>
</template>