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
  title: $profile.settings.public.company.name + ' - Datenschutzerklärung',
  meta: [
    { name: 'robots', content: $profile.isPublic ? 'index, follow' : 'noindex, nofollow' },
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
      innerHTML: $profile.settings.public.css,
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
    <div class="max-w-3xl mx-auto py-12 px-6 prose-sm sm:prose-lg">
      <ULink to="/" class="flex items-center gap-2">
        <UIcon
          name="i-heroicons-arrow-left"
        />
        zur Website
      </ULink>
      <h1>
        Impressum
      </h1>

      <p>
        <strong>{{ $profile.settings.public.company.name || 'Dein Unternehmensname' }}</strong><br>
        {{ $profile.settings.public.company.street || 'Deine Straße und Hausnummer' }}<br>
        {{ $profile.settings.public.company.zip || 'Deine Postleitzahl' }} {{ $profile.settings.public.company.city || 'Deine Stadt' }}<br>
        <br>
        <strong>Telefon:</strong> {{ $profile.settings.public.company.phone || 'Deine Telefonnummer' }}<br>
        <strong>E-Mail:</strong> <a :href="`mailto:${$profile.settings.public.company.email || 'kontakt@beispiel.de'}`">
          {{ $profile.settings.public.company.email || 'kontakt@beispiel.de' }}
        </a>
      </p>

      <p
        v-if="$profile.settings.public.company.taxId"
        class="mt-2"
      >
        Umsatzsteuer-ID: {{ $profile.settings.public.company.taxId }}
      </p>
      <p
        v-else
        class="text-gray-500 text-sm"
      >
        Nach § 19 UStG wird keine Umsatzsteuer berechnet.
      </p>

      <div class="w-full flex items-center justify-center gap-2 mt-12 text-sm">
        <ULink
          to="/datenschutz"
          class="text-gray-400"
        >
          Datenschutz
        </ULink>
      </div>
    </div>
  </FontWrapper>
</template>
