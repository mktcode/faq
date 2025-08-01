<script setup lang="ts">
const { settings } = await useProfile()
const designRounded = ref(settings.value?.rounded || 'md')
const showModal = ref(false)
const carousel = useTemplateRef('carousel')
const carouselIndex = ref(0)

function openModal(index: number) {
  carouselIndex.value = index
  showModal.value = true
}

function scrollTo() {
  carousel.value?.emblaApi?.scrollTo(carouselIndex.value)
}
</script>

<template>
  <div
    v-if="settings?.gallery?.length"
    class="my-6 w-full"
  >
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
      <div
        v-for="(image, index) in settings.gallery.slice(0, 7)"
        :key="index"
        class="overflow-hidden w-full aspect-square flex items-center justify-center cursor-pointer relative"
        :class="{
          'rounded-xl': designRounded === 'xl',
          'rounded-md': designRounded === 'md',
          'rounded-none': designRounded === 'none',
          'col-span-3 aspect-video': index === 0,
        }"
        @click="openModal(index)"
      >
        <NuxtImg
          :src="image.url"
          class="object-cover w-full h-full hover:scale-110 transition-all duration-500"
          preload
        />
        <div
          v-if="index === 6 && settings.gallery.length > 7"
          class="absolute inset-0 flex items-center justify-center bg-black/30 text-white/80 text-3xl font-semibold pointer-events-none"
        >
          +{{ settings.gallery.length - 7 }}
        </div>
      </div>
    </div>
    <UModal
      title="Bilder"
      v-model:open="showModal"
      @after:enter="scrollTo"
      fullscreen
      :ui="{
        body: 'mbody overflow-hidden',
        header: 'flex gap-4 items-center justify-between p-4',
      }"
    >
      <template #header>
        <h2 class="text-lg font-semibold">Bilder</h2>
        <div class="flex items-center gap-0.5 overflow-x-scroll">
          <img
            v-for="(item, index) in settings?.gallery"
            :src="item?.url"
            class="size-10 object-cover shrink-0 cursor-pointer transition-all border-2"
            :class="{
              'border-primary': index === carouselIndex,
              'border-transparent opacity-60 hover:opacity-100': index !== carouselIndex,
              'rounded-full': designRounded === 'xl',
              'rounded-md': designRounded === 'md',
              'rounded-none': designRounded === 'none',
            }"
            @click="carouselIndex = index; scrollTo()"
          />
        </div>
        <UButton
          @click="showModal = false"
          variant="ghost"
          color="neutral"
          class="aspect-square"
        >
          <UIcon
            name="i-lucide-x"
            class="size-5"
          />
        </UButton>
      </template>

      <template #body>
        <UCarousel
          ref="carousel"
          v-slot="{ item }"
          :items="settings.gallery"
          :ui="{
            root: 'h-full',
            viewport: 'h-full',
            container: 'h-full',
            item: 'h-full flex flex-col items-center justify-center',
            controls: 'absolute z-50 -top-16 left-1/2 w-[80vw] -translate-x-1/2',
          }"
          @select="carouselIndex = $event"
        >
          <div class="flex-1 w-full relative">
            <div class="inset-0 absolute flex items-center justify-center">
              <img
                :src="item.url"
                class="rounded-xl w-fit h-full object-contain"
              >
            </div>
          </div>
          <div class="shrink p-4 max-w-3xl">
            <h3
              v-if="item.title"
              class="text-lg font-semibold"
            >
              {{ item.title }}
            </h3>
            <p
              v-if="item.description"
              class="text-sm"
            >
              {{ item.description }}
            </p>
          </div>
          <!-- <div class="grow">
            <img
              :src="item.url"
              class="rounded-xl h-full"
            >
          </div>
          <div
            v-if="item.title || item.description"
            class="p-4 flex flex-col gap-1 grow"
          >
            <h3
              v-if="item.title"
              class="text-lg font-semibold"
            >
              {{ item.title }}
            </h3>
            <p
              v-if="item.description"
              class="text-sm"
            >
              {{ item.description }}
            </p>
          </div> -->
        </UCarousel>
      </template>
    </UModal>
  </div>
</template>
