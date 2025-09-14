<script setup lang="ts">
import type { MenuComponentSchema } from '~~/types/db'

const component = defineModel('component', {
  type: Object as () => MenuComponentSchema,
  required: true,
})
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <div
      class="flex gap-2"
      v-for="(item, index) in component.items"
    >
      <UFormField
        label="Menüpunkt Beschriftung"
      >
        <UInput
          v-model="item.title"
          size="xl"
        />
      </UFormField>
    </div>
    <UButton
      label="Menüpunkt hinzufügen"
      variant="outline"
      size="md"
      class="w-full"
      @click="component.items.push({ title: '', url: '', openInNewTab: false })"
    />
  </div>
</template>
