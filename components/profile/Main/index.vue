<script setup lang="ts">
import { toHslString } from '~/shared/color'

const appConfig = useAppConfig()
const { $profile } = useProfile()

appConfig.ui.colors.primary = 'website'
appConfig.ui.button.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.input.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.select.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.textarea.defaultVariants.rounded = $profile.settings.public.design.rounded

useHead({
  title: $profile.settings.public.meta.title || $profile.settings.public.header.title || $profile.settings.public.company.name || 'Solohost Website',
  meta: [
    { name: 'robots', content: $profile.isPublic ? 'index, follow' : 'noindex, nofollow' },
    { name: 'theme-color', content: toHslString($profile.settings.public.design.color) },
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
})
</script>

<template>
  <FontWrapper
    id="main"
    :font="$profile.settings.public.design.font"
    class="relative"
    :class="$profile.isOwned ? 'pb-[56px] md:pb-0 md:pt-[56px]' : ''"
  >
    <ClientOnly>
      <ProfileMainReLogin />
    </ClientOnly>
    <ProfileMainHeader />
    <div class="flex flex-col items-center justify-center gap-24 max-w-5xl mx-auto py-24 px-6">
      <ProfileMainComponentViewer
        v-for="index in 5"
        :key="index"
        :slot-index="index"
      />

      <ProfileMainFooter />
    </div>
  </FontWrapper>
</template>
