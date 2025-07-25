<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable'

const emit = defineEmits(['update'])

const toast = useToast()

const { data: displayedComponents } = await useFetch('/api/user/settings/displayedComponents')

const items = shallowRef<AccordionItem[]>(displayedComponents.value || [])
const accordion = useTemplateRef<HTMLElement>('accordion')
const active = ref<string | undefined>(undefined)

useSortable(accordion, items, {
  animation: 150,
  onUpdate: (e: { oldIndex: number, newIndex: number }) => {
    moveArrayElement(items, e.oldIndex, e.newIndex, e)
    // nextTick required here as moveArrayElement is executed in a microtask
    // so we need to wait until the next tick until that is finished.
    nextTick(async () => {
      await $fetch('/api/user/settings/displayedComponents', {
        method: 'POST',
        body: items.value.map(item => item.slot),
      })
      toast.add({
        title: 'Reihenfolge aktualisiert',
        color: 'success',
      })
      emit('update')
    })
  },
})
</script>

<template>
  <UAccordion
    ref="accordion"
    v-model="active"
    :items="items"
    :unmount-on-hide="false"
    :ui="{
      header: 'px-4 hover:bg-gray-50',
    }"
  >
    <template #trailing="{ open }">
      <div class="ml-auto flex gap-2 items-center">
        <UIcon
          name="i-heroicons-eye"
          class="text-gray-500 size-5"
        />
        <UIcon
          name="i-heroicons-arrows-up-down"
          class="text-gray-500 size-5"
        />
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
    <template #form>
      <ContentModalForm />
    </template>
    <template #downloads>
      <ContentModalDownloads />
    </template>
    <template #faq>
      <ContentModalFAQ />
    </template>
  </UAccordion>
</template>
