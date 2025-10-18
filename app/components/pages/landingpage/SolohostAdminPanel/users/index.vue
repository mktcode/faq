<script setup lang="ts">
const { data: users, refresh } = await useFetch('/api/admin/users/all')

const userExpandedId = ref<number | null>(null)
</script>

<template>
  <UPopover
    :ui="{
      content: 'overflow-hidden',
    }"
  >
    <UButton
      icon="i-heroicons-users"
      label="Benutzer"
      color="neutral"
      variant="soft"
    />

    <template #content>
      <PagesLandingpageSolohostAdminPanelUsersUser
        v-for="user in users"
        :key="user.id"
        :user="user"
        :expanded="userExpandedId === user.id"
        @update-users="() => refresh()"
        @expand="userExpandedId = user.id"
        @collapse="userExpandedId = null"
      />
    </template>
  </UPopover>
</template>