<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const config = ref('=0nI9UUYQpURKZXSmBnVkNFZykzNthnVL9GMkZFSzhncx4Ucyk2aDhkd1BHbUNnI6ISeltmIsIiI6ISawFmIsIiI6ISehxWZyJCLiYTMxEjM6UGZuIXZk5WZhxGd092atMXdrJXYt5Cdy9GcwV3ciojI0N3boJye')
const { copy, copied } = useClipboard({ source: config })
</script>

<template>
  <PagesLandingpageColorMode class="font-poppins text-[16px]/[1.6] bg-slate-50 text-slate-900 dark:bg-[#0b1020] dark:text-[#e7ecf4]">
    <PagesLandingpageHeader />

    <div class="mx-auto flex flex-col justify-center py-16 lg:py-24 max-w-7xl px-6 lg:px-8">
      <div class="flex items-center gap-6">
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-pretty text-gray-900 sm:text-4xl">
            IT-Support &amp; Fernwartung
          </h1>
        </div>
      </div>
      <p class="mt-8 text-lg/8 text-gray-600">
        Um Ihnen schnell und effizient bei technischen Problemen zu helfen, können Sie mir einen Fernwartungszugriff auf
        Ihren Computer gewähren.
        Die Informationen, die dabei übertragen werden (also das, was Ihr Bildschirm anzeigt), sind außer mir und Ihnen
        niemandem zugänglich. Außer für den initialen Verbindungsaufbau, sind keine dritten Parteien beteiligt.
        Mehr dazu finden Sie in meiner <a
          href="/datenschutz"
          class="text-sky-500 hover:underline"
        >Datenschutzerklärung</a>.
      </p>
      <p class="mt-8 mb-8 text-lg/8 text-gray-600">
        Laden Sie dazu bitte die Fernwartungssoftware über einen der Buttons unten herunter und starten Sie sie, durch
        einen Doppelklick auf die heruntergeladene Datei.
      </p>
      <UButton
        href="https://github.com/rustdesk/rustdesk/releases/download/1.4.0/rustdesk-1.4.0-x86_64.exe"
        target="_blank"
        rel="noopener noreferrer"
        download
        class="mb-2"
        size="xxl"
        trailing-icon="i-heroicons-arrow-down-tray"
        :ui="{
          trailingIcon: 'ml-auto opacity-50 size-8'
        }"
      >
        <template #leading>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="mr-4 size-8 shrink-0"
          >
            <path
              fill="currentColor"
              d="m3.001 5.479l7.377-1.016v7.127H3zm0 13.042l7.377 1.017v-7.04H3zm8.188 1.125L21.001 21v-8.502h-9.812zm0-15.292v7.236h9.812V3z"
            />
          </svg>
        </template>

        Fernwartungssoftware für Windows herunterladen
      </UButton>
      <UButton
        href="https://github.com/rustdesk/rustdesk/releases/download/1.4.0/rustdesk-1.4.0-x86_64.dmg"
        target="_blank"
        rel="noopener noreferrer"
        download
        class="mb-2"
        size="xxl"
        trailing-icon="i-heroicons-arrow-down-tray"
        :ui="{
          trailingIcon: 'ml-auto opacity-50 size-8'
        }"
      >
        <template #leading>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="mr-4 size-8 shrink-0"
          >
            <path
              fill="currentColor"
              d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47c-1.34.03-1.77-.79-3.29-.79c-1.53 0-2 .77-3.27.82c-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51c1.28-.02 2.5.87 3.29.87c.78 0 2.26-1.07 3.81-.91c.65.03 2.47.26 3.64 1.98c-.09.06-2.17 1.28-2.15 3.81c.03 3.02 2.65 4.03 2.68 4.04c-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5c.13 1.17-.34 2.35-1.04 3.19c-.69.85-1.83 1.51-2.95 1.42c-.15-1.15.41-2.35 1.05-3.11"
            />
          </svg>
        </template>
        Fernwartungssoftware für macOS herunterladen
      </UButton>
      <p class="mt-8 text-lg/8 text-gray-600">
        Nach dem Start der Software, wird Ihnen eine ID und ein Einmalpasswort angezeigt. Tauschen Sie diese
        Informationen bitte nur telefonisch mit mir aus und behandeln Sie sie vertraulich.
        Sobald Sie die Software wieder schließen, ist der Zugriff auf Ihren Computer nicht mehr möglich.
      </p>
      <p class="mt-8 mb-8 text-lg/8 text-gray-600">
        Um eine Verbindung herzustellen, müssen Sie außerdem einmalig eine Einstellung vornehmen.
        Klicken Sie dazu hier auf den Button "Konfiguration kopieren" und fügen Sie diese in der Fernwartungssoftware
        ein, wie unten gezeigt.
      </p>
      <UButton
        color="primary"
        @click="copy(config)"
        size="xxl"
        icon="i-heroicons-cog-6-tooth"
        trailing-icon="i-heroicons-clipboard"
        :ui="{
          leadingIcon: 'mr-4 size-8 shrink-0',
          trailingIcon: 'ml-auto opacity-50 size-8'
        }"
      >
        {{ copied ? 'Konfiguration kopiert!' : 'Konfiguration kopieren' }}
      </UButton>
      <video
        controls
        class="w-full mt-8 rounded-md shadow-xl"
      >
        <source
          src="/rustdesk.mp4"
          type="video/mp4"
        >
        Ihr Browser unterstützt das Video-Tag nicht.
      </video>
    </div>

    <PagesLandingpageFooter />
  </PagesLandingpageColorMode>
</template>
