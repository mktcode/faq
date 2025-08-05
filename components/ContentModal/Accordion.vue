<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const { data: displayedComponents } = await useFetch('/api/user/settings/displayedComponents')

const items = shallowRef<AccordionItem[]>(displayedComponents.value || [])
const active = ref<string | undefined>(undefined)

async function saveOrder() {
  // await $fetch('/api/user/settings/displayedComponents', {
  //   method: 'POST',
  //   body: items.value.map(item => item.slot),
  // })
  console.log('Saving order:', items.value.map(item => item.slot))
}
</script>

<template>
  <UAccordion
    v-model="active"
    :items="items"
    :unmount-on-hide="false"
    :ui="{
      header: 'px-4 hover:bg-gray-50',
    }"
  >
    <template #trailing="{ open }">
      <div class="ml-auto flex items-center">
        <UButton
          variant="ghost"
          size="sm"
          @click.stop="saveOrder"
        >
          <UIcon
            name="i-heroicons-eye"
            class="size-5"
          />
        </UButton>
        <UButton
          variant="ghost"
          size="sm"
          @click.stop="saveOrder"
        >
          <UIcon
            name="i-heroicons-arrow-up"
            class="size-5"
          />
        </UButton>
        <UButton
          variant="ghost"
          size="sm"
          @click.stop="saveOrder"
        >
          <UIcon
            name="i-heroicons-arrow-down"
            class="size-5"
          />
        </UButton>
        <UIcon
          name="i-heroicons-chevron-down"
          class="text-gray-500 size-5 ml-2 transition-transform"
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
