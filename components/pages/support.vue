<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const config = ref('=0nI9UUYQpURKZXSmBnVkNFZykzNthnVL9GMkZFSzhncx4Ucyk2aDhkd1BHbUNnI6ISeltmIsIiI6ISawFmIsIiI6ISehxWZyJCLiYTMxEjM6UGZuIXZk5WZhxGd092atMXdrJXYt5Cdy9GcwV3ciojI0N3boJye')
const { copy, copied } = useClipboard({ source: config })
</script>

<template>
  <div class="centered py-12">
    <a href="/" class="flex items-center mb-8 w-fit">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="size-4 mr-2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>

      Zurück zur Startseite
    </a>
    <div class="prose">
      <h1>
        Fernwartung
      </h1>
      <p>
        Um Ihnen schnell und effizient bei technischen Problemen zu helfen, können Sie mir einen Fernwartungszugriff auf
        Ihren Computer gewähren.
        Die Informationen, die dabei übertragen werden (also das, was Ihr Bildschirm anzeigt), sind außer mir und Ihnen
        niemandem zugänglich. Außer für den initialen Verbindungsaufbau, sind keine dritten Parteien beteiligt.
        Mehr dazu finden Sie in meiner <a href="/datenschutz"
          class="text-sky-500 hover:underline">Datenschutzerklärung</a>.
      </p>
      <p>
        Laden Sie dazu bitte die Fernwartungssoftware über einen der Buttons unten herunter und starten Sie sie, durch
        einen Doppelklick auf die heruntergeladene Datei.
      </p>
      <a href="https://github.com/rustdesk/rustdesk/releases/download/1.4.0/rustdesk-1.4.0-x86_64.exe" target="_blank"
        rel="noopener noreferrer" download class="no-underline">
        <button class="mt-4 px-4 py-2 text-white bg-sky-900 rounded-md flex gap-2 justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="m3.001 5.479l7.377-1.016v7.127H3zm0 13.042l7.377 1.017v-7.04H3zm8.188 1.125L21.001 21v-8.502h-9.812zm0-15.292v7.236h9.812V3z" />
          </svg>
          Fernwartungssoftware für Windows herunterladen
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6 opacity-50">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>
      </a>
      <a href="https://github.com/rustdesk/rustdesk/releases/download/1.4.0/rustdesk-1.4.0-x86_64.dmg" target="_blank"
        rel="noopener noreferrer" download class="no-underline">
        <button class="mt-4 px-4 py-2 text-white bg-sky-900 rounded-md flex gap-2 justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47c-1.34.03-1.77-.79-3.29-.79c-1.53 0-2 .77-3.27.82c-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51c1.28-.02 2.5.87 3.29.87c.78 0 2.26-1.07 3.81-.91c.65.03 2.47.26 3.64 1.98c-.09.06-2.17 1.28-2.15 3.81c.03 3.02 2.65 4.03 2.68 4.04c-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5c.13 1.17-.34 2.35-1.04 3.19c-.69.85-1.83 1.51-2.95 1.42c-.15-1.15.41-2.35 1.05-3.11" />
          </svg>
          Fernwartungssoftware für macOS herunterladen
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6 opacity-50">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>
      </a>
      <p>
        Nach dem Start der Software, wird Ihnen eine ID und ein Einmalpasswort angezeigt. Tauschen Sie diese
        Informationen bitte nur telefonisch mit mir aus und behandeln Sie sie vertraulich.
        Sobald Sie die Software wieder schließen, ist der Zugriff auf Ihren Computer nicht mehr möglich.
      </p>
      <p>
        Um eine Verbindung herzustellen, müssen Sie außerdem einmalig eine Einstellung vornehmen.
        Klicken Sie dazu hier auf den Button "Konfiguration kopieren" und fügen Sie diese in der Fernwartungssoftware
        ein, wie unten gezeigt.
      </p>
      <button class="mt-4 px-4 py-2 text-white bg-sky-900 rounded-md flex gap-2 justify-center items-center"
        @click="copy(config)">
        <svg v-if="copied" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="size-6 opacity-50">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
        </svg>
        {{ copied ? 'Konfiguration kopiert!' : 'Konfiguration kopieren' }}
      </button>
      <video controls class="w-full">
        <source src="/rustdesk.mp4" type="video/mp4">
        Ihr Browser unterstützt das Video-Tag nicht.
      </video>
    </div>
  </div>
</template>
