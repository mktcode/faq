<script setup lang="ts">
const status = ref<'pending' | 'in_progress'>('pending')

const { data: customerRequests } = await useFetch(() => `/api/user/customerRequests?status=${status.value}`)
</script>

<template>
  <div class="w-full max-w-lg mx-auto">
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
    <div
      v-if="customerRequests?.length"
      class="flex flex-col gap-2"
    >
      <CustomerRequestListItem
        v-for="request in customerRequests"
        :key="request.id"
        :customer-request="request"
      />
    </div>
    <div
      v-else
      class="flex flex-col gap-4"
    >
      Keine Anfragen gefunden.
    </div>
  </div>
</template>
