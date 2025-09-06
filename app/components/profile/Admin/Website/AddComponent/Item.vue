<script setup lang="ts">
import type { SettingsForm } from '~~/types/db';

defineProps<{
  component: SettingsForm['public']['components'][0]
}>()

defineEmits<{
  add: [component: SettingsForm['public']['components'][0]];
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
      <div class="bg-gray-300 rounded-xl aspect-[16/10] w-3/4 flex items-center justify-center text-gray-600">
        desktop
      </div>
      <div class="bg-gray-300 rounded-xl w-1/4 flex items-center justify-center text-gray-600">
        mobile
      </div>
    </div>
    <div class="text-right">
      <UButton
        label="Hinzufügen"
        icon="i-heroicons-plus"
        @click="$emit('add', {
          key: 'offerings',
          title: component.title,
          description: component.description,
          items: [],
          layout: 'grid',
          order: 1,
          visible: true,
        })"
      />
    </div>
  </div>
</template>