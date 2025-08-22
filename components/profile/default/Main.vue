<script setup lang="ts">
const route = useRoute()
const emailVerified = !!route.query.emailVerified
const subscriptionSuccess = !!route.query.subscriptionSuccess

// const { user, loggedIn } = useUserSession()

const { appHost } = useRuntimeConfig().public
const { me } = await useMe()
const { username, settings, refreshSettings, isOwned, isPublic, font } = await useProfile()
const canonicalUrl = computed(() => {
  const domain = me.value?.domain ? `https://${me.value.domain}` : `https://${username.value}.${appHost}`
  const path = route.path && route.path !== '/' ? route.path : ''
  return `${domain}${path}`
})

const extraScripts = []

if (me.value && me.value.isSubscribed && isOwned) {
  extraScripts.push({
    src: '/chatwoot.js',
    defer: true,
    async: true,
  })
}

useHead({
  title: settings.value.meta.title || settings.value.header.title || settings.value.company.name || 'Solihost Website',
  meta: [
    { name: 'robots', content: isPublic ? 'index, follow' : 'noindex, nofollow' },
    { name: 'theme-color', content: settings.value.design.color },
    { property: 'og:url', content: canonicalUrl.value },
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
      rel: 'canonical',
      href: canonicalUrl.value,
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: settings.value.meta.favicon || settings.value.company.logo || '',
    },
    {
      rel: 'stylesheet',
      href: `/api/css?userName=${username.value}`,
    },
  ],
  script: extraScripts,
})
</script>

<template>
  <FontWrapper
    id="main"
    :font="font"
    class="relative"
  >
    <ClientOnly>
      <ProfileDefaultReLogin />
    </ClientOnly>
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
