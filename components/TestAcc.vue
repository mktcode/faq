<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import { useSortable } from '@vueuse/integrations/useSortable'

const items = shallowRef<AccordionItem[]>([
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
])

const accordion = useTemplateRef<HTMLElement>('accordion')

useSortable(accordion, items, {
  animation: 150
})
</script>

<template>
  <UAccordion
    ref="accordion"
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

