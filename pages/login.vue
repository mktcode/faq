<script setup lang="ts">
const { register, authenticate } = useWebAuthn({
  registerEndpoint: '/api/webauthn/register',
  authenticateEndpoint: '/api/webauthn/authenticate',
})
const { fetch: fetchUserSession } = useUserSession()

const userName = ref('')
async function signUp() {
  await register({ userName: userName.value })
  await fetchUserSession()
  navigateTo('/')
}

async function signIn() {
  await authenticate(userName.value)
  await fetchUserSession()
  navigateTo('/')
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
            to="/register/2"
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
