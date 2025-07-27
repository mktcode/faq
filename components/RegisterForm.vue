<script setup lang="ts">
const { register } = useWebAuthn({ registerEndpoint: '/api/webauthn/register' })
const { fetch: fetchUserSession } = useUserSession()
const { appHost } = useRuntimeConfig().public

const userName = ref('')
const font = ref<AvailableFont>(availableFonts.value[0])
const color = ref<AvailableColor>(availableColors.value[0])
const about = ref('')

function sanitizeUserName(name: string) {
  userName.value = name.toLowerCase().replace(/[^a-z]/g, '')
}

async function signUp() {
  await register({ userName: userName.value })
  await fetchUserSession()
  await $fetch('/api/user/settings', {
    method: 'POST',
    body: {
      font: font.value,
      color: color.value,
    },
  })
  navigateTo(`https://${userName.value}.${appHost}`, { external: true })
}
</script>

<template>
  <form
    class="w-full max-w-xl flex flex-col gap-4"
    @submit.prevent="signUp"
  >
    <UFormField label="Was machen Sie? Was macht Sie aus?">
      <UTextarea
        v-model="about"
        placeholder="z.B. Maßschneiderin, ausschließlich nachhaltige Stoffe"
        class="w-full"
      />
    </UFormField>
    <div class="flex gap-4">
      <ColorPicker
        v-model="color"
        label="Primärfarbe"
        class="w-full max-w-lg mx-auto"
      />
      <FontPicker
        v-model="font"
        label="Schriftart"
        class="w-full max-w-lg mx-auto"
      />
    </div>
    <div>
      <UFormField
        label="Benutzername"
        class="flex-1"
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
