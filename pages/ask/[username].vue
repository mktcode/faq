<script setup lang="ts">
import type { Qanda } from '~/types/db'

definePageMeta({
  validate: async (route) => {
    return (
      typeof route.params.username === 'string' && /^\w+$/.test(route.params.username)
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
const topics = ref([
  'Marketing Automation',
  'Social Media Marketing',
  'Content Marketing',
  'Email Marketing',
  'SEO',
])
const selectedTopic = ref('Marketing Automation')

const showSuggestedAnswer = computed(() => question.value.length > 10)

type FaqResponse = {
  qanda: {
    question: string
    answer: string
  }[]
  contactMessage: string
}
const faqResponse = ref<FaqResponse>({
  qanda: [],
  contactMessage: '',
})
const isGeneratingResponse = ref(false)
async function generateResponse() {
  if (isGeneratingResponse.value) return

  isGeneratingResponse.value = true

  await new Promise(resolve => setTimeout(resolve, 1000))

  faqResponse.value = {
    qanda: [
      {
        question: 'Wie kann ich meine Marketingkampagne verbessern?',
        answer: 'Das kann man so nicht pauschal beantworten. Es hängt von vielen Faktoren ab, wie z.B. der Branche, dem Produkt und der Zielgruppe.',
      },
      {
        question: 'Welche Marketingkanäle sollte ich nutzen?',
        answer: 'Das hängt von Ihrer Zielgruppe ab. Social Media, E-Mail-Marketing und Content-Marketing sind jedoch sehr effektiv.',
      },
    ],
    contactMessage: 'Ich brauche Beratung zu meiner Marketingkampagne.',
  }

  isGeneratingResponse.value = false
}

onMounted(async () => {
  const data = await $fetch(`/api/qanda`, {
    query: {
      username: route.params.username,
    },
  })

  qanda.value = data as Qanda[]
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 min-h-screen max-w-lg mx-auto py-12">
    <div class="size-16 rounded-full bg-gray-100 mb-4 flex items-center justify-center">
      <UIcon
        name="i-heroicons-photo"
        class="size-7 opacity-25"
      />
    </div>
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
    <h3 class="text-2xl font-semibold">
      Wie können wir Ihnen helfen?
    </h3>
    <p class="text-gray-600 mb-6">
      Hier können Sie Ihre Fragen stellen oder Anliegen schildern. Wir werden Ihnen so schnell wie möglich antworten.
    </p>
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
      label="Antwort erhalten"
      block
      :loading="isGeneratingResponse"
      @click="generateResponse"
    />
    <TransitionGroup
      name="fade"
      tag="div"
      class="w-full mt-6 flex flex-col gap-4"
    >
      <div
        v-for="(item, index) in faqResponse.qanda"
        :key="index"
      >
        <h3 class="text-lg font-semibold">
          {{ item.question }}
        </h3>
        <p class="text-gray-600">
          {{ item.answer }}
        </p>
      </div>
    </TransitionGroup>
    <div
      v-if="faqResponse.contactMessage"
      class="w-full mt-6"
    >
      <h3 class="text-lg font-semibold mb-2">
        Kontaktformular
      </h3>
      <p class="text-gray-600 mb-4">
        Wenn Sie weitere Fragen haben oder Unterstützung benötigen, können Sie uns hier kontaktieren.
      </p>
      <div class="flex flex-col gap-4">
        <UFormField
          label="Ihr Name"
        >
          <UInput
            placeholder="Max Mustermann"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Ihre E-Mail"
        >
          <UInput
            type="email"
            placeholder="muster@beisppiel.de"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Ihre Telefonnummer"
        >
          <UInput
            type="tel"
            placeholder="+49 123 4567890"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Ihre Nachricht"
        >
          <UTextarea
            placeholder="Ihre Nachricht"
            class="w-full"
            :value="faqResponse.contactMessage"
          />
        </UFormField>
        <UButton
          label="Senden"
          icon="i-heroicons-paper-airplane"
          variant="soft"
          class="ml-auto mt-2"
        />
      </div>
    </div>
    <div class="flex flex-col gap-4 w-full mt-12">
      <h3 class="text-2xl font-semibold">
        {{ showSuggestedAnswer ? 'Weitere Antworten' : 'Häufig gestellte Fragen' }}
      </h3>
      <UButton
        label="Frage und Antwort hinzufügen"
        icon="i-heroicons-plus"
        variant="soft"
      />
      <USelect
        v-model="selectedTopic"
        :items="topics"
      />
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
    <div class="w-full flex gap-2 mt-12 text-sm">
      <UButton
        class="text-gray-400 mr-auto"
        icon="i-heroicons-cog-6-tooth"
        variant="ghost"
        color="neutral"
        size="md"
      >
        Einstellungen
      </UButton>
      <ULink class="text-gray-400">
        Impressum
      </ULink>
      <ULink class="text-gray-400">
        Datenschutz
      </ULink>
    </div>
  </div>
</template>
