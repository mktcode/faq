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
    :id="component.key + '-' + component.id"
    :class="component.key"
  >
    <ProfileMainEditSectionButton
      v-if="$profile.isOwned || $profile.isAdmin"
      @click="$emit('edit', component.id)"
    />

    <div
      class="prose max-w-5xl mx-auto py-24 px-6 transition-all"
      :class="{
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
