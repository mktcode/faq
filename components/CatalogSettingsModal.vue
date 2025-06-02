<script setup lang="ts">
import type { Catalog } from '~/types/db'

const showModal = defineModel('show', {
  default: true,
  type: Boolean,
})

const { catalog } = defineProps<{
  catalog: Catalog
}>()

const name = ref(catalog.name || '')
const info = ref(catalog.info || '')

async function updateCatalog() {
  await $fetch('/api/user/catalogs', {
    method: 'POST',
    body: {
      id: catalog.id,
      name: name.value,
      info: info.value,
    },
  })
  showModal.value = false
}
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UInput
          v-model="name"
          placeholder="Enter catalog name"
          class="w-full"
        />
        <UTextarea
          v-model="info"
          placeholder="Enter catalog information"
          class="w-full"
        />
        <UButton
          label="Update Catalog"
          class="w-full"
          @click="updateCatalog"
        />
      </div>
    </template>
  </UModal>
</template>
