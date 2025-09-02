<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const { authenticate, isPlatformAvailable } = useWebAuthn({
  registerEndpoint: '/api/webauthn/register',
  authenticateEndpoint: '/api/webauthn/authenticate',
})
const { fetch: fetchUserSession } = useUserSession()
const { appHost } = useRuntimeConfig().public

const { ownedUserNames, addOwnedUserName, removeOwnedUserName } = useOwnedUserNames()

const isPasskeysAvailable = ref(true)
const userNameFromQuery = ref(Array.isArray(route.query.username) ? (route.query.username[0] || '') : route.query.username || '')
const userName = ref<string>(userNameFromQuery.value || ownedUserNames.value[0] || '')
const ownedUserNamesPopoverOpen = ref(false)
const showConnectInfo = ref(false)
const oneTimePassword = ref('')
const hasRequestedConnect = ref(false)

async function signIn() {
  try {
    await authenticate(userName.value)
    addOwnedUserName(userName.value)
    await fetchUserSession()
    await navigateTo(`https://${userName.value}.${appHost}`, { external: true })
  } catch (error) {
    toast.add({
      title: 'Anmeldung fehlgeschlagen',
      description: 'Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.',
      color: 'error',
    })
  }
}

onMounted(async () => {
  isPasskeysAvailable.value = await isPlatformAvailable()
})
</script>

<template>
  <ClientOnly>
    <UAlert
      v-if="!isPasskeysAvailable"
      title="Passkeys werden von diesem Browser nicht unterstützt"
      description="Für erhöhte Sicherheit verwenden wir zur Anmeldung ausschließlich Passkeys. Diese werden auf Ihrem Gerät leider nicht unterstützt. Bitte nutzen Sie ein aktuelleres Gerät."
      color="warning"
      variant="soft"
      class="mb-4"
    />
    <template v-if="isPasskeysAvailable">
      <div
        v-if="showConnectInfo"
        class="flex flex-col gap-2"
      >
        <UAlert
          title="Versuchen Sie sich an einem neuen Gerät anzumelden?"
          description="Dafür melden Sie sich bitte auf dem ursprünglichen Gerät an und gehen in den Einstellungen unten auf 'Gerät verknüpfen'. Dort legen Sie ein Einmal-Passwort fest, dass Sie hier eingeben können."
          variant="soft"
        />
        <UInput
          v-model="oneTimePassword"
          placeholder="Einmal-Passwort"
          size="xxl"
          class="w-full"
        />
      </div>
      <form
        class="flex flex-col gap-2"
        @submit.prevent="signIn"
      >
        <UButtonGroup>
          <UInput
            v-model="userName"
            placeholder="Benutzername"
            size="xxl"
            class="w-full"
          />
          <UPopover
            v-if="ownedUserNames.length > 0"
            v-model:open="ownedUserNamesPopoverOpen"
            :content="{
              align: 'end',
              side: 'bottom',
              sideOffset: 8,
            }"
          >
            <UButton
              icon="i-heroicons-chevron-down"
              variant="soft"
            />

            <template #content>
              <div class="p-1 flex flex-col gap-1">
                <UButtonGroup
                  v-for="ownedUserName in ownedUserNames"
                  :key="ownedUserName"
                >
                  <UButton
                    variant="ghost"
                    :label="ownedUserName"
                    size="xxl"
                    class="flex-1"
                    @click="userName = ownedUserName; ownedUserNamesPopoverOpen = false"
                  />
                  <UButton
                    variant="ghost"
                    icon="i-heroicons-trash"
                    color="neutral"
                    size="xxl"
                    :ui="{
                      leadingIcon: 'opacity-50',
                    }"
                    @click="removeOwnedUserName(ownedUserName)"
                  />
                </UButtonGroup>
              </div>
            </template>
          </UPopover>
        </UButtonGroup>
        <Transition name="fade">
          <UInput
            v-if="hasRequestedConnect"
            v-model="oneTimePassword"
            placeholder="Einmal-Passwort"
            size="xxl"
            class="w-full"
          />
        </Transition>
        <USwitch
          v-model="hasRequestedConnect"
          label="Mit Einmal-Passwort anmelden"
        />
        <UButton
          type="submit"
          :label="hasRequestedConnect ? 'Gerät verknüpfen' : 'Anmelden'"
          :icon="hasRequestedConnect ? 'i-heroicons-finger-print' : 'i-heroicons-arrow-right-on-rectangle'"
          color="primary"
          size="xl"
          class="mt-8"
        />
      </form>
    </template>
  </ClientOnly>
</template>
