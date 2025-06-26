<script setup lang="ts">
const { status } = defineProps<{
  status: 'pending' | 'in_progress'
}>()

const { data: customerRequests } = await useFetch('/api/user/customerRequests', {
  query: {
    status,
  },
})
</script>

<template>
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
</template>
