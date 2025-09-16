<script setup lang="ts">
import { moveArrayElement } from '@vueuse/integrations/useSortable'
import type { OfferingComponentSchema } from '~~/types/db'

const component = defineModel('component', {
  type: Object as () => OfferingComponentSchema,
  required: true,
})

function changeOrder(index: number, direction: 'up' | 'down') {
  const from = index
  const to = direction === 'up' ? index - 1 : index + 1

  moveArrayElement(component.value.items, from, to)
}

function removeItem(index: number) {
  component.value.items.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4 w-full">
    <UFormField label="Anordnung der Inhalte">
      <USelect
        v-model="component.layout"
        :items="[
          { label: 'Raster', value: 'grid' },
          { label: 'Liste', value: 'list' },
          { label: 'Karussell', value: 'carousel' },
        ]"
        class="w-full"
      />
    </UFormField>
    <UButton
      icon="i-heroicons-plus"
      variant="soft"
      class="w-full"
      @click="component.items.unshift({ id: Date.now(), title: 'Neuer Inhalt', description: '' })"
    >
      Inhalt hinzufügen
    </UButton>
    <TransitionGroup name="list">
      <ProfileAdminWebsiteOfferingItem
        v-for="(offering, index) in component.items"
        :key="offering.id"
        v-model:offering="component.items[index]!"
        :index="index"
        :items-length="component.items.length"
        @change-order="changeOrder(index, $event)"
        @remove="removeItem(index)"
      />
    </TransitionGroup>
  </div>
</template>
