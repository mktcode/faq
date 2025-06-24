<script setup lang="ts">
import type { CustomerRequest } from '~/types/db'

const customerRequests = ref<CustomerRequest[]>([])

async function loadCustomerRequests() {
  const response = await $fetch('/api/user/customerRequests', {
    query: {
      status: status.value,
    },
  })

  customerRequests.value = response
}

const status = ref('pending')
watch(status, loadCustomerRequests, { immediate: true })
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
    <div
      v-if="customerRequests.length"
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
