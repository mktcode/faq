<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import type { Qanda } from '~/types/db'

const { username } = defineProps<{
  username: string
}>()

const { public: { appHost } } = useRuntimeConfig()

const { me } = await useMe()
const myLastUsername = useLocalStorage('myLastUsername', () => me.value?.userName || null)
const onOwnProfile = computed(() => username === myLastUsername.value)

const { data: currentSettings } = await useFetch(`/api/settings`, {
  query: {
    username,
  },
})


const appConfig = useAppConfig()
const font = computed(() => currentSettings.value?.font || 'roboto')
appConfig.ui.colors.primary = currentSettings.value?.color || 'sky'

const logo = 'https://nbg1.your-objectstorage.com/mktcms/1/icon.webp'
</script>

<template>
  <FontWrapper :font="font">
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between p-4"
    >
      <UPopover>
        <UButton
          label="Link Teilen"
          class="text-gray-400 ml-auto"
          icon="i-heroicons-share"
          variant="ghost"
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
    <div class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 px-6">
      <div
        v-if="logo"
      >
        <NuxtImg
          :src="logo"
          alt="Logo"
          class="w-16 mb-4"
        />
      </div>
      <div
        v-else
        class="size-16 rounded-full bg-gray-100 flex items-center justify-center"
      >
        <UIcon
          name="i-heroicons-photo"
          class="size-7 opacity-25"
        />
      </div>
      <h1 class="text-lg font-bold mb-4">
        {{ currentSettings?.title || username }}
      </h1>

      <div class="text-gray-500 prose">
        <h1>
          Impressum
        </h1>

        <p>
          Angaben gemäß § 5 TMG:
        </p>
      </div>
      
      <div class="w-full flex items-center justify-center gap-2 mt-12 text-sm">
        <ULink
          to="/"
          class="text-gray-400"
        >
          Startseite
        </ULink>
        <ULink
          to="/datenschutz"
          class="text-gray-400"
        >
          Datenschutz
        </ULink>
      </div>
    </div>
  </FontWrapper>
</template>
