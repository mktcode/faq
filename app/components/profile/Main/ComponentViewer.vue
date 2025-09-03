<script setup lang="ts">
import type { ComponentKey } from '~~/types/db'

const { slotIndex } = defineProps<{
  slotIndex: number
}>()

const nuxtApp = useNuxtApp()
const { $profile } = nuxtApp

function isComponentDisplayed(componentKey: ComponentKey, index: number): boolean {
  if (componentKey === 'offers' && !$profile.settings.public.components.offers.items.length) {
    return false
  }
  if (componentKey === 'gallery' && !$profile.settings.public.components.gallery.items.length) {
    return false
  }
  if (componentKey === 'downloads' && !$profile.settings.public.components.downloads.items.length) {
    return false
  }

  const isVisible = $profile.settings.public.components[componentKey].visible
  const correctIndex = $profile.settings.public.components[componentKey].order === index

  return !!(isVisible && correctIndex)
}
</script>

<template>
  <ProfileMainOffer v-if="isComponentDisplayed('offers', slotIndex)" />
  <ProfileMainGallery v-else-if="isComponentDisplayed('gallery', slotIndex)" />
  <ProfileMainDownloads v-else-if="isComponentDisplayed('downloads', slotIndex)" />
  <ProfileMainContactForm v-else-if="isComponentDisplayed('form', slotIndex)" />
  <ProfileMainFAQ v-else-if="isComponentDisplayed('faq', slotIndex)" />
</template>
