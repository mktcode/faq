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

      <div class="text-gray-500 prose-xl">
        <h1 class="mb-0 text-center">
          Impressum
        </h1>

        <p class="mt-2 text-gray-400 text-center">
          Angaben gemäß § 5 TMG:
        </p>

        <h2>
          Inhaltlich verantwortlich gemäß § 55 Abs. 2 RStV:
        </h2>

        <p>
          {{ currentSettings?.company?.name || 'Dein Unternehmensname' }}<br>
          {{ currentSettings?.company?.street || 'Deine Straße und Hausnummer' }}<br>
          {{ currentSettings?.company?.zip || 'Deine Postleitzahl' }} {{ currentSettings?.company?.city || 'Deine Stadt' }}<br>
          <br>
          Telefon: {{ currentSettings?.company?.phone || 'Deine Telefonnummer' }}<br>
          E-Mail: <a :href="`mailto:${currentSettings?.company?.email || 'kontakt@beispiel.de'}`">
            {{ currentSettings?.company?.email || 'kontakt@beispiel.de' }}
          </a>
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
