<script setup lang="ts">
const { showSupportRemote, go } = useAdmin()
</script>

<template>
  <USlideover
    :open="showSupportRemote"
    side="right"
    :overlay="false"
    close-icon="i-heroicons-arrow-left"
    :close="{
      size: 'md',
      onClick: () => {
        go('#support')
      }
    }"
    :ui="{
      wrapper: 'z-40',
      overlay: 'backdrop-blur-xs',
      footer: 'justify-between',
      body: '!p-0'
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-laptop-minimal-check"
          class="inline-block size-6 opacity-50"
        />
        Fernwartung
      </h3>
    </template>

    <template #body>
      <UButton
        label="Termin reservieren"
        icon="i-lucide-calendar-check"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="go('#support/remote/book')"
      />

      <UButton
        label="Vorbereitung"
        icon="i-lucide-unplug"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="go('#support/remote/prepare')"
      />

      <ProfileAdminSupportRemoteBook />
      <ProfileAdminSupportRemotePrepare />
    </template>
  </USlideover>
</template>
