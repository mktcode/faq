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

const logo = computed(() => {
  return currentSettings.value?.logo || null
})
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

      <h1 class="text-lg font-bold mb-4">
        {{ currentSettings?.title || username }}
      </h1>

      <div class="prose-xl">
        <h1 class="text-center">
          Impressum
        </h1>

        <p>
          <strong>{{ currentSettings?.company?.name || 'Dein Unternehmensname' }}</strong><br>
          {{ currentSettings?.company?.street || 'Deine Straße und Hausnummer' }}<br>
          {{ currentSettings?.company?.zip || 'Deine Postleitzahl' }} {{ currentSettings?.company?.city || 'Deine Stadt' }}<br>
          <br>
          <strong>Telefon:</strong> {{ currentSettings?.company?.phone || 'Deine Telefonnummer' }}<br>
          <strong>E-Mail:</strong> <a :href="`mailto:${currentSettings?.company?.email || 'kontakt@beispiel.de'}`">
            {{ currentSettings?.company?.email || 'kontakt@beispiel.de' }}
          </a>
        </p>

        <p
          v-if="currentSettings?.company?.taxId"
          class="mt-2"
        >
          Umsatzsteuer-ID: {{ currentSettings?.company?.taxId }}
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
