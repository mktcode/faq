<script setup lang="ts">
const images = [
  `https://picsum.photos/1920/1080`,
  `https://picsum.photos/1080/1920`,
  `https://picsum.photos/800/600`,
  `https://picsum.photos/1000/1000`,
  `https://picsum.photos/600/800`,
  `https://picsum.photos/800/400`,
  `https://picsum.photos/400/600`,
]

const showModal = ref(false)

const showImages = ref<number[]>([])

onMounted(() => {
  for (let i = 0; i < images.length; i++) {
    setTimeout(() => {
      showImages.value.push(i)
    }, i * 100)
  }
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      class="rounded-xl overflow-hidden w-full aspect-video flex items-center justify-center cursor-pointer bg-gray-100"
      @click="showModal = true"
    >
      <NuxtImg
        :src="images[0]"
        class="object-cover w-full hover:scale-110 transition-all duration-500 opacity-0"
        :class="{ 'opacity-100': showImages.includes(0) }"
        preload
      />
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
      <div
        v-for="(src, index) in images.slice(1, 7)"
        :key="index"
        class="rounded-xl overflow-hidden w-full aspect-square flex items-center justify-center cursor-pointer bg-gray-100"
        @click="showModal = true"
      >
        <NuxtImg
          :src="src"
          class="object-cover w-full h-full hover:scale-110 transition-all duration-500 opacity-0"
          :class="{ 'opacity-100': showImages.includes(index + 1) }"
          preload
        />
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
