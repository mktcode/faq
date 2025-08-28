<script setup lang="ts">
const appConfig = useAppConfig()
const { $profile } = useProfile()

appConfig.ui.colors.primary = 'website'
appConfig.ui.button.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.input.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.select.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.textarea.defaultVariants.rounded = $profile.settings.public.design.rounded

const extraScripts = []
if ($profile.isOwned && $profile.isSubscribed) {
  extraScripts.push({
    src: '/chatwoot.js',
    defer: true,
    async: true,
  })
}

useHead({
  title: $profile.settings.public.meta.title || $profile.settings.public.header.title || $profile.settings.public.company.name || 'Solohost Website',
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
      href: `/api/css`,
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
    :class="$profile.isOwned ? 'pt-[56px]' : ''"
  >
    <ClientOnly>
      <ProfileMainReLogin />
    </ClientOnly>
    <ProfileMainHeader />
    <div class="flex flex-col items-center justify-center gap-2 max-w-7xl mx-auto py-12 px-6">
      <TransitionGroup name="list">
        <ProfileMainComponentViewer
          v-for="index in 5"
          :key="index"
          :slot-index="index"
        />
      </TransitionGroup>

      <ProfileMainFooter />
    </div>
  </FontWrapper>
</template>
