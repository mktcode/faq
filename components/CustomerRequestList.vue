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
      <div
        v-for="request in customerRequests"
        :key="request.id"
        class="p-4 border border-gray-200 rounded-lg"
      >
        <h4 class="font-semibold">
          {{ request.name }}
          <span class="text-gray-400 text-sm ml-2">
            Am {{ new Date(request.createdAt).toLocaleDateString() }}
          </span>
        </h4>
        <div class="text-gray-600 my-2">
          {{ request.message }}
        </div>
        <div class="text-gray-400">
          <p>{{ request.email }}</p>
          <p>{{ request.phone }}</p>
        </div>
        <div class="mt-4 flex gap-2 justify-end">
          <UButton
            label="Antwort aus FAQ"
            icon="i-heroicons-chat-bubble-left-right"
            size="lg"
          />
          <UButton
            label="Antworten"
            icon="i-heroicons-chat-bubble-left-right"
            size="lg"
          />
        </div>
      </div>
    </div>
  </div>
</template>
