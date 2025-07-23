<script setup lang="ts">
const { images } = defineProps<{
  images: {
    url: string
    description?: string | null
    title?: string | null
  }[]
}>()

const showModal = ref(false)

const showImages = ref<number[]>([])

onMounted(() => {
  for (let i = 0; i < images.length; i++) {
    setTimeout(() => {
      showImages.value.push(i)
    }, i * 100)
  }
})

const designRounded = useState('designRounded')
</script>

<template>
  <div class="my-6 w-full">
    <div class="flex flex-col gap-2">
      <div
        class="overflow-hidden w-full aspect-video flex items-center justify-center cursor-pointer"
        :class="{
          'bg-gray-100': !showImages.includes(0),
          'rounded-xl': designRounded === 'xl',
          'rounded-md': designRounded === 'md',
          'rounded-none': designRounded === 'none',
        }"
        @click="showModal = true"
      >
        <NuxtImg
          :src="images[0].url"
          class="object-cover w-full hover:scale-110 transition-all duration-500 opacity-0"
          :class="{ 'opacity-100': showImages.includes(0) }"
          preload
        />
      </div>
      <div
        class="grid grid-cols-2 lg:grid-cols-3 gap-2"
      >
        <div
          v-for="(image, index) in images.slice(1, 7)"
          :key="index"
          class="overflow-hidden w-full aspect-square flex items-center justify-center cursor-pointer"
          :class="{
            'bg-gray-100': !showImages.includes(index + 1),
            'rounded-xl': designRounded === 'xl',
            'rounded-md': designRounded === 'md',
            'rounded-none': designRounded === 'none',
          }"
          @click="showModal = true"
        >
          <NuxtImg
            :src="image.url"
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
              :src="item.url"
              class="rounded-xl max-w-full max-h-full"
            >
          </UCarousel>
        </div>
      </template>
    </UModal>
  </div>
</template>
