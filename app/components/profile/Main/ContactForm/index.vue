<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import type { SimilarQuestion } from '~/server/api/qanda/similarQuestions.post'

const nuxtApp = useNuxtApp()
const { $profile } = nuxtApp

const message = ref('')
const messageLongEnough = computed(() => message.value.trim().length >= 5)
const messageEmbedding = ref<number[] | null>(null)
const name = ref('')
const phone = ref('')
const email = ref('')
const extraFields = ref<Record<string, string | string[]>>({})
const isSavingRequest = ref(false)
const savedRequestSuccess = ref(false)
const savedRequestFailure = ref(false)
const similarQuestions = ref<SimilarQuestion[]>([])

async function saveCustomerRequest() {
  if (isSavingRequest.value) return

  isSavingRequest.value = true

  try {
    await $fetch('/api/customerRequests', {
      method: 'POST',
      body: {
        username: $profile.username,
        message: message.value,
        embedding: messageEmbedding.value,
        name: name.value,
        phone: phone.value || undefined,
        email: email.value || undefined,
        extraFields: extraFields.value,
      },
    })

    savedRequestSuccess.value = true
    savedRequestFailure.value = false
    message.value = ''
    name.value = ''
    phone.value = ''
    email.value = ''
    extraFields.value = {}
  }
  catch (error) {
    savedRequestFailure.value = true
  }
  finally {
    isSavingRequest.value = false
  }
}

async function getEmbedding() {
  if (!messageLongEnough.value || !$profile.subscription.plan) {
    return
  }

  const embedding = await $fetch('/api/qanda/embedding', {
    query: {
      message: message.value,
      username: $profile.username, // TODO: not really safe, needs origin based verification in backend
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
        username: $profile.username,
        embedding: messageEmbedding.value,
      },
    })

    similarQuestions.value = response
  }
}

watchDebounced(message, getEmbedding, { debounce: 2000 })

const disabled = computed(() => {
  return isSavingRequest.value
    || !name.value
    || (!phone.value && !email.value)
    || (!!$profile.subscription.plan && !messageEmbedding.value)
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
    <ProfileMainContactFormHeader />
    <ProfileMainContactFormBody />
  </div>
</template>
