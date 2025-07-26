<script setup lang="ts">
const showModal = useState('showMailModal', () => false)
</script>

<template>
  <UModal v-model:open="showModal">
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-envelope"
          class="inline-block size-6 opacity-50"
        />
        Anfragen
      </h3>
    </template>
    <template #body>
      <CustomerRequests />
    </template>
  </UModal>
</template>
