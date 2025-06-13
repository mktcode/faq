<script setup lang="ts">
const { data: customerRequests } = await useFetch('/api/user/customerRequests')
</script>

<template>
  <div class="w-full mt-6">
    <h3 class="text-2xl font-bold mb-4">
      Anfragen
    </h3>
    <div class="flex gap-2 mb-6 flex-wrap">
      <UButton
        label="Neu"
        size="md"
      />
      <UButton
        label="Alle"
        variant="soft"
        size="md"
      />
    </div>
    <div class="flex flex-col gap-2">
      <CustomerRequestListItem
        v-for="request in customerRequests"
        :key="request.id"
        :customer-request="request"
      />
    </div>
  </div>
</template>
