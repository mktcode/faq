<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const { showSupportRemotePrepare, go } = useAdmin()

const config = ref('=0nI9UUYQpURKZXSmBnVkNFZykzNthnVL9GMkZFSzhncx4Ucyk2aDhkd1BHbUNnI6ISeltmIsIiI6ISawFmIsIiI6ISehxWZyJCLiYTMxEjM6UGZuIXZk5WZhxGd092atMXdrJXYt5Cdy9GcwV3ciojI0N3boJye')
const { copy, copied } = useClipboard({ source: config })
</script>

<template>
  <USlideover
    :open="showSupportRemotePrepare"
    side="right"
    :overlay="false"
    close-icon="i-heroicons-arrow-left"
    :close="{
      size: 'md',
      onClick: () => {
        go('#support/remote')
      }
    }"
    :ui="{
      wrapper: 'z-40',
      overlay: 'backdrop-blur-xs',
      footer: 'justify-between',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-laptop-minimal-check"
          class="inline-block size-6 opacity-50"
        />
        Fernwartung einrichten
      </h3>
    </template>

    <template #body>
      <p>
        Um Ihnen schnell und effizient bei technischen Problemen zu helfen, können Sie uns einen Fernwartungszugriff auf
        Ihren Computer gewähren.
      </p>
      <p class="mt-4 mb-4">
        Laden Sie dazu bitte die Fernwartungssoftware <img
          src="/rustdesk.png"
          alt="Rust Desk Logo"
          class="inline-block size-6 rounded-full border border-gray-200 align-bottom mb-1"
        > <em>Rust Desk</em> herunter und starten Sie sie, durch
        einen Doppelklick auf die heruntergeladene Datei.
      </p>
      <UButton
        href="https://solohost.de/rustdesk-1.4.1.exe"
        target="_blank"
        rel="noopener noreferrer"
        download
        class="mb-2"
        trailing-icon="i-heroicons-arrow-down-tray"
        :ui="{
          trailingIcon: 'ml-auto opacity-50 size-6',
        }"
        block
      >
        <template #leading>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="size-6 shrink-0"
          >
            <path
              fill="currentColor"
              d="m3.001 5.479l7.377-1.016v7.127H3zm0 13.042l7.377 1.017v-7.04H3zm8.188 1.125L21.001 21v-8.502h-9.812zm0-15.292v7.236h9.812V3z"
            />
          </svg>
        </template>

        für Windows herunterladen
      </UButton>
      <UButton
        href="https://solohost.de/rustdesk-1.4.1.dmg"
        target="_blank"
        rel="noopener noreferrer"
        download
        class="mb-2"
        trailing-icon="i-heroicons-arrow-down-tray"
        :ui="{
          trailingIcon: 'ml-auto opacity-50 size-6',
        }"
        block
      >
        <template #leading>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="size-6 shrink-0"
          >
            <path
              fill="currentColor"
              d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47c-1.34.03-1.77-.79-3.29-.79c-1.53 0-2 .77-3.27.82c-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51c1.28-.02 2.5.87 3.29.87c.78 0 2.26-1.07 3.81-.91c.65.03 2.47.26 3.64 1.98c-.09.06-2.17 1.28-2.15 3.81c.03 3.02 2.65 4.03 2.68 4.04c-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5c.13 1.17-.34 2.35-1.04 3.19c-.69.85-1.83 1.51-2.95 1.42c-.15-1.15.41-2.35 1.05-3.11"
            />
          </svg>
        </template>
        für macOS herunterladen
      </UButton>
      <p class="mt-4">
        Nach dem Start der Software, wird Ihnen eine ID und ein Einmalpasswort angezeigt. Tauschen Sie diese
        Informationen bitte nur telefonisch mit uns aus und behandeln Sie sie vertraulich.
        Sobald Sie das Programm wieder schließen, ist der Zugriff auf Ihren Computer nicht mehr möglich.
      </p>
      <p class="mt-4 mb-4">
        Um eine Verbindung herzustellen, müssen Sie außerdem einmalig eine Einstellung vornehmen.
        Klicken Sie dazu hier auf den Button "Konfiguration kopieren" und fügen Sie diese in der Fernwartungssoftware
        ein, wie unten gezeigt.
      </p>
      <UButton
        color="primary"
        icon="i-heroicons-cog-6-tooth"
        trailing-icon="i-heroicons-clipboard"
        :ui="{
          leadingIcon: 'size-6 shrink-0',
          trailingIcon: 'ml-auto opacity-50 size-6',
        }"
        block
        @click="copy(config)"
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
    </template>
  </USlideover>
</template>
