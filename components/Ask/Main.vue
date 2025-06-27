<script setup lang="ts">
import type { Qanda } from '~/types/db'

const { username } = defineProps<{
  username: string
}>()

const { me } = await useMe()

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
</script>

<template>
  <FontWrapper
    :font="font"
    class="relative"
  >
    <AskNav
      :username="username"
    />
    <div
      :style="{ backgroundImage: currentSettings?.headerImage ? `url(${currentSettings.headerImage})` : 'none' }"
      class="w-full bg-cover bg-center relative z-0"
    >
      <div
        class="absolute inset-0 z-0"
        :class="getColorClass(currentSettings?.headerImageOverlay?.color, 'bg')"
        :style="{ opacity: (currentSettings?.headerImageOverlay?.opacity || 100) / 100 }"
      />
      <div class="@container flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-24 px-6 relative z-10">
        <div
          v-if="currentSettings?.logo"
        >
          <NuxtImg
            :src="currentSettings.logo"
            alt="Logo"
            class="w-32 mb-4"
          />
        </div>
        <h1
          class="text-center font-bold mb-4"
          :class="getColorClass(currentSettings?.headerTitleColor || 'white', 'text')"
          :style="{ 'font-size': currentSettings?.headerTitleFontSize + 'cqw' }"
        >
          {{ currentSettings?.title || username }}
        </h1>
        <p
          v-if="currentSettings?.description"
          class="text-center mb-4"
          :class="getColorClass(currentSettings?.headerDescriptionColor || 'white', 'text')"
          :style="{ 'font-size': currentSettings?.headerDescriptionFontSize + 'cqw' }"
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
            trailingIcon: 'text-primary-500',
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
      <CustomerRequests v-if="me" />
    </div>

    <SettingsModal
      v-if="me"
      @update="refreshSettings"
    />
    <UpgradeModal
      v-if="me && currentSettings"
      :current-settings="currentSettings"
    />
    <ClientOnly>
      <WelcomeModal />
    </ClientOnly>
  </FontWrapper>
</template>
