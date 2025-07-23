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
  title: currentSettings.value?.title || 'Mein Gewerbeprofil',
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
        :username="username"
        :settings="currentSettings"
        :slot-index="index"
        :key="index"
      />

      <ProfileDefaultFooter />
    </div>

    <div class="w-full mt-6 py-24 border-t border-gray-200">
      <CustomerRequests v-if="me" />
    </div>

    <EmailVerifiedModal
      v-if="emailVerified"
    />
    <SubscriptionSuccessModal
      v-if="subscriptionSuccess"
    />
    <SettingsModal
      v-if="me"
      @update="refreshSettings"
    />
    <DesignModal
      v-if="me"
      @update="refreshSettings"
    />
    <ContentModal
      v-if="me"
      @update="refreshSettings"
    />
    <LinksModal
      v-if="me"
      @update="refreshSettings"
    />
    <ClientOnly>
      <WelcomeModal />
    </ClientOnly>
  </FontWrapper>
</template>
