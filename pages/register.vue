<script setup lang="ts">
const { register } = useWebAuthn({ registerEndpoint: '/api/webauthn/register' })
const { fetch: fetchUserSession } = useUserSession()

const userName = ref('')

async function signUp() {
  await register({ userName: userName.value })
  await fetchUserSession()
  navigateTo('/')
}
</script>

<template>
  <div class="h-screen flex flex-col items-center justify-center gap-12">
    <p class="text-center max-w-xl">
      Wähle einen Benutzernamen.
      Du brauchst kein Passwort.
      Ein sicherer Schlüssel für den Zugang zu Solihost wird auf deinem Gerät gespeichert oder in deinem Passwort-Manager, falls du einen nutzt.
    </p>
    <form
      class="space-y-4"
      @submit.prevent="signUp"
    >
      <UInput
        v-model="userName"
        placeholder="Benutzername"
        size="xxl"
        class="w-full"
      />
      <div class="flex gap-2">
        <UButton
          to="/"
          label="Zurück"
          color="neutral"
          variant="outline"
          icon="i-heroicons-arrow-left"
          :ui="{
            leadingIcon: 'text-primary-500',
          }"
        />
        <UButton
          type="submit"
          label="Zugang erstellen"
          icon="i-heroicons-key"
          color="neutral"
          variant="outline"
          size="xl"
          :ui="{
            leadingIcon: 'text-primary-500',
          }"
        />
      </div>
    </form>
  </div>
</template>
