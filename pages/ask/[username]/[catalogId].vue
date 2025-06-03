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
const question = ref('Was ist der Sinn des Lebens?')
const existingAnswers = ref([
  'Mktcode is a marketing automation tool.',
  'You can use Mktcode to automate your marketing campaigns.',
])

const showSuggestedAnswer = computed(() => question.value.length > 10)

onMounted(async () => {
  const data = await $fetch(`/api/qanda`, {
    query: {
      catalogId: route.params.catalogId,
    },
  })

  qanda.value = data as Qanda[]
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 min-h-screen max-w-lg mx-auto py-12">
    <div class="size-16 rounded-full bg-gray-200 mb-4" />
    <div class="w-full flex items-center justify-center gap-2 mb-4">
      <UButton
        icon="i-heroicons-information-circle"
        variant="soft"
      />
      <UButton
        icon="i-heroicons-calendar-days"
        variant="soft"
      />
      <UButton
        icon="i-heroicons-shopping-cart"
        variant="soft"
      />
      <UButton
        icon="i-lucide-instagram"
        variant="soft"
      />
    </div>
    <h3 class="text-2xl font-semibold mb-4">
      Wie können wir Ihnen helfen?
    </h3>
    <div class="w-full">
      <UTextarea
        v-model="question"
        placeholder="Ihr Anliegen oder Ihre Fragen"
        class="w-full"
        :ui="{
          base: 'rounded-b-none text-xl p-3',
        }"
      />
      <div class="bg-gray-100 rounded-b-lg p-2 flex items-center gap-2">
        <Transition name="fade">
          <div v-if="question">
            <UButton
              icon="i-heroicons-x-mark"
              label="leeren"
              class="mr-auto opacity-60 hover:opacity-100"
              variant="ghost"
              color="neutral"
              @click="question = ''"
            />
          </div>
        </Transition>
        <UButton
          icon="i-heroicons-microphone"
          class="ml-auto"
          variant="soft"
        />
      </div>
    </div>
    <Transition name="fade">
      <div
        v-if="showSuggestedAnswer"
        class="w-full p-3 bg-sky-50 rounded-lg flex flex-col text-sky-800 border border-sky-200"
      >
        <div class="text-sm text-sky-900/60 mb-2">
          Was ist der Sinn des Lebens?
        </div>
        {{ existingAnswers[0] }}
        <div class="flex items-center justify-end gap-2 mt-4 text-sm text-sky-600">
          Ist diese Antwort hilfreich?
          <UButton
            label="Ja"
            variant="soft"
            size="sm"
          />
          <UButton
            label="Nein"
            variant="soft"
            size="sm"
          />
        </div>
      </div>
    </Transition>
    <UButton
      :to="`/ask/${route.params.username}/${route.params.catalogId}`"
      label="Individuelle Antwort erhalten"
      block
    />
    <div class="flex flex-col gap-4 w-full mt-12">
      <h3 class="text-2xl font-semibold">
        {{ showSuggestedAnswer ? 'Weitere Antworten' : 'Häufig gestellte Fragen' }}
      </h3>
      <div
        v-for="item in qanda"
        :key="item.question"
        class="p-4 bg-white rounded-lg border border-gray-200"
      >
        <h3 class="text-lg font-semibold">
          {{ item.question }}
        </h3>
        <p class="text-gray-600">
          {{ item.answer }}
        </p>
      </div>
    </div>
    <div class="flex gap-2 mt-12 text-sm">
      <ULink class="text-gray-400">
        Impressum
      </ULink>
      <ULink class="text-gray-400">
        Datenschutz
      </ULink>
    </div>
  </div>
</template>
