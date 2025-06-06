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
const question = ref('')
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
const suggestedAnswerWasUseful = ref<boolean | undefined>(undefined)

const isGeneratingNewAnswer = ref(false)
watch(suggestedAnswerWasUseful, (newValue, oldValue) => {
  if (newValue !== oldValue && newValue === false) {
    isGeneratingNewAnswer.value = true
    setTimeout(() => {
      isGeneratingNewAnswer.value = false
      suggestedAnswerWasUseful.value = undefined
    }, 3000)
  }
})

const showSettingsModal = ref(false)
const showNewQandaModal = ref(false)

const { data: currentSettings, refresh: refreshSettings } = await useFetch(`/api/settings`, {
  query: {
    username: route.params.username,
  },
})

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

const appConfig = useAppConfig()
const font = 'roboto'
appConfig.ui.colors.primary = 'sky'
</script>

<template>
  <FontWrapper :font="font">
    <div class="flex flex-col items-center justify-center gap-2 min-h-screen max-w-lg mx-auto py-12">
      <div class="size-16 rounded-full bg-gray-100 flex items-center justify-center">
        <UIcon
          name="i-heroicons-photo"
          class="size-7 opacity-25"
        />
      </div>
      <h1 class="text-lg font-bold mb-4">
        {{ currentSettings?.title || route.params.username }}
      </h1>
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
      <p class="text-gray-500 mb-6 text-center">
        {{ currentSettings?.description || 'Stellen Sie Ihre Fragen und erhalten Sie Antworten.' }}
      </p>
      <div class="w-full">
        <USelect
          v-model="selectedTopic"
          :items="topics"
          class="w-full"
          size="md"
          placeholder="Thema auswählen"
          :ui="{
            base: '!bg-gray-50 text-gray-400 hover:text-gray-600 rounded-b-none px-3 pt-3',
          }"
        />
        <UTextarea
          v-model="question"
          placeholder="Ihr Anliegen oder Ihre Fragen"
          class="w-full"
          :ui="{
            base: 'rounded-b-none rounded-t-none text-xl p-3 !bg-gray-50',
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
          class="w-full rounded-lg flex flex-col text-gray-800 my-2 border border-gray-200 p-4"
        >
          <div class="text-sm text-sky-900/60 mb-2">
            Was ist der Sinn des Lebens?
          </div>
          {{ existingAnswers[0] }}
          <div
            class="flex items-center justify-end gap-2 mt-4 text-sm text-gray-400"
          >
            <UButton
              icon="i-heroicons-hand-thumb-up"
              :variant="suggestedAnswerWasUseful === true ? 'solid' : 'ghost'"
              size="md"
              @click="suggestedAnswerWasUseful = !suggestedAnswerWasUseful"
            />
          </div>
        </div>
      </Transition>
      <Transition name="fade">
        <UInput
          v-if="question.length > 5"
          placeholder="Name"
          class="w-full"
        />
      </Transition>
      <Transition name="fade">
        <UInput
          v-if="question.length > 5"
          placeholder="Telefon"
          class="w-full"
        />
      </Transition>
      <Transition name="fade">
        <UInput
          v-if="question.length > 5"
          placeholder="E-Mail"
          class="w-full"
        />
      </Transition>
      <Transition name="fade">
        <UButton
          v-if="question.length > 5"
          label="Anfrage senden"
          block
          :loading="isGeneratingResponse"
          @click="generateResponse"
        />
      </Transition>
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
      <div class="flex flex-col gap-4 w-full mt-6">
        <h3 class="text-2xl font-semibold">
          {{ showSuggestedAnswer ? 'Weitere Antworten' : 'Häufig gestellte Fragen' }}
        </h3>
        <h4 class="text-sky-500 text-sm bg-sky-100 p-3 rounded-lg flex items-center gap-2">
          <UIcon
            name="i-heroicons-light-bulb"
            size="24"
          />
          Es wurden neue Antworten aus Ihren Dokumenten erzeugt, die Besucher hilfreich fanden. Prüfen und übernehmen Sie diese in Ihr FAQ.
        </h4>
        <div
          class="w-full rounded-lg flex flex-col text-gray-800 my-2 border border-gray-200 p-4"
        >
          <div class="text-sm text-sky-900/60 mb-2">
            Was ist der Sinn des Lebens?
          </div>
          {{ existingAnswers[0] }}
          <div
            class="flex items-center justify-end gap-2 mt-4 text-sm text-gray-400"
          >
            <UButton
              label="Übernehmen"
              icon="i-heroicons-check"
              variant="soft"
            />
            <UButton
              label="Bearbeiten"
              icon="i-heroicons-pencil-square"
              variant="soft"
            />
            <UButton
              label="Verwerfen"
              icon="i-heroicons-x-mark"
              variant="soft"
            />
          </div>
        </div>
        <UButton
          label="Frage und Antwort hinzufügen"
          icon="i-heroicons-plus"
          variant="soft"
          @click="showNewQandaModal = true"
        />
        <USelect
          v-if="qanda.length > 0"
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
      <h3 class="text-2xl font-semibold mt-12">
        Bewertungen
      </h3>
      <div class="text-yellow-500 text-2xl mb-4">
        <UIcon name="i-heroicons-star-solid" />
        <UIcon name="i-heroicons-star-solid" />
        <UIcon name="i-heroicons-star-solid" />
        <UIcon name="i-heroicons-star-solid" />
        <UIcon
          name="i-heroicons-star-solid"
          class="opacity-30"
        />
      </div>
      <div class="italic text-gray-500 text-sm mb-4">
        "AutoFAQ ist ein großartiges Tool, um meine Kundenanfragen zu verwalten. Es spart mir viel Zeit und hilft mir, professionell zu wirken." - Markus Kottländer
      </div>
      <div class="w-full flex gap-2 mt-12 text-sm">
        <UButton
          class="text-gray-400 mr-auto"
          icon="i-heroicons-cog-6-tooth"
          variant="ghost"
          color="neutral"
          size="md"
          @click="showSettingsModal = true"
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
      <SettingsModal v-model:show="showSettingsModal" @update="refreshSettings" />
      <NewQandaModal v-model:show="showNewQandaModal" />
      <ClientOnly>
        <WelcomeModal />
      </ClientOnly>
    </div>
  </FontWrapper>
</template>
