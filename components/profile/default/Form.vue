<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import type { SimilarQuestion } from '~/server/api/qanda/similarQuestions.post'

const { username, isSubscribed, settings, designRounded } = await useProfile()

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
        username: username.value,
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
  if (!messageLongEnough.value || !isSubscribed.value) {
    return
  }

  const embedding = await $fetch('/api/qanda/embedding', {
    query: {
      message: message.value,
      username, // TODO: not really safe, needs origin based verification in backend
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

const disabled = computed(() => {
  return isSavingRequest.value
    || !name.value
    || (!phone.value && !email.value)
    || (isSubscribed.value && !messageEmbedding.value)
})
</script>

<template>
  <div class="my-6 w-full">
    <ProfileDefaultFormHeader />

    <UTextarea
      v-model="message"
      placeholder="Ihr Anliegen oder Ihre Fragen"
      class="w-full"
      :ui="{
        base: 'rounded-b-none text-xl p-3',
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
      <UFormField label="Name">
        <UInput
          v-model="name"
          placeholder="Geben Sie Ihren Namen ein"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Telefon">
        <UInput
          v-model="phone"
          placeholder="Telefon"
          class="w-full"
        />
      </UFormField>
      <UFormField label="E-Mail">
        <UInput
          v-model="email"
          placeholder="E-Mail"
          class="w-full"
        />
      </UFormField>
      <template v-for="field in settings.components.form.fields || []">
        <UFormField
          v-if="field.type === 'text'"
          :label="field.label"
        >
          <UInput
            v-model="extraFields[field.label] as string"
            :placeholder="field.help || ''"
            class="w-full"
          />
        </UFormField>
        <UFormField
          v-else-if="field.type === 'email'"
          :label="field.label"
        >
          <UInput
            v-model="extraFields[field.label] as string"
            :placeholder="field.help || ''"
            class="w-full"
          />
        </UFormField>
        <UFormField
          v-else-if="field.type === 'tel'"
          :label="field.label"
        >
          <UInput
            v-model="extraFields[field.label] as string"
            :placeholder="field.help || ''"
            class="w-full"
          />
        </UFormField>
        <UFormField
          v-else-if="field.type === 'date'"
          :label="field.label"
        >
          <UInput
            v-model="extraFields[field.label] as string"
            type="date"
            :placeholder="field.help || ''"
            class="w-full"
          />
        </UFormField>
        <UFormField
          v-else-if="field.type === 'datetime'"
          :label="field.label"
        >
          <UInput
            v-model="extraFields[field.label] as string"
            type="datetime-local"
            :placeholder="field.help || ''"
            class="w-full"
          />
        </UFormField>
        <UFormField
          v-else-if="field.type === 'textarea'"
          :label="field.label"
        >
          <UTextarea
            v-model="extraFields[field.label] as string"
            :placeholder="field.help || ''"
            class="w-full"
          />
        </UFormField>
        <UFormField
          v-else-if="field.type === 'select'"
          :label="field.label"
          :description="field.help || ''"
        >
          <USelect
            v-model="extraFields[field.label]"
            :items="field.options.map(option => option.label) || []"
            :multiple="field.multiple"
            placeholder="Auswahl treffen"
            class="w-full"
          />
        </UFormField>
        <UFormField
          v-else-if="field.type === 'checkbox'"
          :label="field.label"
        >
          <UCheckbox
            :label="field.help || ''"
            class="w-full"
          />
        </UFormField>
      </template>
      <UButton
        label="Anfrage senden"
        block
        :disabled="disabled"
        :loading="isSavingRequest"
        @click="saveCustomerRequest"
      />
    </div>
    <Transition name="fade">
      <UAlert
        v-if="savedRequestSuccess"
        class="mt-2"
        color="primary"
        variant="soft"
        icon="i-heroicons-check"
        title="Ihre Anfrage wurde gesendet."
        :description="settings.components.form.successMessage || 'Vielen Dank für Ihre Anfrage. Wir melden uns zeitnah bei Ihnen.'"
        :close="{
          color: 'primary',
        }"
        @update:open="savedRequestSuccess = false"
      />
    </Transition>
    <Transition name="fade">
      <UAlert
        v-if="savedRequestFailure"
        class="mt-2"
        color="error"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        title="Ihre Anfrage konnte nicht gesendet werden."
        :description="settings.components.form.errorMessage || `Beim Senden Ihrer Anfrage ist ein Fehler aufgetreten. Versuchen Sie es bitte später erneut oder per Telefon oder E-Mail.`"
        :actions="[
          {
            label: 'zum Impressum',
            color: 'error',
            onClick: () => { navigateTo('/impressum', { external: true }) },
          },
        ]"
        :close="{
          color: 'error',
        }"
        @update:open="savedRequestFailure = false"
      />
    </Transition>
  </div>
</template>
