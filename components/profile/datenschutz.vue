<script setup lang="ts">
const { settings } = await useProfile()
const appConfig = useAppConfig()
const font = computed(() => settings.value.design.font)
appConfig.ui.colors.primary = settings.value.design.color
</script>

<template>
  <FontWrapper :font="font">
    <ProfileMainHeader />
    <div class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 px-6">
      <div class="prose-xl">
        <h1 class="text-center">
          Datenschutzerklärung
        </h1>
        <p>
          Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zwecke der Verarbeitung von personenbezogenen Daten (nachfolgend kurz „Daten“) innerhalb unseres Onlineangebotes auf. Die verwendeten Begrifflichkeiten, wie z.B. „Verarbeitung“ oder „Verantwortlicher“, beziehen sich auf die Definitionen im Art. 4 der Datenschutz-Grundverordnung (DSGVO).
        </p>

        <h3>Verantwortlicher</h3>
        <p>
          Verantwortlicher für die Datenverarbeitung ist:
          <br>
          <strong>Markus Kottländer</strong>
          <br>
          <strong>Adresse:</strong> Gertrudenstraße 23a, 49074 Osnabrück
          <br>
          <strong>E-Mail:</strong> <a href="mailto:kontakt@markus-kottlaender.de">kontakt@markus-kottlaender.de</a>
        </p>

        <h3>Arten der verarbeiteten Daten</h3>
        <ul class="list-disc">
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
