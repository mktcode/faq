<script setup lang="ts">
import type { ComponentKey } from '~/types/db'

const { username, slotIndex } = defineProps<{
  username: string
  slotIndex: number
}>()

const { data: currentSettings } = await useFetch(`/api/settings`, {
  query: {
    username,
  },
})

function isComponentDisplayed(component: ComponentKey, index: number): boolean {
  const isVisible = currentSettings.value?.displayedComponents?.includes(component) || false
  const correctIndex = currentSettings.value?.displayedComponents?.indexOf(component) === index
  return isVisible && correctIndex
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 px-6">
    <ProfileDefaultOffer
      v-if="currentSettings?.offers?.length && isComponentDisplayed('offer', slotIndex)"
      :offers="currentSettings.offers"
    />

    <ProfileDefaultGallery
      v-if="currentSettings?.gallery?.length && isComponentDisplayed('gallery', slotIndex)"
      :images="currentSettings?.gallery"
    />
  </div>
</template>
