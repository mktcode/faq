<script setup lang="ts">
import type { FormComponentSchema, Qanda } from '~~/types/db'

const nuxtApp = useNuxtApp()
const { $profile } = nuxtApp

const { data: qanda } = await useFetch<Qanda[]>(`/api/qanda`, {
  query: {
    username: $profile.username,
  },
})

const qandaAccordionItems = computed(() => {
  return qanda.value?.map(item => ({
    label: item.question,
    content: item.answer,
  })) || []
})

defineProps<{
  component: FormComponentSchema;
}>()

defineEmits<{
  edit: [componentId: number]
}>()
</script>

<template>
  <div class="w-full relative">
    <UButton
      v-if="$profile.isOwned"
      label="Sektion bearbeiten"
      trailing-icon="i-heroicons-pencil-square"
      variant="outline"
      size="xl"
      class="absolute top-4 -left-44 hover:-left-4 pl-5 transition-all rounded-full z-10"
      @click="$emit('edit', component.id)"
    />

    <div class="max-w-5xl mx-auto py-24 px-6">
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
            header: `bg-primary-500 px-4 !py-0 hover:bg-primary-600 rounded-${$profile.settings.public.design.rounded}`,
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
    </div>
  </div>
</template>
