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

const showSettingsModal = ref(false)
const showUpgradeModal = ref(false)
const showNewQandaModal = ref(false)

const { data: currentSettings, refresh: refreshSettings } = await useFetch(`/api/settings`, {
  query: {
    username,
  },
})

const { data: qanda } = await useFetch<Qanda[]>(`/api/qanda`, {
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
      <UButton
        v-if="me && !onOwnProfile"
        :to="`https://${me.userName}.${appHost}`"
        label="Eigenes Profil"
        class="text-gray-400"
        icon="i-heroicons-user-circle"
        variant="ghost"
        color="neutral"
        size="md"
      />

      <UButton
        v-if="!me && onOwnProfile"
        :to="`https://${appHost}/login`"
        label="Anmelden"
        class="text-gray-400"
        icon="i-heroicons-arrow-right-on-rectangle"
        variant="ghost"
        color="neutral"
        size="md"
      />

      <UButton
        v-if="me && onOwnProfile"
        class="text-gray-400"
        icon="i-heroicons-cog-6-tooth"
        variant="ghost"
        color="neutral"
        size="md"
        @click="showSettingsModal = true"
      >
        Einstellungen
      </UButton>

      <UButton
        v-if="me && onOwnProfile"
        class="text-gray-400 md:mr-auto"
        icon="i-heroicons-rocket-launch"
        variant="ghost"
        color="neutral"
        size="md"
        @click="showUpgradeModal = true"
      >
        Nächster Schritt
      </UButton>

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
      <AskLinks
        v-if="currentSettings?.links?.length"
        :links="currentSettings.links"
      />
      <div class="my-6 w-full">
        <AskGallery />
      </div>

      <div
        v-if="currentSettings?.offers?.length"
        class="my-6 w-full"
      >
        <AskOffer :offers="currentSettings.offers" />
      </div>

      <div class="my-6 w-full">
        <AskForm :username="username" />
      </div>

      <div class="flex flex-col gap-4 w-full mt-6">
        <h3 class="text-2xl font-semibold">
          Häufig gestellte Fragen
        </h3>
        <UButton
          v-if="me"
          label="Frage und Antwort hinzufügen"
          icon="i-heroicons-plus"
          variant="soft"
          @click="showNewQandaModal = true"
        />
        <div
          v-for="item in qanda"
          :key="item.question"
          class="p-4 bg-white rounded-lg border border-gray-200"
        >
          <div class="flex items-start justify-between">
            <h3 class="text-lg font-semibold">
              {{ item.question }}
            </h3>
            <div
              v-if="me"
              class="flex items-center justify-end gap-2"
            >
              <UButton
                icon="i-heroicons-pencil-square"
                variant="ghost"
              />
              <UButton
                icon="i-heroicons-trash"
                variant="ghost"
              />
            </div>
          </div>
          <p class="text-gray-600">
            {{ item.answer }}
          </p>
        </div>
      </div>
      <GoogleReviews v-if="currentSettings?.showGoogleReviews" />
      <CustomerRequestList v-if="me" />
      <div class="w-full flex items-center justify-center gap-2 mt-12 text-sm">
        <ULink class="text-gray-400">
          Impressum
        </ULink>
        <ULink class="text-gray-400">
          Datenschutz
        </ULink>
      </div>
      <SettingsModal
        v-if="me"
        v-model:show="showSettingsModal"
        @update="refreshSettings"
      />
      <UpgradeModal
        v-if="me && currentSettings"
        v-model:show="showUpgradeModal"
        :current-settings="currentSettings"
      />
      <NewQandaModal
        v-if="me"
        v-model:show="showNewQandaModal"
      />
      <ClientOnly>
        <WelcomeModal />
      </ClientOnly>
    </div>
  </FontWrapper>
</template>
