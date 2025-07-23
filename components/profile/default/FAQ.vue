<script setup lang="ts">
import type { Qanda } from '~/types/db'

const { username } = defineProps<{
  username: string
}>()

const { data: currentSettings } = await useFetch(`/api/settings`, {
  query: {
    username,
  },
})

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

const designRounded = useState('designRounded', () => currentSettings.value?.rounded || 'md')
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
        header: `bg-primary-50 px-4 !py-0 hover:bg-primary-100 rounded-${designRounded}`,
        trigger: 'py-2',
        label: 'text-lg text-primary-950',
        body: 'text-lg text-gray-500 pt-2',
        item: '!border-0',
        trailingIcon: 'text-primary-500',
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
