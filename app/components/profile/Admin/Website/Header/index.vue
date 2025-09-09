<script setup lang="ts">
import type { HeaderComponentSchema } from '~~/types/db'

const component = defineModel('component', {
  type: Object as () => HeaderComponentSchema,
  required: true,
})
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <UFormField
      label="Variante"
    >
      <USelect
        v-model="component.height"
        :items="[
          { label: 'Vollbild', value: 'full' },
          { label: 'halber Bildschirm', value: 'half' },
          { label: 'automatische Höhe', value: 'auto' },
          { label: 'Box', value: 'boxed' },
        ]"
        class="w-full"
      />
    </UFormField>
  </div>
</template>
