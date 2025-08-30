<script setup lang="ts">
const route = useRoute()
const { authenticate } = useWebAuthn({
  registerEndpoint: '/api/webauthn/register',
  authenticateEndpoint: '/api/webauthn/authenticate',
})
const { fetch: fetchUserSession } = useUserSession()
const { appHost } = useRuntimeConfig().public

const { ownedUserNames, addOwnedUserName, removeOwnedUserName } = useOwnedUserNames()

const userNameFromQuery = ref(Array.isArray(route.query.username) ? (route.query.username[0] || '') : route.query.username || '')
const userName = ref<string>(userNameFromQuery.value || ownedUserNames.value[0] || '')
const ownedUserNamesPopoverOpen = ref(false)

async function signIn() {
  await authenticate(userName.value)
  addOwnedUserName(userName.value)
  await fetchUserSession()
  await navigateTo(`https://${userName.value}.${appHost}`, { external: true })
}
</script>

<template>
  <ClientOnly>
    <form
      class="flex flex-col gap-2"
      @submit.prevent="signIn"
    >
      <UFormField
        name="userName"
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
              sideOffset: 8
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
                    @click="userName = ownedUserName; ownedUserNamesPopoverOpen = false"
                    :label="ownedUserName"
                    size="xxl"
                    class="flex-1"
                  />
                  <UButton
                    variant="ghost"
                    icon="i-heroicons-trash"
                    color="neutral"
                    size="xxl"
                    @click="removeOwnedUserName(ownedUserName)"
                    :ui="{
                      leadingIcon: 'opacity-50'
                    }"
                  />
                </UButtonGroup>
              </div>
            </template>
          </UPopover>
        </UButtonGroup>
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
  </ClientOnly>
</template>
