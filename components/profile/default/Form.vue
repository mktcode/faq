<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import type { SimilarQuestion } from '~/server/api/qanda/similarQuestions.post'
import type { SettingsForm } from '~/types/db'

const { form, username, contactPhone } = defineProps<{
  form: SettingsForm['form']
  username: string
  contactPhone: string
}>()

const { isSubscribed } = await useProfile()

const message = ref('')
const messageLongEnough = computed(() => message.value.trim().length >= 5)
const messageEmbedding = ref<number[] | null>(null)
const name = ref('')
const phone = ref('')
const email = ref('')
const isSavingRequest = ref(false)
const savedRequestSuccess = ref(false)
const similarQuestions = ref<SimilarQuestion[]>([])

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
  if (!messageLongEnough.value || !isSubscribed.value) {
    return
  }

  const embedding = await $fetch('/api/qanda/embedding', {
    query: {
      message: message.value,
      username,
    },
  })

  messageEmbedding.value = embedding

  await getSimilarQuestions()
}

async function getSimilarQuestions() {
  if (messageEmbedding.value && messageEmbedding.value.length > 0) {
    const response = await $fetch('/api/qanda/similarQuestions', {
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

const designRounded = useState('designRounded')

const disabled = computed(() => {
  return isSavingRequest.value
    || !name.value
    || (!phone.value && !email.value)
    || (isSubscribed.value && !messageEmbedding.value)
})
</script>

<template>
  <div class="my-6 w-full">
    <a
      id="anfrage"
      href="#anfrage"
      class="block pt-12 text-2xl font-semibold cursor-pointer relative before:content-['#'] before:absolute before:-left-6 before:text-gray-200 before:opacity-0 before:transition-opacity hover:before:opacity-100"
    >
      {{ form?.title || 'Anfrage' }}
    </a>

    <p class="text-gray-500 mb-8 mt-3">
      {{ form?.description || 'Beschreiben Sie Ihr Anliegen. Wir melden uns zeitnah bei Ihnen.' }}
    </p>

    <div
      v-if="contactPhone"
      class="flex text-2xl items-center justify-center gap-1 mb-8"
    >
      <UIcon
        name="i-heroicons-phone"
      />
      <span class="text-gray-500 ml-2">
        {{ contactPhone }}
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
    <div
      class="bg-gray-100 p-2 flex items-center gap-2"
      :class="{
        'rounded-b-none': designRounded === 'none',
        'rounded-b-md': designRounded === 'md',
        'rounded-b-xl': designRounded === 'xl',
      }"
    >
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
      <ProfileDefaultRecordAudio
        v-if="isSubscribed"
        class="ml-auto"
        :disabled="false"
        @text="(text) => { message = text }"
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
      :description="form?.successMessage || 'Vielen Dank für Ihre Anfrage. Wir melden uns zeitnah bei Ihnen.'"
      @close="savedRequestSuccess = false"
    />
  </Transition>
  <Transition name="fade">
    <div
      v-if="similarQuestions.length > 0 && messageLongEnough"
      class="w-full flex flex-col text-gray-800 mt-2 border border-gray-200 p-4"
      :class="{
        'rounded-none': designRounded === 'none',
        'rounded-md': designRounded === 'md',
        'rounded-xl': designRounded === 'xl',
      }"
    >
      <div class="text-sm text-sky-900/60 mb-2">
        {{ similarQuestions[0].question }}
      </div>
      <div v-html="similarQuestions[0].answer" />
    </div>
  </Transition>
  <div class="flex flex-col gap-2 mt-2 w-full">
    <Transition name="fade">
      <UInput
        v-if="messageLongEnough"
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
        :disabled="disabled"
        :loading="isSavingRequest"
        @click="saveRequest"
      />
    </Transition>
  </div>
</template>
