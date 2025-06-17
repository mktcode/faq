<script setup lang="ts">
const images = [
  `https://picsum.photos/seed/1/1920/1080`,
  `https://picsum.photos/seed/2/1080/1920`,
  `https://picsum.photos/seed/3/800/600`,
  `https://picsum.photos/seed/4/1000/1000`,
  `https://picsum.photos/seed/5/600/800`,
  `https://picsum.photos/seed/6/800/400`,
  `https://picsum.photos/seed/7/400/600`,
]

const showModal = ref(false)

const loadedImages = ref<Record<number, boolean>>({})

const handleImageLoaded = (index: number) => {
  loadedImages.value[index] = true
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      class="rounded-xl overflow-hidden w-full aspect-video flex items-center justify-center cursor-pointer"
      @click="showModal = true"
    >
      <img
        :src="images[0]"
        class="object-cover w-full hover:scale-110 transition-all duration-500 opacity-0"
        :class="{ 'opacity-100': loadedImages[0] }"
        @load="handleImageLoaded(0)"
      >
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
      <div
        v-for="(src, index) in images.slice(1, 7)"
        :key="index"
        class="rounded-xl overflow-hidden w-full aspect-square flex items-center justify-center cursor-pointer"
        @click="showModal = true"
      >
        <img
          :src="src"
          class="object-cover w-full h-full hover:scale-110 transition-all duration-500 opacity-0"
          :class="{ 'opacity-100': loadedImages[index + 1] }"
          @load="handleImageLoaded(index + 1)"
        >
      </div>
    </div>
  </div>
  <UModal
    v-model:open="showModal"
    fullscreen
  >
    <template #body>
      <div class="h-full w-full pb-12 px-12">
        <UCarousel
          v-slot="{ item }"
          class-names
          arrows
          dots
          :items="images"
          :ui="{
            root: 'h-full [&_>_div:first-child]:h-full',
            container: 'h-full',
            item: 'h-full flex items-center justify-center',
          }"
        >
          <img
            :src="item"
            class="rounded-xl max-w-full max-h-full"
          >
        </UCarousel>
      </div>
    </template>
  </UModal>
</template>
