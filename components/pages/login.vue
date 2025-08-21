<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const { authenticate } = useWebAuthn({
  registerEndpoint: '/api/webauthn/register',
  authenticateEndpoint: '/api/webauthn/authenticate',
})
const { fetch: fetchUserSession } = useUserSession()
const { appHost } = useRuntimeConfig().public

const userNameFromQuery = ref(Array.isArray(route.query.username) ? (route.query.username[0] || '') : route.query.username || '')
const userName = ref<string>(userNameFromQuery.value)

async function signIn() {
  await authenticate(userName.value)
  await fetchUserSession()
  navigateTo(`https://${userName.value}.${appHost}`, { external: true })
}

appConfig.ui.colors.primary = 'sky'
</script>

<template>
  <div class="font-poppins min-h-screen max-w-lg mx-auto flex flex-col gap-12 items-center justify-between py-12">
    <SolihostLogo class="max-w-[150px]" />
    <div class="bg-white p-4 max-w-sm w-full">
      <div class="flex flex-col gap-6">
        <form
          class="flex flex-col gap-4"
          @submit.prevent="signIn"
        >
          <UFormField
            name="userName"
          >
            <UInput
              v-model="userName"
              placeholder="Benutzername"
              size="xxl"
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
          icon="i-heroicons-key"
          class="gap-2"
          size="xl"
          block
        />
        <UButton
          to="/"
          variant="ghost"
          color="neutral"
          class="flex items-center gap-1 text-gray-400 hover:text-gray-600 mr-auto"
        >
          <UIcon
            name="i-heroicons-arrow-left"
            class="size-4 mr-1"
          />
          <span class="leading-0">
            Zurück zur Startseite
          </span>
        </UButton>
      </div>
    </div>
    <div />
  </div>
</template>
