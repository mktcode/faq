<script setup lang="ts">
const $profile = useNuxtApp().$profile

const extraScripts = []
if ($profile.isOwned && $profile.isSubscribed) {
  extraScripts.push({
    src: '/chatwoot.js',
    defer: true,
    async: true,
  })
}

useHead({
  title: $profile.settings.public.meta.title || $profile.settings.public.header.title || $profile.settings.public.company.name || 'Solihost Website',
  meta: [
    { name: 'robots', content: $profile.isPublic ? 'index, follow' : 'noindex, nofollow' },
    { name: 'theme-color', content: $profile.settings.public.design.color },
    { property: 'og:url', content: $profile.canonicalUrl },
    { property: 'og:image', content: $profile.settings.public.meta.ogimage || $profile.settings.public.header.image || '' },
    {
      name: 'description',
      content: $profile.settings.public.meta.description || $profile.settings.public.header.description || '',
    },
    {
      name: 'keywords',
      content: $profile.settings.public.meta.keywords || '',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: $profile.canonicalUrl,
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: $profile.settings.public.meta.favicon || $profile.settings.public.company.logo || '',
    },
    {
      rel: 'stylesheet',
      href: `/api/css?userName=${$profile.username}`,
    },
  ],
  script: extraScripts,
})
</script>

<template>
  <FontWrapper
    id="main"
    :font="$profile.settings.public.design.font"
    class="relative"
  >
    <ClientOnly>
      <ProfileMainReLogin />
    </ClientOnly>
    <ProfileMainHeader />
    <div class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 px-6">
      <ProfileMainComponentViewer
        v-for="index in 5"
        :key="index"
        :slot-index="index"
      />

      <ProfileMainFooter />
    </div>
  </FontWrapper>
</template>
