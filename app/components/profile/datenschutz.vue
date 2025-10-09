<script setup lang="ts">
const { $profile, showLegalDataWarning } = useProfile()

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
        Datenschutzerklärung
      </h1>

      <UAlert
        v-if="showLegalDataWarning"
        variant="soft"
        title="Unternehmensdaten vervollständigen"
        icon="i-heroicons-exclamation-triangle"
        :actions="[{
          label: 'Daten vervollständigen',
          icon: 'i-heroicons-building-office-2',
          size: 'lg',
          to: '/#settings/company',
        }]"
      >
        <template #description>
          Damit Ihre Webseite den gesetzlichen Anforderungen entspricht, fehlen noch einige wichtige Angaben zu Ihrem Unternehmen.
          Bitte ergänzen Sie diese Informationen.
        </template>
      </UAlert>
      <template v-else>
        <p>
          Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zwecke der Verarbeitung von personenbezogenen Daten (nachfolgend kurz „Daten“) innerhalb unseres Onlineangebotes auf. Die verwendeten Begrifflichkeiten, wie z.B. „Verarbeitung“ oder „Verantwortlicher“, beziehen sich auf die Definitionen im Art. 4 der Datenschutz-Grundverordnung (DSGVO).
        </p>

        <h3>Verantwortlicher</h3>
        <p>
          Verantwortlicher für die Datenverarbeitung ist:
          <br>
          <strong>{{ $profile.settings.public.company.firstname }} {{ $profile.settings.public.company.lastname }}</strong>
          <br>
          <strong>Adresse:</strong> {{ $profile.settings.public.company.street }}, {{ $profile.settings.public.company.zip }} {{ $profile.settings.public.company.city }}
          <br>
          <strong>E-Mail:</strong> <a :href="`mailto:${$profile.settings.public.company.email}`">{{ $profile.settings.public.company.email }}</a>
        </p>

        <h3>Arten der verarbeiteten Daten</h3>
        <ul class="list-disc">
          <li>Bestandsdaten (z.B. Namen, Adressen)</li>
          <li>Kontaktdaten (z.B. E-Mail-Adressen, Telefonnummern)</li>
          <li>Inhaltsdaten (z.B. Texteingaben, Fotografien)</li>
          <li>Nutzungsdaten (z.B. besuchte Webseiten, Zugriffszeiten)</li>
          <li>Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen)</li>
        </ul>
      </template>

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
