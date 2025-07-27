<script setup lang="ts">
const route = useRoute()
const emailVerified = !!route.query.emailVerified
const subscriptionSuccess = !!route.query.subscriptionSuccess

const { username } = defineProps<{
  username: string
}>()

const { me } = await useMe()

const { data: currentSettings, refresh: refreshSettings } = await useFetch(`/api/settings`, {
  query: {
    username,
  },
})

useHead({
  title: currentSettings.value?.title || 'Meine Website',
  meta: [
    {
      name: 'description',
      content: currentSettings.value?.description || 'Mein Unternehmen auf einem Blick',
    },
  ],
})

const appConfig = useAppConfig()
const font = computed(() => currentSettings.value?.font || 'roboto')
appConfig.ui.colors.primary = currentSettings.value?.color || 'sky'
appConfig.ui.button.defaultVariants.rounded = currentSettings.value?.rounded || 'md'
appConfig.ui.input.defaultVariants.rounded = currentSettings.value?.rounded || 'md'
appConfig.ui.select.defaultVariants.rounded = currentSettings.value?.rounded || 'md'
appConfig.ui.textarea.defaultVariants.rounded = currentSettings.value?.rounded || 'md'
</script>

<template>
  <FontWrapper
    :font="font"
    class="relative"
  >
    <ProfileDefaultNav
      :username="username"
    />
    <ProfileDefaultHeader
      :username="username"
      :current-settings="currentSettings"
    />
    <div
      v-if="currentSettings"
      class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 px-6"
    >
      <ProfileDefaultComponentViewer
        v-for="index in [0, 1, 2, 3, 4]"
        :key="index"
        :username="username"
        :settings="currentSettings"
        :slot-index="index"
      />

      <ProfileDefaultFooter />
    </div>

    <EmailVerifiedModal
      v-if="emailVerified"
    />
    <SubscriptionSuccessModal
      v-if="subscriptionSuccess"
    />
    <template v-if="me">
      <SettingsModal @update="refreshSettings" />
      <DesignModal @update="refreshSettings" />
      <ContentModal @update="refreshSettings" />
      <LinksModal @update="refreshSettings" />
      <MailModal @update="refreshSettings" />
      <ClientOnly>
        <WelcomeModal />
      </ClientOnly>
    </template>
  </FontWrapper>
</template>
