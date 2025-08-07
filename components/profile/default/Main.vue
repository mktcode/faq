<script setup lang="ts">
import { defaultSettings } from '~/types/db'

const route = useRoute()
const emailVerified = !!route.query.emailVerified
const subscriptionSuccess = !!route.query.subscriptionSuccess

const { me } = await useMe()

const { settings, refreshSettings, isOwned } = await useProfile()

useHead({
  title: settings.value.header.title || defaultSettings.header.title,
  meta: [
    {
      name: 'description',
      content: settings.value.header.description || defaultSettings.header.description,
    },
  ],
})

const appConfig = useAppConfig()
const font = computed(() => settings.value.design.font)
appConfig.ui.colors.primary = settings.value.design.color
appConfig.ui.button.defaultVariants.rounded = settings.value.design.rounded
appConfig.ui.input.defaultVariants.rounded = settings.value.design.rounded
appConfig.ui.select.defaultVariants.rounded = settings.value.design.rounded
appConfig.ui.textarea.defaultVariants.rounded = settings.value.design.rounded
</script>

<template>
  <FontWrapper
    :font="font"
    class="relative"
  >
    <ProfileDefaultNav v-if="me && isOwned" />
    <ProfileDefaultHeader />
    <div
      v-if="settings"
      class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 px-6"
    >
      <ProfileDefaultComponentViewer
        v-for="index in 5"
        :key="index"
        :slot-index="index"
      />

      <ProfileDefaultFooter />
    </div>

    <template v-if="me">
      <EmailVerifiedModal v-if="emailVerified" />
      <SubscriptionSuccessModal v-if="subscriptionSuccess" />
      <SettingsModal @update="refreshSettings" />
      <DesignModal @update="refreshSettings" />
      <ContentModal @update="refreshSettings" />
      <LinksModal @update="refreshSettings" />
      <ClientOnly>
        <WelcomeModal />
      </ClientOnly>
    </template>
  </FontWrapper>
</template>
