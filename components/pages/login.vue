<script setup lang="ts">
const { authenticate } = useWebAuthn({
  registerEndpoint: '/api/webauthn/register',
  authenticateEndpoint: '/api/webauthn/authenticate',
})
const { fetch: fetchUserSession } = useUserSession()
const { appHost } = useRuntimeConfig().public

const userName = ref('')

const isDevMode = process.env.NODE_ENV === 'development'

async function signIn() {
  if (isDevMode) {
    await $fetch('/api/devlogin', { method: 'POST' })
    await fetchUserSession()
  }
  else {
    await authenticate(userName.value)
    await fetchUserSession()
  }
  navigateTo(`https://${userName.value}.${appHost}`, { external: true })
}
</script>

<template>
  <NuxtLayout name="default">
    <div class="min-h-screen max-w-lg mx-auto flex flex-col items-center justify-center">
      <div class="bg-white border border-gray-200 rounded-lg p-6 max-w-sm w-full">
        <div class="space-y-6">
          <form
            class="space-y-4"
            @submit.prevent="signIn"
          >
            <UFormField
              label="Benutzername"
              name="userName"
            >
              <UInput
                v-model="userName"
                placeholder="Benutzername"
                size="xl"
                class="w-full"
              />
            </UFormField>
            <UButton
              type="submit"
              label="Anmelden"
              color="primary"
              icon="i-heroicons-arrow-right-on-rectangle"
              size="xl"
              block
            />
          </form>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">oder</span>
            </div>
          </div>

          <UButton
            to="/register"
            label="Neuen Zugang erstellen"
            size="xl"
            block
          />
        </div>
      </div>
      <NuxtLink
        to="/"
        class="mt-6 text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 leading-0"
      >
        <UIcon
          name="i-heroicons-arrow-left"
          class="size-4 mr-1"
        />
        <span class="leading-0">
          Zurück zur Startseite
        </span>
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>
