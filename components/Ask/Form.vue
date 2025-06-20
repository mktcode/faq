<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import type { SimilarQuestion } from '~/server/api/customerRequests/similarQuestions.post'

const { username } = defineProps<{ username: string }>()

const message = ref('')
const messageLongEnough = computed(() => message.value.trim().length >= 5)
const messageEmbedding = ref<number[]>([])
const name = ref('')
const phone = ref('')
const email = ref('')
const isSavingRequest = ref(false)
const savedRequestSuccess = ref(false)
const similarQuestions = ref<SimilarQuestion[]>([])
const suggestedAnswerWasUseful = ref<boolean | undefined>(undefined)

async function saveRequest() {
  if (isSavingRequest.value) return

  isSavingRequest.value = true

  await $fetch('/api/customerRequests', {
    method: 'POST',
    body: {
      username,
      message: message.value,
      embedding: messageEmbedding.value,
      name: name.value,
      phone: phone.value || undefined,
      email: email.value || undefined,
    },
  })

  isSavingRequest.value = false
  savedRequestSuccess.value = true
  message.value = ''
  name.value = ''
  phone.value = ''
  email.value = ''
}

async function getEmbedding() {
  if (!messageLongEnough.value) {
    return
  }

  const embedding = await $fetch('/api/customerRequests/embedding', {
    query: {
      message: message.value,
    },
  })

  messageEmbedding.value = embedding
}

async function getSimilarQuestions() {
  if (messageEmbedding.value.length > 0) {
    const response = await $fetch('/api/customerRequests/similarQuestions', {
      method: 'POST',
      body: {
        username,
        embedding: messageEmbedding.value,
      },
    })

    similarQuestions.value = response
  }
}

watchDebounced(message, getEmbedding, { debounce: 2000 })
watchDebounced(messageEmbedding, getSimilarQuestions, { debounce: 500 })
</script>

<template>
  <div class="w-full">
    <h3 class="text-2xl font-semibold">
      Anfrage
    </h3>

    <p class="text-gray-500 mb-6 mt-3">
      Stellen Sie Ihre Fragen und erhalten Sie Antworten, per Mail, per Push-Nachricht, telefonisch oder direkt hier im FAQ.
    </p>

    <div class="flex text-2xl items-center gap-1 mb-6">
      <UIcon
        name="i-heroicons-phone"
      />
      <span class="text-gray-500 ml-2">
        0123 4567890
      </span>
    </div>

    <UTextarea
      v-model="message"
      placeholder="Ihr Anliegen oder Ihre Fragen"
      class="w-full"
      :ui="{
        base: 'rounded-b-none text-xl p-3 !bg-gray-50 !border !border-b-0 !border-gray-200',
      }"
    />
    <div class="bg-gray-100 rounded-b-lg p-2 flex items-center gap-2">
      <Transition name="fade">
        <div v-if="message">
          <UButton
            icon="i-heroicons-x-mark"
            label="leeren"
            class="mr-auto opacity-60 hover:opacity-100"
            variant="ghost"
            color="neutral"
            @click="message = ''"
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
    <UAlert
      v-if="savedRequestSuccess"
      class="mt-2"
      color="success"
      variant="soft"
      icon="i-heroicons-check-circle"
      title="Anfrage gesendet"
      description="Ihre Anfrage wurde erfolgreich gesendet. Wir werden uns so schnell wie möglich bei Ihnen melden."
      @close="savedRequestSuccess = false"
    />
  </Transition>
  <Transition name="fade">
    <div
      v-if="similarQuestions.length > 0"
      class="w-full rounded-lg flex flex-col text-gray-800 my-2 border border-gray-200 p-4"
    >
      <div class="text-sm text-sky-900/60 mb-2">
        {{ similarQuestions[0].question }}
      </div>
      {{ similarQuestions[0].answer }}
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
      v-if="message.length > 5"
      v-model="name"
      placeholder="Name"
      class="w-full"
    />
  </Transition>
  <Transition name="fade">
    <UInput
      v-if="messageLongEnough"
      v-model="phone"
      placeholder="Telefon"
      class="w-full"
    />
  </Transition>
  <Transition name="fade">
    <UInput
      v-if="messageLongEnough"
      v-model="email"
      placeholder="E-Mail"
      class="w-full"
    />
  </Transition>
  <Transition name="fade">
    <UButton
      v-if="messageLongEnough"
      label="Anfrage senden"
      block
      :disabled="isSavingRequest || !name || (!phone && !email) || messageEmbedding.length === 0"
      :loading="isSavingRequest"
      @click="saveRequest"
    />
  </Transition>
</template>
