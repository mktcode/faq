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

const qandaAccordionItems = computed(() => {
  return qanda.value?.map(item => ({
    label: item.question,
    content: item.answer,
  })) || []
})

const appConfig = useAppConfig()
const font = computed(() => currentSettings.value?.font || 'roboto')
appConfig.ui.colors.primary = currentSettings.value?.color || 'sky'
appConfig.ui.button.defaultVariants.rounded = currentSettings.value?.rounded || 'md'
appConfig.ui.input.defaultVariants.rounded = currentSettings.value?.rounded || 'md'
appConfig.ui.select.defaultVariants.rounded = currentSettings.value?.rounded || 'md'
appConfig.ui.textarea.defaultVariants.rounded = currentSettings.value?.rounded || 'md'

useState('designRounded', () => currentSettings.value?.rounded || 'md')

const logo = 'https://nbg1.your-objectstorage.com/mktcms/1/icon.webp'
</script>

<template>
  <FontWrapper :font="font" class="relative">
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
    <div
      :style="{ backgroundImage: currentSettings?.headerImage ? `url(${currentSettings.headerImage})` : 'none' }"
      class="w-full bg-cover bg-center relative z-0"
    >
      <div
        v-if="currentSettings?.headerImage"
        class="absolute inset-0 bg-black opacity-70 z-0"
      />
      <div class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-24 px-6 relative z-10">
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
        <h1
          class="text-2xl font-bold mb-4"
          :class="{
            'text-gray-900': !currentSettings?.headerImage,
            'text-white': currentSettings?.headerImage,
          }"
        >
          {{ currentSettings?.title || username }}
        </h1>
        <p
          v-if="currentSettings?.description"
          class="text-center text-lg mb-4"
          :class="{
            'text-gray-500': !currentSettings?.headerImage,
            'text-white': currentSettings?.headerImage,
          }"
        >
          {{ currentSettings?.description }}
        </p>
        <AskLinks
          v-if="currentSettings?.links?.length"
          :links="currentSettings.links"
          :has-header-image="!!currentSettings?.headerImage"
        />
      </div>
    </div>
    <div class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 px-6">
      <div
        v-if="currentSettings?.gallery?.length"
        class="my-6 w-full"
      >
        <AskGallery :images="currentSettings?.gallery" />
      </div>

      <div
        v-if="currentSettings?.offers?.length"
        class="my-6 w-full"
      >
        <AskOffer :offers="currentSettings.offers" />
      </div>

      <div
        v-if="currentSettings?.downloads?.length"
        class="my-6 w-full"
      >
        <AskDownloads :downloads="currentSettings?.downloads || []" />
      </div>

      <div class="my-6 w-full">
        <AskForm
          :username="username"
          :preferred-contact-method="currentSettings?.preferredContactMethod || 'none'"
          :contact-phone="currentSettings?.company?.phone || ''"
        />
      </div>

      <div class="flex flex-col gap-4 w-full mt-6">
        <h3 class="text-2xl font-semibold">
          Häufig gestellte Fragen
        </h3>
        <UAccordion
          :items="qandaAccordionItems"
          :ui="{
            label: 'text-lg',
            body: 'text-lg text-gray-500',
          }"
        >
          <template #body="{ item }">
            <div
              class="prose"
              v-html="item.content"
            />
          </template>
        </UAccordion>
      </div>

      <div class="w-full flex items-center justify-center gap-2 mt-12 text-sm">
        <ULink
          to="/impressum"
          class="text-gray-400"
        >
          Impressum
        </ULink>
        <ULink
          to="/datenschutz"
          class="text-gray-400"
        >
          Datenschutz
        </ULink>
      </div>
    </div>

    <div class="w-full mt-6 py-24 border-t border-gray-200">
      <CustomerRequestList v-if="me" />
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
    <ClientOnly>
      <WelcomeModal />
    </ClientOnly>
  </FontWrapper>
</template>
