<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { availableComponents } from '~/types/db'

const { register } = useWebAuthn({ registerEndpoint: '/api/webauthn/register' })
const { fetch: fetchUserSession } = useUserSession()
const { appHost } = useRuntimeConfig().public

const isDevMode = process.env.NODE_ENV === 'development'
const userName = ref('')
const userNameAvailable = ref(true)
const checkingUserNameAvailability = ref(false)
const font = ref(availableFonts.value[0].value)
const color = ref(availableColors.value[0].value)
const displayedComponents = ref<{ [key: string]: boolean }>(
  Object.fromEntries(
    availableComponents.map(component => [component.key, true])
  )
)

function sanitizeUserName(name: string) {
  userName.value = name.toLowerCase().replace(/[^a-z]/g, '')
}

async function signUp() {
  if (isDevMode) {
    await $fetch('/api/devregister', { method: 'POST' })
    await fetchUserSession()
  } else {
    await register({ userName: userName.value, settings: { design: { font: font.value, color: color.value } } })
    await fetchUserSession()
  }
  
  navigateTo(`https://${userName.value}.${appHost}`, { external: true })
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
      <ColorPicker
        v-model:color="color"
        label="Primärfarbe"
        class="w-full max-w-lg mx-auto"
      />
      <FontPicker
        v-model:font="font"
        label="Schriftart"
        class="w-full max-w-lg mx-auto"
      />
    </div>
    <UFormField
      label="Welche Komponenten möchten Sie nutzen?"
      class="flex-1"
    >
      <div class="flex flex-col gap-2">
        <UCard
          v-for="(componentDetail, index) in availableComponents"
          :variant="displayedComponents[componentDetail.key] ? 'outline' : 'soft'"
          :key="index"
          :ui="{
            header: '!p-3',
            body: '!p-3',
            footer: '!p-3'
          }"
        >
          <h3 class="font-semibold flex gap-2 justify-between">
            <span
              class="flex items-center gap-2 text-base"
              :class="{ 'text-gray-500': !displayedComponents[componentDetail.key] }"
            >
              <UIcon
                :name="componentDetail.icon"
                class="inline-block size-5"
              />
              {{ componentDetail.title }}
            </span>
            <USwitch
              v-model="displayedComponents[componentDetail.key]"
              class="ml-2"
            />
          </h3>
          <p class="text-gray-500 mt-1">
            {{ componentDetail.description }}
          </p>
        </UCard>
      </div>
    </UFormField>
    <div>
      <UFormField
        label="Benutzername"
        :error="userNameAvailable ? '' : 'Dieser Benutzername ist bereits vergeben.'"
        class="flex-1"
        :ui="{
          error: 'text-sky-800 bg-sky-50 border-sky-200 px-4 py-2 rounded-lg',
        }"
      >
        <div class="flex">
          <UInput
            :value="userName"
            placeholder="Benutzername"
            size="xxl"
            class="w-full"
            :ui="{
              base: 'rounded-r-none',
            }"
            @input="sanitizeUserName($event.target.value)"
          />
          <div class="text-gray-500 border border-gray-100 rounded-lg rounded-l-none border-l-0 flex items-center justify-center px-4">
            .solihost.de
          </div>
        </div>
      </UFormField>
      <div class="text-gray-400 text-sm mt-2">
        Es sind ausschließlich Kleinbuchstaben erlaubt. Sie können später eine eigene Domain verbinden.
      </div>
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
        :disabled="!userNameAvailable || userName.length < 3"
        type="submit"
        class="ml-auto"
        label="Zugang erstellen"
        icon="i-heroicons-key"
        size="xl"
        :ui="{
          leadingIcon: 'text-primary-300',
        }"
      />
    </div>
  </form>
</template>
