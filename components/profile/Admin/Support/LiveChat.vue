<script setup lang="ts">
const { showSupportLiveChat } = useAdmin()
</script>

<template>
  <USlideover
    v-model:open="showSupportLiveChat"
    side="right"
    close-icon="i-heroicons-arrow-left"
    :close="{
      size: 'md',
    }"
    :ui="{
      wrapper: 'z-40',
      overlay: 'backdrop-blur-xs',
      footer: 'justify-between',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-messages-square"
          class="inline-block size-6 opacity-50"
        />
        Live-Chat
      </h3>
    </template>

    <template #body>
      
    </template>
  </USlideover>
</template>