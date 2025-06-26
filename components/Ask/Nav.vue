<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const { username } = defineProps<{
  username: string
}>()

const { public: { appHost } } = useRuntimeConfig()

const { me } = await useMe()
const myLastUsername = useLocalStorage('myLastUsername', () => me.value?.userName || null)
const onOwnProfile = computed(() => username === myLastUsername.value)

const showSettingsModal = useState('showSettingsModal', () => false)
const showUpgradeModal = useState('showUpgradeModal', () => false)
</script>

<template>
  <div
    class="flex flex-row md:items-center md:justify-between p-4 absolute z-10 w-full gap-2"
  >
    <div class="flex flex-col md:flex-row gap-2">
      <UButton
        v-if="me && !onOwnProfile"
        :to="`https://${me.userName}.${appHost}`"
        label="Eigenes Profil"
        icon="i-heroicons-user-circle"
        color="neutral"
        variant="soft"
        size="md"
      />

      <UButton
        v-if="!me && onOwnProfile"
        :to="`https://${appHost}/login`"
        label="Anmelden"
        icon="i-heroicons-arrow-right-on-rectangle"
        variant="soft"
        color="neutral"
        size="md"
      />

      <UButton
        v-if="me && onOwnProfile"
        label="Einstellungen"
        icon="i-heroicons-cog-6-tooth"
        color="neutral"
        variant="soft"
        size="md"
        @click="showSettingsModal = true"
      />

      <UButton
        v-if="me && onOwnProfile"
        label="Nächster Schritt"
        icon="i-heroicons-rocket-launch"
        color="neutral"
        variant="soft"
        size="md"
        @click="showUpgradeModal = true"
      />
    </div>

    <UPopover class="mb-auto">
      <UButton
        label="Link Teilen"
        class="ml-auto"
        icon="i-heroicons-share"
        variant="soft"
        color="neutral"
        size="md"
      />

      <template #content>
        <div class="m-4 inline-flex flex-col gap-4 max-w-xl">
          <div class="text-gray-500">
            {{ `${username}.${appHost}` }}
          </div>
          <div class="flex flex-col gap-2">
            <UButton
              target="_blank"
              label="Link kopieren"
              icon="i-heroicons-link"
              variant="soft"
            />
            <UButton
              label="Auf Facebook teilen"
              icon="i-lucide-facebook"
              variant="soft"
            />
            <UButton
              label="Auf Instagram teilen"
              icon="i-lucide-instagram"
              variant="soft"
            />
            <UButton
              label="per E-Mail teilen"
              icon="i-heroicons-envelope"
              variant="soft"
            />
            <UButton
              label="Auf WhatsApp teilen"
              icon="i-ic-baseline-whatsapp"
              variant="soft"
              target="_blank"
              :to="`https://wa.me/?text=${encodeURIComponent(`Schau dir mein Gewerbeprofil an: https://${myLastUsername}.${appHost}`)}`"
            />
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>
