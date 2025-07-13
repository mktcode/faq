<script setup lang="ts">
const { username } = defineProps<{
  username: string
}>()

const { data: currentSettings } = await useFetch(`/api/settings`, {
  query: {
    username,
  },
})

const appConfig = useAppConfig()
const font = computed(() => currentSettings.value?.font || 'roboto')
appConfig.ui.colors.primary = currentSettings.value?.color || 'sky'

const logo = 'https://nbg1.your-objectstorage.com/mktcms/1/icon.webp'
</script>

<template>
  <FontWrapper :font="font">
    <div class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 px-6">
      <div
        v-if="logo"
      >
        <NuxtImg
          :src="logo"
          alt="Logo"
          class="w-16 mb-4"
        />
      </div>
      <div
        v-else
        class="size-16 rounded-full bg-gray-100 flex items-center justify-center"
      >
        <UIcon
          name="i-heroicons-photo"
          class="size-7 opacity-25"
        />
      </div>
      <h1 class="text-lg font-bold mb-4">
        {{ currentSettings?.title || username }}
      </h1>

      <div class="text-gray-500 prose">
        <h1>Datenschutzerklärung</h1>
        <p>
          Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zwecke der Verarbeitung von personenbezogenen Daten (nachfolgend kurz „Daten“) innerhalb unseres Onlineangebotes auf. Die verwendeten Begrifflichkeiten, wie z.B. „Verarbeitung“ oder „Verantwortlicher“, beziehen sich auf die Definitionen im Art. 4 der Datenschutz-Grundverordnung (DSGVO).
        </p>

        <h2>Verantwortlicher</h2>
        <p>
          Verantwortlicher für die Datenverarbeitung ist:
          <br>
          <strong>Markus Kottländer</strong>
          <br>
          <strong>Adresse:</strong> Gertrudenstraße 23a, 49074 Osnabrück
          <br>
          <strong>E-Mail:</strong> <a href="mailto:kontakt@markus-kottlaender.de">kontakt@markus-kottlaender.de</a>
        </p>

        <h2>Arten der verarbeiteten Daten</h2>
        <ul>
          <li>Bestandsdaten (z.B. Namen, Adressen)</li>
          <li>Kontaktdaten (z.B. E-Mail-Adressen, Telefonnummern)</li>
          <li>Inhaltsdaten (z.B. Texteingaben, Fotografien)</li>
          <li>Nutzungsdaten (z.B. besuchte Webseiten, Zugriffszeiten)</li>
          <li>Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen)</li>
        </ul>
      </div>

      <div class="w-full flex items-center justify-center gap-2 mt-12 text-sm">
        <ULink
          to="/"
          class="text-gray-400"
        >
          Startseite
        </ULink>
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
