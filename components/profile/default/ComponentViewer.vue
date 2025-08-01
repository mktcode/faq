<script setup lang="ts">
import type { ComponentKey } from '~/types/db'

const { slotIndex } = defineProps<{
  slotIndex: number
}>()

const { settings } = await useProfile()

function isComponentDisplayed(component: ComponentKey, index: number): boolean {
  const isVisible = settings.value?.displayedComponents?.includes(component) || false
  const correctIndex = settings.value?.displayedComponents?.indexOf(component) === index
  return isVisible && correctIndex
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 w-full">
    <ProfileDefaultOffer v-if="isComponentDisplayed('offer', slotIndex)" />
    <ProfileDefaultGallery v-if="isComponentDisplayed('gallery', slotIndex)" />
    <ProfileDefaultDownloads v-if="isComponentDisplayed('downloads', slotIndex)" />
    <ProfileDefaultForm v-if="isComponentDisplayed('form', slotIndex)" />
    <ProfileDefaultFAQ v-if="isComponentDisplayed('faq', slotIndex)" />
  </div>
</template>
