<script setup lang="ts">
import type { Qanda } from '~/types/db'


const { username, settings } = await useProfile()

const { data: qanda } = await useFetch<Qanda[]>(`/api/qanda`, {
  query: {
    username,
  },
})

const qandaAccordionItems = computed(() => {
  return qanda.value?.map(item => ({
    label: item.question,
    content: item.answer,
  })) || []
})
</script>

<template>
  <div
    v-if="qandaAccordionItems.length"
    class="flex flex-col gap-4 w-full mt-6"
  >
    <h3 class="text-2xl font-semibold">
      Häufig gestellte Fragen
    </h3>
    <UAccordion
      :items="qandaAccordionItems"
      :ui="{
        root: 'w-full flex flex-col gap-2',
        header: `bg-primary-500 px-4 !py-0 hover:bg-primary-600 rounded-${settings?.rounded || 'md'}`,
        trigger: 'py-2',
        label: 'text-lg text-primary-50',
        body: 'text-lg text-gray-500 pt-2',
        item: '!border-0',
        trailingIcon: 'text-primary-50',
      }"
    >
      <template #body="{ item }">
        <div
          class="prose"
          v-html="item.content"
        />
      </template>
    </UAccordion>
  </div>
</template>
