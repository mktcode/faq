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
  <ProfileDefaultOffer v-if="isComponentDisplayed('offer', slotIndex)" />
  <ProfileDefaultGallery v-else-if="isComponentDisplayed('gallery', slotIndex)" />
  <ProfileDefaultDownloads v-else-if="isComponentDisplayed('downloads', slotIndex)" />
  <ProfileDefaultForm v-else-if="isComponentDisplayed('form', slotIndex)" />
  <ProfileDefaultFAQ v-else-if="isComponentDisplayed('faq', slotIndex)" />
</template>
