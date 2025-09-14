<script setup lang="ts">
import type { GalleryComponentSchema } from '~~/types/db';

defineEmits<{
  'open-modal': [index: number]
}>()

defineProps<{
  component: GalleryComponentSchema;
}>()
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
    <div
      v-for="(image, index) in component.items.slice(0, 7)"
      :key="index"
      class="overflow-hidden w-full flex items-center justify-center cursor-pointer relative"
      :class="{
        'rounded-xl': $profile.settings.public.design.rounded === 'xl',
        'rounded-md': $profile.settings.public.design.rounded === 'md',
        'rounded-none': $profile.settings.public.design.rounded === 'none',
        'col-span-2 lg:col-span-3 aspect-video': index === 0,
        'aspect-square': index !== 0,
      }"
      @click="$emit('open-modal', index)"
    >
      <NuxtImg
        :src="image.url"
        class="object-cover w-full h-full hover:scale-110 transition-all duration-500"
        preload
      />
      <div
        v-if="index === 6 && component.items.length > 7"
        class="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-5xl font-semibold pointer-events-none"
      >
        +{{ component.items.length - 7 }}
      </div>
    </div>
  </div>
</template>
