<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable'

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
const active = ref<string | undefined>(undefined)

useSortable(accordion, items, {
  animation: 150,
  onUpdate: (e: { oldIndex: number; newIndex: number }) => {
    moveArrayElement(items.value, e.oldIndex, e.newIndex, e)
    // nextTick required here as moveArrayElement is executed in a microtask
    // so we need to wait until the next tick until that is finished.
    nextTick(() => {
      console.log('onUpdate', e)
    })
  }
})
</script>

<template>
  <UAccordion
    v-model="active"
    ref="accordion"
    :items="items"
    :unmount-on-hide="false"
    :ui="{
      header: 'px-4 hover:bg-gray-50',
    }"
  >
    <template #trailing="{ open }">
      <div class="ml-auto flex gap-2 items-center">
        <Transition name="fade">
          <UIcon
            v-if="active === undefined"
            name="i-heroicons-arrows-up-down"
            class="text-gray-500 size-5"
          />
        </Transition>
        <UIcon
          name="i-heroicons-chevron-down"
          class="text-gray-500 size-5"
          :class="{
            'rotate-180': open,
          }"
        />
      </div>
    </template>
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

