<script setup lang="ts">
const images = [
  `https://nbg1.your-objectstorage.com/mktcms/1/emma_herbst_logo.webp`,
  `https://nbg1.your-objectstorage.com/mktcms/1/1_1.webp`,
  `https://nbg1.your-objectstorage.com/mktcms/1/2_1.webp`,
  `https://nbg1.your-objectstorage.com/mktcms/1/3_1.webp`,
  `https://nbg1.your-objectstorage.com/mktcms/1/4_1.webp`,
  `https://nbg1.your-objectstorage.com/mktcms/1/2_3.webp`,
  `https://nbg1.your-objectstorage.com/mktcms/1/3_2.webp`,
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
      class="rounded-xl overflow-hidden w-full aspect-video flex items-center justify-center cursor-pointer"
      :class="{ 'bg-gray-100': !showImages.includes(0) }"
      @click="showModal = true"
    >
      <NuxtImg
        :src="images[0]"
        class="object-cover w-full hover:scale-110 transition-all duration-500 opacity-0"
        :class="{ 'opacity-100': showImages.includes(0) }"
        preload
      />
    </div>
    <div
      class="grid grid-cols-2 lg:grid-cols-3 gap-2"
    >
      <div
        v-for="(src, index) in images.slice(1, 7)"
        :key="index"
        class="rounded-xl overflow-hidden w-full aspect-square flex items-center justify-center cursor-pointer"
        :class="{ 'bg-gray-100': !showImages.includes(index + 1) }"
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
