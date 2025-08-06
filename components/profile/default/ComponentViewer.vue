<script setup lang="ts">
import type { ComponentKey, SettingsForm } from '~/types/db'

const { slotIndex } = defineProps<{
  slotIndex: number
}>()

const { settings } = await useProfile()

function isComponentDisplayed(componentKey: ComponentKey, index: number): boolean {
  if (componentKey === 'offers' && !settings.value?.components.offers.items.length) {
    return false
  }
  if (componentKey === 'gallery' && !settings.value?.components.gallery.items.length) {
    return false
  }
  if (componentKey === 'downloads' && !settings.value?.components.downloads.items.length) {
    return false
  }

  const isVisible = settings.value?.components[componentKey].visible
  const correctIndex = settings.value?.components[componentKey].order === index

  return !!(isVisible && correctIndex)
}
</script>

<template>
  <ProfileDefaultOffer v-if="isComponentDisplayed('offers', slotIndex)" />
  <ProfileDefaultGallery v-else-if="isComponentDisplayed('gallery', slotIndex)" />
  <ProfileDefaultDownloads v-else-if="isComponentDisplayed('downloads', slotIndex)" />
  <ProfileDefaultForm v-else-if="isComponentDisplayed('form', slotIndex)" />
  <ProfileDefaultFAQ v-else-if="isComponentDisplayed('faq', slotIndex)" />
</template>
