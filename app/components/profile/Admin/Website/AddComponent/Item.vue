<script setup lang="ts">
import type { AvailableComponent } from '~~/types/db';

defineProps<{
  component: AvailableComponent
}>()

defineEmits<{
  add: []
}>()
</script>

<template>
  <div class="flex flex-col">
    <div class="border-[16px] border-b-0 p-4 border-gray-100 rounded-xl rounded-b-none aspect-[16/9] w-full flex items-start justify-center text-gray-600 overflow-hidden">
      <slot name="preview">Vorschau</slot>
    </div>
    <div class="bg-gray-100 rounded-b-xl flex flex-col gap-4 p-4 flex-1">
      <div class="flex flex-col">
        <div class="font-semibold text-xl">
          {{ component.title }}
        </div>
        <div class="text-sm text-gray-500">
          {{ component.description }}
        </div>
      </div>
      <UButton
        label="Hinzufügen"
        icon="i-heroicons-plus"
        class="mt-auto"
        block
        @click="$emit('add')"
      />
    </div>
  </div>
</template>