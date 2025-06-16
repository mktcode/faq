<script setup lang="ts">
import type { Qanda } from '~/types/db'

definePageMeta({
  validate: async (route) => {
    return (
      typeof route.params.username === 'string' && /^\w+$/.test(route.params.username)
    )
  },
})

const route = useRoute()
const username = computed(() => Array.isArray(route.params.username) ? route.params.username[0] : route.params.username)

const qanda = ref<Qanda[]>([])
const showSettingsModal = ref(false)
const showNewQandaModal = ref(false)

const { data: currentSettings, refresh: refreshSettings } = await useFetch(`/api/settings`, {
  query: {
    username: route.params.username,
  },
})

onMounted(async () => {
  const data = await $fetch(`/api/qanda`, {
    query: {
      username: route.params.username,
    },
  })

  qanda.value = data as Qanda[]
})

const appConfig = useAppConfig()
const font = computed(() => currentSettings.value?.font || 'roboto')
appConfig.ui.colors.primary = currentSettings.value?.color || 'sky'
</script>

<template>
  <FontWrapper :font="font">
    <div class="flex items-center justify-between p-4">
      <UButton
        class="text-gray-400 ml-auto"
        icon="i-heroicons-cog-6-tooth"
        variant="ghost"
        color="neutral"
        size="md"
        @click="showSettingsModal = true"
      >
        Einstellungen
      </UButton>
    </div>
    <div class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 px-6">
      <div class="size-16 rounded-full bg-gray-100 flex items-center justify-center">
        <UIcon
          name="i-heroicons-photo"
          class="size-7 opacity-25"
        />
      </div>
      <h1 class="text-lg font-bold mb-4">
        {{ currentSettings?.title || route.params.username }}
      </h1>
      <div class="w-full flex items-center justify-center gap-2 mb-4">
        <UButton
          icon="i-heroicons-information-circle"
          variant="soft"
        />
        <UButton
          icon="i-heroicons-calendar-days"
          variant="soft"
        />
        <UButton
          icon="i-heroicons-shopping-cart"
          variant="soft"
        />
        <UButton
          icon="i-lucide-instagram"
          variant="soft"
        />
      </div>

      <div class="my-6 w-full">
        <AskGallery />
      </div>

      <div
        v-if="currentSettings?.offers?.length"
        class="my-6 w-full"
      >
        <AskOffer :offers="currentSettings.offers" />
      </div>

      <div class="my-6 w-full">
        <AskForm :username="username" />
      </div>

      <div class="flex flex-col gap-4 w-full mt-6">
        <h3 class="text-2xl font-semibold">
          Häufig gestellte Fragen
        </h3>
        <UButton
          label="Frage und Antwort hinzufügen"
          icon="i-heroicons-plus"
          variant="soft"
          @click="showNewQandaModal = true"
        />
        <div
          v-for="item in qanda"
          :key="item.question"
          class="p-4 bg-white rounded-lg border border-gray-200"
        >
          <div class="flex items-start justify-between">
            <h3 class="text-lg font-semibold">
              {{ item.question }}
            </h3>
            <div class="flex items-center justify-end gap-2">
              <UButton
                icon="i-heroicons-pencil-square"
                variant="ghost"
              />
              <UButton
                icon="i-heroicons-trash"
                variant="ghost"
              />
            </div>
          </div>
          <p class="text-gray-600">
            {{ item.answer }}
          </p>
        </div>
      </div>
      <GoogleReviews v-if="currentSettings?.showGoogleReviews" />
      <CustomerRequestList />
      <div class="w-full flex items-center justify-center gap-2 mt-12 text-sm">
        <ULink class="text-gray-400">
          Impressum
        </ULink>
        <ULink class="text-gray-400">
          Datenschutz
        </ULink>
      </div>
      <SettingsModal
        v-model:show="showSettingsModal"
        @update="refreshSettings"
      />
      <NewQandaModal v-model:show="showNewQandaModal" />
      <ClientOnly>
        <WelcomeModal />
      </ClientOnly>
    </div>
  </FontWrapper>
</template>
