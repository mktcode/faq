<script setup lang="ts">
import type { Qanda } from '~/types/db'

definePageMeta({
  validate: async (route) => {
    return (
      typeof route.params.username === 'string' && /^\w+$/.test(route.params.username)
      && typeof route.params.catalogId === 'string' && /^\d+$/.test(route.params.catalogId)
    )
  },
})

const route = useRoute()

const qanda = ref<Qanda[]>([])
const question = ref('')
const existingAnswers = ref([
  'Mktcode is a marketing automation tool.',
  'You can use Mktcode to automate your marketing campaigns.',
])
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 min-h-screen max-w-lg mx-auto py-12">
    <div class="size-16 rounded-full bg-gray-200" />
    <h1 class="mb-12">
      Ask {{ route.params.username }} catalog {{ route.params.catalogId }}
    </h1>
    <p class="text-gray-600">
      Wenn Ihre Frage nicht beantwortet wird, können Sie uns gerne unter 0800 123 4567 oder per E-Mail an anfrage@meinefirma.de kontaktieren.
    </p>
    <div class="w-full flex items-center justify-center gap-2 mb-4">
      <UButton
        icon="i-heroicons-link"
        variant="soft"
      />
      <UButton
        icon="i-heroicons-globe-alt"
        variant="soft"
      />
      <UButton
        icon="i-heroicons-information-circle"
        variant="soft"
      />
    </div>
    <div class="w-full">
      <UTextarea
        v-model="question"
        placeholder="Enter your question"
        class="w-full"
        :ui="{
          base: 'rounded-b-none',
        }"
      />
      <div class="bg-gray-100 rounded-b-lg p-2 flex items-center gap-2">
        <UButton
          icon="i-heroicons-microphone"
          class="ml-auto"
          variant="soft"
        />
      </div>
    </div>
    <div
      v-if="question.length > 10"
      class="w-full p-2 bg-blue-50 rounded-lg flex flex-col"
    >
      {{ existingAnswers[0] }}
      <div class="flex items-center justify-end gap-2">
        Ist diese Antwort hilfreich?
        <UButton
          label="Ja"
          variant="soft"
        />
        <UButton
          label="Nein"
          variant="soft"
        />
      </div>
    </div>
    <UButton
      to="/ask/mktcode"
      label="Ask"
      block
    />
    <div>
      <div
        v-for="item in qanda"
        :key="item.question"
      >
        <h3 class="text-lg font-semibold mt-4">
          {{ item.question }}
        </h3>
        <p class="text-gray-600">
          {{ item.answer }}
        </p>
      </div>
    </div>
    <div class="flex gap-2 mt-12">
      <ULink
        to="/ask/mktcode"
      >
        Impressum
      </ULink>
      <ULink
        to="/ask/mktcode"
      >
        Datenschutz
      </ULink>
    </div>
  </div>
</template>
