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
  <div class="columns-2 lg:columns-3 gap-x-2">
    <div
      v-for="(image, index) in component.items.slice(0, 7)"
      :key="index"
      class="relative mb-2 w-full overflow-hidden break-inside-avoid cursor-pointer"
      :class="{
        'rounded-xl': $profile.settings.public.design.rounded === 'xl',
        'rounded-md': $profile.settings.public.design.rounded === 'md',
        'rounded-none': $profile.settings.public.design.rounded === 'none',
      }"
      @click="$emit('open-modal', index)"
    >
      <NuxtImg
        :src="image.url"
        class="w-full h-auto transition-transform duration-500 hover:scale-[1.02]"
        preload
      />
      <div
        v-if="index === 6 && component.items.length > 7"
        class="absolute inset-0 flex items-center justify-center bg-black/30 text-white/80 text-3xl font-semibold pointer-events-none"
      >
        +{{ component.items.length - 7 }}
      </div>
    </div>
  </div>
</template>
