<script setup lang="ts">
import type { ComponentUnionSchema } from '~~/types/db';

defineProps<{
  component: ComponentUnionSchema
}>()

defineEmits<{
  add: []
}>()
</script>

<template>
  <div class="flex flex-col gap-4 border border-gray-200 rounded-2xl p-4">
    <div class="flex-1">
      <div class="font-semibold text-xl mb-2">
        {{ component.title }}
      </div>
      <div class="text-sm text-gray-500">
        {{ component.description }}
      </div>
    </div>
    <div class="flex gap-2 flex-1">
      <div class="border-8 p-12 border-gray-300 rounded-xl aspect-[16/9] w-full flex items-center justify-center text-gray-600">
        <slot name="preview">Vorschau</slot>
      </div>
    </div>
    <div class="text-right">
      <UButton
        label="Hinzufügen"
        icon="i-heroicons-plus"
        @click="$emit('add')"
      />
    </div>
  </div>
</template>