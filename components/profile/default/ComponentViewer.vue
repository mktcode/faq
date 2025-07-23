<script setup lang="ts">
import type { ComponentKey, SettingsForm } from '~/types/db'

const { username, settings, slotIndex } = defineProps<{
  username: string
  settings: SettingsForm
  slotIndex: number
}>()

function isComponentDisplayed(component: ComponentKey, index: number): boolean {
  const isVisible = settings.displayedComponents?.includes(component) || false
  const correctIndex = settings.displayedComponents?.indexOf(component) === index
  return isVisible && correctIndex
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 w-full">
    <ProfileDefaultOffer
      v-if="settings.offers?.length && isComponentDisplayed('offer', slotIndex)"
      :offers="settings.offers"
    />

    <ProfileDefaultGallery
      v-if="settings.gallery?.length && isComponentDisplayed('gallery', slotIndex)"
      :images="settings.gallery"
    />

    <ProfileDefaultDownloads
      v-if="settings?.downloads?.length && isComponentDisplayed('downloads', slotIndex)"
      :downloads="settings?.downloads || []"
    />

    <ProfileDefaultForm
      v-if="isComponentDisplayed('form', slotIndex)"
      :username="username"
      :contact-phone="settings.company?.phone || ''"
      :form="settings.form"
    />

    <ProfileDefaultFAQ
      v-if="isComponentDisplayed('faq', slotIndex)"
      :username="username"
    />
  </div>
</template>
