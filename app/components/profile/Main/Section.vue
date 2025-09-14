<script setup lang="ts">
import type { ComponentUnionSchema } from '~~/types/db';

defineProps<{
  component: ComponentUnionSchema;
}>()

defineEmits<{
  edit: [componentId: number]
}>()
</script>

<template>
  <div
    class="w-full relative"
    :id="component.key"
  >
    <UButton
      v-if="$profile.isOwned"
      label="Sektion bearbeiten"
      trailing-icon="i-heroicons-pencil"
      variant="soft"
      size="xl"
      class="absolute top-8 -left-44 hover:-left-4 pl-8 transition-all rounded-full z-10"
      @click="$emit('edit', component.id)"
    />

    <div
      class="prose max-w-5xl mx-auto py-24 px-6 transition-all"
      :class="{
        'prose-sm': $profile.settings.public.design.fontSize === 'sm',
        'prose-md': $profile.settings.public.design.fontSize === 'md',
        'prose-lg': $profile.settings.public.design.fontSize === 'lg',
        'prose-xl': $profile.settings.public.design.fontSize === 'xl',
        'prose-2xl': $profile.settings.public.design.fontSize === '2xl',
      }"
    >
      <slot />
    </div>
  </div>
</template>
