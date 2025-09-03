<script setup lang="ts">
defineEmits<{
  'open-modal': [index: number]
}>()
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
    <div
      v-for="(image, index) in $profile.settings.public.components.gallery.items.slice(0, 7)"
      :key="index"
      class="overflow-hidden w-full aspect-square flex items-center justify-center cursor-pointer relative"
      :class="{
        'rounded-xl': $profile.settings.public.design.rounded === 'xl',
        'rounded-md': $profile.settings.public.design.rounded === 'md',
        'rounded-none': $profile.settings.public.design.rounded === 'none',
        'col-span-3 aspect-video': index === 0,
      }"
      @click="$emit('open-modal', index)"
    >
      <NuxtImg
        :src="image.url"
        class="object-cover w-full h-full hover:scale-110 transition-all duration-500"
        preload
      />
      <div
        v-if="index === 6 && $profile.settings.public.components.gallery.items.length > 7"
        class="absolute inset-0 flex items-center justify-center bg-black/30 text-white/80 text-3xl font-semibold pointer-events-none"
      >
        +{{ $profile.settings.public.components.gallery.items.length - 7 }}
      </div>
    </div>
  </div>
</template>
