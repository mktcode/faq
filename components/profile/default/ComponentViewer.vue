<script setup lang="ts">
import type { ComponentKey } from '~/types/db'

const { slotIndex } = defineProps<{
  slotIndex: number
}>()

const nuxtApp = useNuxtApp()
const { $profile } = nuxtApp

function isComponentDisplayed(componentKey: ComponentKey, index: number): boolean {
  if (componentKey === 'offers' && !$profile.settings.components.offers.items.length) {
    return false
  }
  if (componentKey === 'gallery' && !$profile.settings.components.gallery.items.length) {
    return false
  }
  if (componentKey === 'downloads' && !$profile.settings.components.downloads.items.length) {
    return false
  }

  const isVisible = $profile.settings.components[componentKey].visible
  const correctIndex = $profile.settings.components[componentKey].order === index

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
