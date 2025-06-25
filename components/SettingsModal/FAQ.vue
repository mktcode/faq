<script setup lang="ts">
const suggestions = ref<{
  id: number | null
  question: string
  answer: string
  original: {
    id: number
    question: string
    answer: string
  } | null
}[]>([])

const isIntegrating = ref(false)

async function integrate() {
  if (isIntegrating.value) return
  isIntegrating.value = true

  const response = await $fetch('/api/user/qanda/integrate', {
    method: 'POST',
  })

  isIntegrating.value = false
  suggestions.value = response || []
}
</script>

<template>
  <div class="flex flex-col gap-2 p-6">
    <div
      v-for="(suggestion, index) in suggestions"
      :key="index"
      class="flex flex-col gap-2 p-3 border border-gray-300 rounded-lg"
    >
      <h3 class="text-lg font-semibold flex justify-between">
        {{ suggestion.question }}
        <UBadge
          :label="suggestion.id === null ? 'Neu' : 'Aktualisierung'"
          variant="soft"
          :color="suggestion.id === null ? 'success' : 'primary'"
        />
      </h3>
      <h3
        v-if="suggestion.original"
        class="text-sm text-gray-500 line-through"
      >
        {{ suggestion.original.question }}
      </h3>
      <p class="text-sm text-gray-600">
        {{ suggestion.answer }}
      </p>
      <p
        v-if="suggestion.original"
        class="text-sm text-gray-500 line-through"
      >
        {{ suggestion.original.answer }}
      </p>
      <div class="flex gap-2 mt-2">
        <UButton
          label="Akzeptieren"
          icon="i-heroicons-check"
          variant="solid"
          size="md"
          class="flex-1"
        />
        <UButton
          label="Ablehnen"
          icon="i-heroicons-x-mark"
          variant="soft"
          size="md"
          class="flex-1"
        />
      </div>
    </div>
    <UButton
      class="mt-4"
      label="Korrespondenz prüfen"
      icon="i-heroicons-magnifying-glass"
      variant="soft"
      block
      :disabled="isIntegrating"
      :loading="isIntegrating"
      @click="integrate"
    />
  </div>
</template>
