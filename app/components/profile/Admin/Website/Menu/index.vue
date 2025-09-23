<script setup lang="ts">
import { moveArrayElement } from '@vueuse/integrations/useSortable'
import type { MenuComponentSchema } from '~~/types/db'

const component = defineModel('component', {
  type: Object as () => MenuComponentSchema,
  required: true,
})

function changeOrder(index: number, direction: 'up' | 'down') {
  const from = index
  const to = direction === 'up' ? index - 1 : index + 1

  moveArrayElement(component.value.items, from, to)
}
</script>

<template>
  <div class="flex flex-col w-full relative">
    <TransitionGroup name="list">
      <ProfileAdminWebsiteMenuItem
        v-for="(item, index) in component.items"
        :key="item.id"
        :is-first="index === 0"
        :is-last="index === (component.items.length - 1)"
        v-model:item="component.items[index]!"
        @change-order="changeOrder(index, $event)"
        @delete="component.items.splice(index, 1)"
      />
    </TransitionGroup>
    <UButton
      label="Menüpunkt hinzufügen"
      class="w-full rounded-none p-4 border-b border-primary-200"
      variant="soft"
      trailing-icon="i-heroicons-plus"
      :ui="{
        trailingIcon: 'ml-auto opacity-30',
      }"
      @click="component.items.push({
        id: Date.now(),
        title: 'Neuer Menüpunkt',
        url: '/',
        openInNewTab: false,
        position: 'left',
      })"
    />
  </div>
</template>