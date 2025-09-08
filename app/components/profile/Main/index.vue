<script setup lang="ts">
const appConfig = useAppConfig()
const { $profile } = useProfile()

const { path } = usePath()

const page = computed(() => {
  return $profile.settings.public.pages.find(page => page.path === path.value)
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const components = computed(() => {
  if (!page.value) {
    return []
  }

  return page.value.components.filter(c => c.visible).sort((a, b) => a.order - b.order)
})

appConfig.ui.colors.primary = 'website'
appConfig.ui.button.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.input.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.select.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.textarea.defaultVariants.rounded = $profile.settings.public.design.rounded

useHead({
  title: page.value.title,
  meta: [
    { name: 'robots', content: $profile.isPublic ? 'index, follow' : 'noindex, nofollow' },
    { name: 'theme-color', content: toHslString($profile.settings.public.design.color) },
    { property: 'og:url', content: $profile.canonicalUrl },
    { property: 'og:image', content: $profile.settings.public.meta.ogimage || $profile.settings.public.header.image || '' },
    {
      name: 'description',
      content: page.value.description,
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

function openAdmin(componentId: number) {
  navigateTo(`#website/page/${page.value?.id}/component/${componentId}`)
}

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
    <template
      v-for="(component, index) in components"
      :key="component.key + index"
    >
      <ProfileMainHeader
        v-if="component.key === 'header'"
        :component="component"
        @edit="openAdmin(component.id)"
      />
      <ProfileMainOfferings
        v-if="component.key === 'offerings'"
        :component="component"
        @edit="openAdmin(component.id)"
      />
      <ProfileMainGallery
        v-else-if="component.key === 'gallery'"
        :component="component"
        @edit="openAdmin(component.id)"
      />
      <ProfileMainDownloads
        v-else-if="component.key === 'downloads'"
        :component="component"
        @edit="openAdmin(component.id)"
      />
      <ProfileMainContactForm
        v-else-if="component.key === 'form'"
        :component="component"
        @edit="openAdmin(component.id)"
      />
      <ProfileMainFAQ
        v-else-if="component.key === 'faq'"
        :component="component"
        @edit="openAdmin(component.id)"
      />
    </template>
    <ProfileMainFooter />
  </FontWrapper>
</template>
