<script setup lang="ts">
const showModal = defineModel('show', {
  default: true,
  type: Boolean,
})

const items = [
  {
    label: 'Allgemein',
    icon: 'i-heroicons-cog-6-tooth',
    slot: 'general',
  },
  {
    label: 'Design',
    icon: 'i-heroicons-paint-brush',
    slot: 'design',
  },
  {
    label: 'Mein Angebot',
    icon: 'i-heroicons-megaphone',
    slot: 'offer',
  },
  {
    label: 'Gallerie',
    icon: 'i-heroicons-photo',
    slot: 'gallery',
  },
  {
    label: 'Google Bewertungen',
    icon: 'i-heroicons-star',
    slot: 'google',
  },
  {
    label: 'Datenschutz',
    icon: 'i-heroicons-shield-check',
    slot: 'privacy',
  },
]
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
    :ui="{
      body: '!p-0',
    }"
  >
    <template #body>
      <UAccordion
        :items="items"
        :unmount-on-hide="false"
        :ui="{
          header: 'px-4 hover:bg-gray-50',
        }"
      >
        <template #general>
          <SettingsModalGeneral />
        </template>
        <template #design>
          <SettingsModalDesign />
        </template>
        <template #gallery>
          <SettingsModalGallery />
        </template>
        <template #offer>
          <SettingsModalOffer />
        </template>
        <template #google>
          <SettingsModalGoogle />
        </template>
        <template #privacy>
          <SettingsModalPrivacy />
        </template>
      </UAccordion>
    </template>
  </UModal>
</template>
