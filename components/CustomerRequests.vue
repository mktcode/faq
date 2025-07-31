<script setup lang="ts">
const status = ref<'pending' | 'in_progress'>('pending')

const { data: customerRequests } = await useFetch(() => `/api/user/customerRequests?status=${status.value}`)
</script>

<template>
  <div class="w-full">
    <DismissableAlert
      title="Anfragen"
      storage-key="customer-requests-info-dismissed"
      class="rounded-none"
    >
      Hier finden Sie alle Anfragen, die Sie über Ihre Website von Kunden erhalten.
      Wurde eine E-Mail-Adresse hinterlassen, können Sie direkt antworten.
      In den Einstellungen können Sie festlegen, ob Sie bei neuen Anfragen eine E-Mail-Benachrichtigung erhalten möchten.
    </DismissableAlert>
    <div class="flex gap-2 flex-wrap p-4">
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
      class="flex flex-col gap-4 items-center justify-center p-8 text-gray-500"
    >
      Keine Anfragen gefunden.
    </div>
  </div>
</template>
