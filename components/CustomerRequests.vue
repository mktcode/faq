<script setup lang="ts">
const status = ref<'pending' | 'in_progress'>('pending')
</script>

<template>
  <div class="w-full max-w-lg px-6 mx-auto">
    <h3 class="text-2xl font-bold mb-4">
      Anfragen
    </h3>
    <div class="flex gap-2 mb-6 flex-wrap">
      <UButton
        label="Neu"
        size="md"
        :variant="status === 'pending' ? 'solid' : 'soft'"
        @click="status = 'pending'"
      />
      <UButton
        label="Bearbeitet"
        :variant="status === 'in_progress' ? 'solid' : 'soft'"
        size="md"
        @click="status = 'in_progress'"
      />
    </div>
    <CustomerRequestList :status="status" />
  </div>
</template>
