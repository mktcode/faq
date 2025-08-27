<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { defaultSettings } from '~/types/db'

const { register } = useWebAuthn({ registerEndpoint: '/api/webauthn/register' })
const { fetch: fetchUserSession } = useUserSession()
const { appHost } = useRuntimeConfig().public
const toast = useToast()
const route = useRoute()

const userName = ref('')
const userNameAvailable = ref(true)
const checkingUserNameAvailability = ref(false)
const isRegistering = ref(false)

const settings = ref(defaultSettings)
if (typeof route.query.context === 'string') {
  settings.value.private.assistant.context = route.query.context
}
const firstAndLastName = computed(() => {
  return settings.value.public.company.firstname + ' ' + settings.value.public.company.lastname
})

function sanitizeUserName(name: string) {
  userName.value = name.toLowerCase().replace(/[^a-z]/g, '')
}

async function signUp() {
  isRegistering.value = true
  try {
    await register({
      userName: userName.value,
      settings: settings.value,
    })
    await fetchUserSession()
    navigateTo(`https://${userName.value}.${appHost}`, { external: true })
  }
  catch (error) {
    isRegistering.value = false
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

function onFocusNameInput() {
  if (settings.value.public.company.name === '') {
    settings.value.public.company.name = firstAndLastName.value
  }
}
</script>

<template>
  <form
    class="w-full max-w-xl flex flex-col gap-4"
    @submit.prevent="signUp"
  >
    <Transition name="fade">
      <div
        v-if="isRegistering"
        class="fixed inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-lg text-xl z-50"
      >
        <UIcon
          name="i-lucide-loader-2"
          class="animate-spin size-10 text-sky-500 mb-2"
        />
        <span>Ihre Website wird eingerichtet. Das kann einen Moment dauern...</span>
      </div>
    </Transition>
    <div class="flex gap-4">
      <UFormField
        label="Vorname"
        class="flex-1"
      >
        <UInput
          v-model="settings.public.company.firstname"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Nachname"
        class="flex-1"
      >
        <UInput
          v-model="settings.public.company.lastname"
          class="w-full"
        />
      </UFormField>
    </div>
    <div class="flex gap-4">
      <UFormField
        label="Firmenname"
        class="flex-1"
        help="Ihr Vor- und Nachname bzw. das, was Sie in der Gewerbeanmeldung eingetragen haben."
      >
        <UInput
          v-model="settings.public.company.name"
          class="w-full"
          @focus="onFocusNameInput"
        />
      </UFormField>
      <UFormField
        label="Stadt"
        class="flex-1 max-w-1/3"
      >
        <UInput
          v-model="settings.public.company.city"
          class="w-full"
        />
      </UFormField>
    </div>
    <UFormField
      label="Über Ihr Unternehmen"
      hint="(optional)"
      help="Was bieten Sie an? Wer ist Ihre Zielgruppe? Beschreiben Sie Ihr Unternehmen stichpunktartig oder in zwei bis drei kurzen Sätzen, über Ihre Tastatur oder per Spracheingabe."
    >
      <UTextarea
        v-model="settings.private.assistant.context"
        label="Informationen"
        class="w-full"
        autoresize
        :rows="3"
        :maxrows="10"
        :ui="{
          base: 'rounded-b-none',
        }"
      />
      <div class="flex justify-end bg-gray-100 p-1 rounded-lg rounded-t-none">
        <RegisterRecordAudio
          @transcript="transcript => settings.private.assistant.context = (settings.private.assistant.context || '') + transcript"
        />
      </div>
    </UFormField>
    <USwitch
      v-model="settings.public.company.isSmallBusiness"
      label="Ich nutze die Kleinunternehmer-Regelung."
    />
    <div class="flex gap-4">
      <FontPicker
        v-model:font="settings.public.design.font"
        label="Schriftart"
        class="w-full flex-1"
      />
      <ColorPicker
        v-model:color="settings.public.design.color"
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
            .solohost.de
          </div>
        </div>
      </UFormField>
    </div>
    <div class="flex gap-2">
      <UButton
        to="/"
        label="Zurück"
        variant="soft"
        icon="i-heroicons-arrow-left"
      />
      <UButton
        type="submit"
        class="ml-auto"
        label="Zugang erstellen"
        icon="i-heroicons-key"
        size="xl"
        :disabled="isRegistering || !userNameAvailable || !settings.public.company.name"
        :loading="isRegistering"
        :ui="{
          leadingIcon: 'text-primary-300',
        }"
      />
    </div>
  </form>
</template>
