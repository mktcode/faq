<script setup lang="ts">
import type { Catalog } from '~/types/db/catalogs'

const { clear } = useUserSession()

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

const showSettingsModal = ref(false)

const question = ref('')
const newQuestion = ref('')
const newAnswer = ref('')
const topic = ref('')

function logout() {
  clear()
  navigateTo('/')
}

onMounted(async () => {
  const data = await $fetch('/api/user/catalogs')
  catalogs.value = data || []
  if (catalogs.value.length > 0) {
    selectedCatalogId.value = catalogs.value[0].id
  }
})
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
      to="/ask/mktcode"
      label="autofaq.com/ask/mktcode"
      trailing-icon="i-heroicons-arrow-right"
      variant="soft"
      block
    />
    <UTextarea
      v-model="question"
      placeholder="Enter your question"
      class="w-full"
    />
    <UButton
      label="Test"
      block
    />
    <div class="py-6" />
    <div class="w-full flex items-center gap-2">
      <h3 class="text-lg font-semibold mt-4">
        New Question and Answer
      </h3>
      <UButton
        label="Manage"
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
