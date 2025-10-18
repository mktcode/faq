<script setup lang="ts">
import type { FormComponentSchema } from '~~/types/db';

const nuxtApp = useNuxtApp()
const { $profile } = nuxtApp

const { component } = defineProps<{
  component: FormComponentSchema;
}>()

const message = ref('')
const name = ref('')
const phone = ref('')
const email = ref('')
const extraFields = ref<Record<string, any>>({})
const isSavingRequest = ref(false)
const savedRequestSuccess = ref(false)
const savedRequestFailure = ref(false)

async function saveCustomerRequest() {
  if (isSavingRequest.value) return

  isSavingRequest.value = true

  try {
    await $fetch('/api/customerRequests', {
      method: 'POST',
      body: {
        contactFormComponentId: component.id,
        name: name.value,
        email: email.value || undefined,
        phone: phone.value || undefined,
        message: message.value,
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

const disabled = computed(() => {
  const minimumRequiredFieldsFilled = name.value && (email.value || phone.value)

  const requiredExtraFieldsFilled = component.fields.every((field) => {
    if (field.required) {
      const value = extraFields.value[field.label]
      if (field.type === 'checkbox') {
        return Boolean(value)
      }
      if (field.type === 'select') {
        return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== ''
      }
      return value !== undefined && value !== ''
    }
    return true
  })

  return !isSavingRequest.value && minimumRequiredFieldsFilled && requiredExtraFieldsFilled && message.value.trim().length >= 5 ? false : true
})
</script>

<template>
  <div class="not-prose">
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
        'rounded-b-none': $profile.settings.public.design.rounded === 'none',
        'rounded-b-md': $profile.settings.public.design.rounded === 'md',
        'rounded-b-xl': $profile.settings.public.design.rounded === 'xl',
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
      <ProfileMainRecordAudio
        v-if="$profile.subscription.plan"
        class="ml-auto"
        :disabled="false"
        @transcript="(text: string) => { message = text }"
      />
    </div>
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
      <div
        v-for="(field, index) in component.fields"
        :key="index"
      >
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
          :description="field.help || ''"
        >
          <UInput
            v-model="extraFields[field.label] as string"
            type="date"
            class="w-full"
          />
        </UFormField>
        <UFormField
          v-else-if="field.type === 'datetime'"
          :label="field.label"
          :description="field.help || ''"
        >
          <UInput
            v-model="extraFields[field.label] as string"
            type="datetime-local"
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
            v-model="extraFields[field.label]"
            :label="field.help || ''"
            class="w-full"
          />
        </UFormField>
      </div>
      <UButton
        label="Anfrage senden"
        block
        :disabled="disabled"
        :loading="isSavingRequest"
        size="xxl"
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
        :description="component.successMessage || 'Vielen Dank für Ihre Anfrage. Wir melden uns zeitnah bei Ihnen.'"
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
        :description="component.errorMessage || `Beim Senden Ihrer Anfrage ist ein Fehler aufgetreten. Versuchen Sie es bitte später erneut oder per Telefon oder E-Mail.`"
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
