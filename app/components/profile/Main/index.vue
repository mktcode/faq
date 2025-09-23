<script setup lang="ts">
import type { HtmlComponentSchema } from '~~/types/db'

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
const htmlComponents = computed(() => {
  return components.value.filter(c => c.key === 'html') as HtmlComponentSchema[]
})

appConfig.ui.colors.primary = 'website'
appConfig.ui.button.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.input.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.select.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.textarea.defaultVariants.rounded = $profile.settings.public.design.rounded

const borderRadius = computed(() => {
  switch ($profile.settings.public.design.rounded) {
    case 'none':
      return '0px'
    case 'md':
      return '0.375rem'
    case 'xl':
      return '0.75rem'
    default:
      return '0.375rem'
  }
})

const hslColor = toHslString($profile.settings.public.design.color)
const colorCss = `@supports (color: color-mix(in oklch, white 50%, black 50%)) {
  :root {
    --color-website-50:  color-mix(in oklch, white 94%, ${hslColor} 6%);
    --color-website-100: color-mix(in oklch, white 88%, ${hslColor} 12%);
    --color-website-200: color-mix(in oklch, white 78%, ${hslColor} 22%);
    --color-website-300: color-mix(in oklch, white 62%, ${hslColor} 38%);
    --color-website-400: color-mix(in oklch, white 46%, ${hslColor} 54%);
    --color-website-500: ${hslColor};
    --color-website-600: color-mix(in oklch, black 7%,  ${hslColor} 93%);
    --color-website-700: color-mix(in oklch, black 16%, ${hslColor} 84%);
    --color-website-800: color-mix(in oklch, black 30%, ${hslColor} 70%);
    --color-website-900: color-mix(in oklch, black 46%, ${hslColor} 54%);
    --color-website-950: color-mix(in oklch, black 60%, ${hslColor} 40%);
    --color-website: ${hslColor};
  }
}`

useHead({
  title: page.value.title,
  meta: [
    { name: 'robots', content: $profile.isPublic ? 'index, follow' : 'noindex, nofollow' },
    { name: 'theme-color', content: toHslString($profile.settings.public.design.color) },
    { property: 'og:url', content: $profile.canonicalUrl },
    { property: 'og:image', content: $profile.settings.public.meta.ogimage || '' },
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
      href: $profile.settings.public.meta.favicon || '',
    },
  ],
  style: [
    {
      innerHTML: colorCss,
    },
    {
      id: 'custom-style',
      innerHTML: $profile.settings.public.css,
    },
    ...htmlComponents.value.map(component => {
      return {
        id: `html-component-style-${component.id}`,
        innerHTML: `#main #${component.key}-${component.id} {\n${component.css}\n}`,
      }
    }
  )],
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
      v-for="component in components"
      :key="component.id"
    >
      <ProfileMainHeader
        v-if="component.key === 'header'"
        :component="component"
        @edit="openAdmin(component.id)"
      />
      <ProfileMainMenu
        v-else-if="component.key === 'menu'"
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
      <ProfileMainHtml
        v-else-if="component.key === 'html'"
        :component="component"
        @edit="openAdmin(component.id)"
      />
    </template>
    <ProfileMainFooter />
  </FontWrapper>
</template>

<style>
#main .prose,
.tiptap {
  mark {
    border-radius: v-bind(borderRadius);
  }

  img {
    border-radius: v-bind(borderRadius);
  }
}
</style>