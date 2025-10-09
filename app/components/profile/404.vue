<script setup lang="ts">
const { $profile } = useProfile()

const appConfig = useAppConfig()
appConfig.ui.colors.primary = 'website'
appConfig.ui.button.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.input.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.select.defaultVariants.rounded = $profile.settings.public.design.rounded
appConfig.ui.textarea.defaultVariants.rounded = $profile.settings.public.design.rounded

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
  title: $profile.settings.public.company.name + ' - Seite nicht gefunden',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'theme-color', content: toHslString($profile.settings.public.design.color) },
    { property: 'og:url', content: $profile.canonicalUrl },
    { property: 'og:image', content: $profile.settings.public.meta.ogimage || '' },
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
      innerHTML: $profile.settings.public.design.css,
    },
  ],
})
</script>

<template>
  <FontWrapper
    id="main"
    :font="$profile.settings.public.design.font"
    class="relative"
    :class="$profile.isOwned || $profile.isAdmin ? 'pb-[56px] md:pb-0 md:pt-[56px]' : ''"
  >
    <div class="max-w-3xl mx-auto py-12 px-6 prose-sm sm:prose-lg">
      <h2 class="!mb-0">
        {{ $profile.settings.public.company.name }}
      </h2>
      <ULink to="/" class="flex items-center gap-2">
        <UIcon
          name="i-heroicons-arrow-left"
        />
        zur Website
      </ULink>
      <h1 class="text-2xl !mt-8">
        Seite nicht gefunden
      </h1>

      <p>
        Die aufgerufene Seite <em>{{ $profile.canonicalUrl }}</em> existiert nicht.
      </p>

      <p>
        Überprüfen Sie die Adresse auf Tippfehler oder kehren Sie <a href="/" class="underline">zur Startseite</a> zurück.
      </p>

      <div class="w-full flex items-center justify-center gap-2 mt-12 text-sm">
        <ULink
          to="/impressum"
          class="text-gray-400"
        >
          Impressum
        </ULink>
      </div>
    </div>
  </FontWrapper>
</template>
