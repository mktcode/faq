<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { defaultSettings } from '~/types/db'

const { register } = useWebAuthn({ registerEndpoint: '/api/webauthn/register' })
const { fetch: fetchUserSession } = useUserSession()
const { appHost } = useRuntimeConfig().public
const toast = useToast()

const userName = ref('')
const userNameAvailable = ref(true)
const checkingUserNameAvailability = ref(false)
const isRegistering = ref(false)

const companyInfo = ref('')

const settings = ref(defaultSettings.public)

function sanitizeUserName(name: string) {
  userName.value = name.toLowerCase().replace(/[^a-z]/g, '')
}

async function signUp() {
  isRegistering.value = true
  try {
    await register({
      userName: userName.value,
      settings: {
        public: settings.value,
        private: defaultSettings.private,
      },
      companyInfo: companyInfo.value,
    })
    await fetchUserSession()
    navigateTo(`https://${userName.value}.${appHost}`, { external: true })
  }
  catch (error) {
    if (error instanceof Error) {
      toast.add({
        title: 'Registrierung fehlgeschlagen',
        description: error.message,
        color: 'error',
      })
    }
    else {
      toast.add({
        title: 'Registrierung fehlgeschlagen',
        description: 'Ein unbekannter Fehler ist aufgetreten.',
        color: 'error',
      })
    }
  }
  finally {
    isRegistering.value = false
  }
}

async function checkUserNameAvailability() {
  if (checkingUserNameAvailability.value) return
  checkingUserNameAvailability.value = true
  if (userName.value.length < 3) {
    userNameAvailable.value = true
    checkingUserNameAvailability.value = false
    return
  }
  const result = await $fetch(`/api/checkUsername?userName=${userName.value}`)
  userNameAvailable.value = !result.exists
  checkingUserNameAvailability.value = false
}

watchDebounced(userName, checkUserNameAvailability, { debounce: 300 })
</script>

<template>
  <form
    class="w-full max-w-xl flex flex-col gap-4"
    @submit.prevent="signUp"
  >
    <div class="flex gap-4">
      <UFormField
        label="Firmenname"
        class="flex-1"
        help="Ihr Vor- und Nachname oder das, was Sie in der Gewerbeanmeldung eingetragen haben."
      >
        <UInput
          v-model="settings.company.name"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Stadt"
        class="flex-1 max-w-1/3"
      >
        <UInput
          v-model="settings.company.city"
          class="w-full"
        />
      </UFormField>
    </div>
    <UFormField
      label="Über Ihr Unternehmen"
      hint="(optional)"
      help="Beschreiben Sie Ihr Unternehmen stichpunktartig oder in zwei, drei Sätzen. Was bieten Sie an? Was macht Sie besonders? Wer ist Ihre Zielgruppe?"
    >
      <UTextarea
        v-model="companyInfo"
        label="Informationen"
        class="w-full"
      />
    </UFormField>
    <USwitch
      v-model="settings.company.isSmallBusiness"
      label="Ich nutze die Kleinunternehmer-Regelung."
    />
    <div class="flex gap-4">
      <FontPicker
        v-model:font="settings.design.font"
        label="Schriftart"
        class="w-full flex-1"
      />
      <ColorPicker
        v-model:color="settings.design.color"
        label="Primäre Farbe"
      />
    </div>
    <div>
      <UFormField
        label="Benutzername"
        :error="userNameAvailable ? '' : 'Dieser Benutzername ist bereits vergeben.'"
        class="flex-1"
        help="Ihren Benutzernamen benötigen Sie zum Anmelden. Er ist außerdem Teil Ihrer vorläufigen Domain. Eine eigene Domain können Sie später verbinden."
        :ui="{
          error: 'text-error-800 bg-error-50 border-error-200 px-4 py-2 rounded-lg',
        }"
      >
        <div class="flex">
          <UInput
            :value="userName"
            maxlength="15"
            size="xxl"
            class="w-full"
            :ui="{
              base: 'rounded-r-none',
            }"
            @input="sanitizeUserName($event.target.value)"
          >
            <template #trailing>
              <div
                id="character-count"
                class="text-xs text-muted tabular-nums mr-3"
                aria-live="polite"
                role="status"
              >
                {{ userName.length }}/{{ 15 }}
              </div>
            </template>
          </UInput>
          <div class="text-lg text-gray-600 border border-gray-100 rounded-lg rounded-l-none border-l-0 flex items-center justify-center px-4">
            .solihost.de
          </div>
        </div>
      </UFormField>
    </div>
    <div class="flex gap-2">
      <UButton
        to="/"
        label="Zurück"
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-left"
        :ui="{
          leadingIcon: 'text-primary-500',
        }"
      />
      <UButton
        type="submit"
        class="ml-auto"
        label="Zugang erstellen"
        icon="i-heroicons-key"
        size="xl"
        :disabled="isRegistering || !userNameAvailable || !settings.company.name"
        :loading="isRegistering"
        :ui="{
          leadingIcon: 'text-primary-300',
        }"
      />
    </div>
  </form>
</template>
