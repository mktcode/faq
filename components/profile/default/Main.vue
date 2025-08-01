<script setup lang="ts">
const route = useRoute()
const emailVerified = !!route.query.emailVerified
const subscriptionSuccess = !!route.query.subscriptionSuccess

const { me } = await useMe()

const { settings, refreshSettings, isOwned } = await useProfile()

useHead({
  title: settings.value?.title || 'Meine Website',
  meta: [
    {
      name: 'description',
      content: settings.value?.description || 'Mein Unternehmen auf einem Blick',
    },
  ],
})

const appConfig = useAppConfig()
const font = computed(() => settings.value?.font || 'roboto')
appConfig.ui.colors.primary = settings.value?.color || 'sky'
appConfig.ui.button.defaultVariants.rounded = settings.value?.rounded || 'md'
appConfig.ui.input.defaultVariants.rounded = settings.value?.rounded || 'md'
appConfig.ui.select.defaultVariants.rounded = settings.value?.rounded || 'md'
appConfig.ui.textarea.defaultVariants.rounded = settings.value?.rounded || 'md'
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
        v-for="index in Array.from({ length: settings?.displayedComponents?.length || 0 }, (_, i) => i)"
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
