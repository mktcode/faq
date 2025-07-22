<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

defineEmits(['update'])

const showModal = useState('showContentModal', () => false)

const items: AccordionItem[] = [
  {
    label: 'Angebot',
    icon: 'i-heroicons-megaphone',
    slot: 'offer',
  },
  {
    label: 'Häufige Fragen',
    icon: 'i-heroicons-question-mark-circle',
    slot: 'faq',
  },
  {
    label: 'Gallerie',
    icon: 'i-heroicons-photo',
    slot: 'gallery',
  },
  {
    label: 'Externe Verlinkungen',
    icon: 'i-heroicons-link',
    slot: 'links',
  },
  {
    label: 'Downloads',
    icon: 'i-heroicons-arrow-down-tray',
    slot: 'downloads',
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
        <template #gallery>
          <ContentModalGallery />
        </template>
        <template #offer>
          <ContentModalOffer />
        </template>
        <template #links>
          <ContentModalLinks />
        </template>
        <template #downloads>
          <ContentModalDownloads />
        </template>
        <template #faq>
          <ContentModalFAQ />
        </template>
      </UAccordion>
    </template>
  </UModal>
</template>
