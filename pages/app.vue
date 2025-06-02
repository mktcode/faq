<script setup lang="ts">
const catalogs = ref([
  {
    label: 'Catalog 1',
    description: 'Description for Catalog 1',
    image: 'https://via.placeholder.com/150',
  },
  {
    label: 'Catalog 2',
    description: 'Description for Catalog 2',
    image: 'https://via.placeholder.com/150',
  },
])
const selectedCatalog = ref(null)

const question = ref('')
const newQuestion = ref('')
const newAnswer = ref('')
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 h-screen max-w-lg mx-auto">
    <div class="w-full flex items-center gap-2">
      <USelect
        v-model="selectedCatalog"
        :items="catalogs"
        placeholder="Select a catalog"
        class="flex-1"
      />
      <UButton
        icon="i-heroicons-cog-6-tooth"
      />
    </div>
    <UButton
      to="/ask/mktcode"
      label="autofaq.com/ask/mktcode"
      trailing-icon="i-heroicons-arrow-right"
      variant="soft"
      block
    />
    <UTextarea
      v-model="question"
      placeholder="Enter your question"
      class="w-full"
    />
    <UButton
      label="Ask"
      block
    />
    <div class="py-6" />
    <div class="w-full flex items-center justify-between gap-2">
      <h3 class="text-lg font-semibold mt-4">
        New Question and Answer
      </h3>
      <UButton
        label="Import"
      />
    </div>
    <UTextarea
      v-model="newQuestion"
      placeholder="Enter your question"
      class="w-full"
    />
    <UTextarea
      v-model="newAnswer"
      placeholder="Enter your answer"
      class="w-full"
    />
    <UButton
      label="Save"
      block
    />
  </div>
</template>
