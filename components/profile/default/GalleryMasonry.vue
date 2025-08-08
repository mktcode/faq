<script setup lang="ts">
const { settings, designRounded } = await useProfile()

defineEmits<{
  (e: 'open-modal', index: number): void
}>()
</script>

<template>
  <div class="columns-2 lg:columns-3 gap-x-2">
    <div
      v-for="(image, index) in settings.components.gallery.items.slice(0, 7)"
      :key="index"
      class="relative mb-2 w-full overflow-hidden break-inside-avoid cursor-pointer"
      :class="{
        'rounded-xl': designRounded === 'xl',
        'rounded-md': designRounded === 'md',
        'rounded-none': designRounded === 'none',
      }"
      @click="$emit('open-modal', index)"
    >
      <NuxtImg
        :src="image.url"
        class="w-full h-auto transition-transform duration-500 hover:scale-[1.02]"
        preload
      />
      <div
        v-if="index === 6 && settings.components.gallery.items.length > 7"
        class="absolute inset-0 flex items-center justify-center bg-black/30 text-white/80 text-3xl font-semibold pointer-events-none"
      >
        +{{ settings.components.gallery.items.length - 7 }}
      </div>
    </div>
  </div>
</template>
