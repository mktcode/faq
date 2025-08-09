<script setup lang="ts">
const route = useRoute()
const emailVerified = !!route.query.emailVerified
const subscriptionSuccess = !!route.query.subscriptionSuccess

const { me } = await useMe()

const { settings, refreshSettings, isOwned, isPublic } = await useProfile()

useHead({
  title: settings.value.meta.title || settings.value.header.title || settings.value.company.name || 'Solihost Website',
  meta: [
    { name: 'robots', content: isPublic ? 'index, follow' : 'noindex, nofollow' },
    { property: 'og:image', content: settings.value.meta.ogimage || settings.value.header.image || '' },
    {
      name: 'description',
      content: settings.value.meta.description || settings.value.header.description || '',
    },
    {
      name: 'keywords',
      content: settings.value.meta.keywords || '',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: settings.value.meta.favicon || settings.value.company.logo || '',
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
      <DesignModal @update="refreshSettings" />
      <ContentModal @update="refreshSettings" />
      <EmailVerifiedModal v-if="emailVerified" />
      <SubscriptionSuccessModal v-if="subscriptionSuccess" />
      <LinksModal @update="refreshSettings" />
      <FeedbackModal />
      <ClientOnly>
        <WelcomeModal />
      </ClientOnly>
    </template>
  </FontWrapper>
</template>
