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
const font = 'roboto'
appConfig.ui.colors.primary = 'sky'
</script>

<template>
  <FontWrapper :font="font">
    <!-- Fullscreen header with Lorem Picsum image -->
    <div class="relative w-full h-[40vh] mb-8">
      <img 
        src="https://picsum.photos/1920/1080" 
        alt="Header image" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
        <h1 class="text-3xl font-bold mb-2">
          {{ currentSettings?.title || route.params.username }}
        </h1>
        <p class="text-lg text-center max-w-md px-4">
          {{ currentSettings?.description || 'Stellen Sie Ihre Fragen und erhalten Sie Antworten.' }}
        </p>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-6 px-6">
      <div class="size-16 rounded-full bg-gray-100 flex items-center justify-center">
        <UIcon
          name="i-heroicons-photo"
          class="size-7 opacity-25"
        />
      </div>
      <!-- Removing duplicated title and description since they're now in the header -->
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

      <AskForm :username="username" />

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
      <div class="w-full flex gap-2 mt-12 text-sm">
        <UButton
          class="text-gray-400 mr-auto"
          icon="i-heroicons-cog-6-tooth"
          variant="ghost"
          color="neutral"
          size="md"
          @click="showSettingsModal = true"
        >
          Einstellungen
        </UButton>
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
