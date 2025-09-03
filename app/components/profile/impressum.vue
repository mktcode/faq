<script setup lang="ts">
const { $profile } = useProfile()
const font = computed(() => $profile.settings.public.design.font)
</script>

<template>
  <FontWrapper :font="font">
    <ProfileMainHeader />
    <div class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 px-6">
      <div class="prose-xl">
        <h1 class="text-center">
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
      </div>

      <div class="w-full flex items-center justify-center gap-2 mt-12 text-sm">
        <ULink
          to="/"
          class="text-gray-400"
        >
          Startseite
        </ULink>
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
