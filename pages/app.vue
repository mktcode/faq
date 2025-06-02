<script setup lang="ts">
import type { Catalog, Qanda } from '~/types/db'

const { clear } = useUserSession()

const { data: me } = await useFetch('/api/user/me')

const catalogs = ref<Catalog[]>([])
const selectedCatalogId = ref<number | undefined>(undefined)
const selectedCatalog = computed(() => {
  return catalogs.value.find(catalog => catalog.id === selectedCatalogId.value)
})
const catalogItems = computed(() => {
  return catalogs.value.map(catalog => ({
    label: catalog.name,
    value: catalog.id,
  }))
})

const qanda = ref<Qanda[]>([])

const showSettingsModal = ref(false)

const newQuestion = ref('')
const newAnswer = ref('')
const topic = ref('')

function logout() {
  clear()
  navigateTo('/')
}

onMounted(async () => {
  const catalogsFromDb = await $fetch('/api/user/catalogs')
  catalogs.value = catalogsFromDb || []
  if (catalogs.value.length > 0) {
    selectedCatalogId.value = catalogs.value[0].id
  }

  const qandaFromDb = await $fetch('/api/user/catalogs/qanda', {
    query: {
      catalogId: selectedCatalogId.value,
    },
  })
  qanda.value = qandaFromDb || []
})

async function addNewQandA() {
  if (!selectedCatalogId.value || !newQuestion.value || !newAnswer.value) {
    return
  }

  const payload = {
    catalogId: selectedCatalogId.value,
    question: newQuestion.value,
    answer: newAnswer.value,
    topic: topic.value,
  }

  await $fetch('/api/user/catalogs/qanda', {
    method: 'POST',
    body: payload,
  })

  newQuestion.value = ''
  newAnswer.value = ''
  topic.value = ''
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 h-screen max-w-lg mx-auto">
    <div class="w-full flex items-center gap-2">
      <USelect
        v-model="selectedCatalogId"
        :items="catalogItems"
        placeholder="Select a catalog"
        class="flex-1"
      />
      <UButton
        icon="i-heroicons-cog-6-tooth"
        variant="soft"
        @click="showSettingsModal = true"
      />
    </div>
    <UButton
      v-if="me"
      :to="`/ask/${me.userName}/${selectedCatalogId}`"
      :label="`autofaq.com/ask/${me.userName}/${selectedCatalogId}`"
      trailing-icon="i-heroicons-arrow-right"
      variant="soft"
      block
    />
    <div class="py-6" />
    <div class="w-full flex items-center gap-2">
      <h3 class="text-lg font-semibold mt-4">
        New Question and Answer
      </h3>
      <UButton
        :label="`Manage (${qanda.length})`"
        class="ml-auto"
        size="lg"
      />
      <UButton
        label="Import"
        size="lg"
      />
    </div>
    <UInput
      v-model="topic"
      placeholder="Topic"
      class="w-full"
    />
    <UTextarea
      v-model="newQuestion"
      placeholder="Enter your question"
      class="w-full"
    />
    <UTextarea
      v-model="newAnswer"
      placeholder="Enter your answer"
      class="w-full"
    />
    <UButton
      label="Add"
      block
      @click="addNewQandA"
    />
    <div>
      <UButton
        label="logout"
        @click="logout"
      />
    </div>
    <CatalogSettingsModal
      v-if="selectedCatalog"
      v-model:show="showSettingsModal"
      :catalog="selectedCatalog"
    />
  </div>
</template>
