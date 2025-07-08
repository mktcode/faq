<script setup lang="ts">
const { register } = useWebAuthn({ registerEndpoint: '/api/webauthn/register' })
const { fetch: fetchUserSession } = useUserSession()
const { appHost } = useRuntimeConfig().public

const userName = ref('')

async function signUp() {
  await register({ userName: userName.value })
  await fetchUserSession()
  navigateTo(`https://${userName.value}.${appHost}`, { external: true })
}
</script>

<template>
  <form
    class="w-full max-w-xl flex flex-col gap-4"
    @submit.prevent="signUp"
  >
    <div class="flex">
      <UInput
        v-model="userName"
        placeholder="Benutzername"
        size="xxl"
        class="w-full"
        :ui="{
          base: 'rounded-r-none',
        }"
      />
      <div class="text-gray-500 border border-gray-100 rounded-lg rounded-l-none border-l-0 flex items-center justify-center px-4">
        .gewerbeprofil.de
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
