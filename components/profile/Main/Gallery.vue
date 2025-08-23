<script setup lang="ts">
const nuxtApp = useNuxtApp()
const { $profile } = nuxtApp

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
    v-if="$profile.settings.public.components.gallery.items.length"
    class="my-6 w-full"
  >
    <ProfileMainGalleryGrid
      v-if="$profile.settings.public.components.gallery.type === 'grid'"
      @open-modal="openModal"
    />
    <ProfileMainGalleryMasonry
      v-if="$profile.settings.public.components.gallery.type === 'masonry'"
      @open-modal="openModal"
    />
    <UModal
      v-model:open="showModal"
      title="Bilder"
      fullscreen
      :ui="{
        body: 'mbody overflow-hidden',
        header: 'flex gap-4 items-center justify-between p-4',
      }"
      @after:enter="scrollTo"
    >
      <template #header>
        <h2 class="text-lg font-semibold">
          Bilder
        </h2>
        <div class="flex items-center gap-0.5 overflow-x-scroll">
          <img
            v-for="(item, index) in $profile.settings.public.components.gallery.items"
            :key="index"
            :src="item?.url"
            class="size-10 object-cover shrink-0 cursor-pointer transition-all border-2"
            :class="{
              'border-primary': index === carouselIndex,
              'border-transparent opacity-60 hover:opacity-100': index !== carouselIndex,
              'rounded-full': $profile.settings.public.design.rounded === 'xl',
              'rounded-md': $profile.settings.public.design.rounded === 'md',
              'rounded-none': $profile.settings.public.design.rounded === 'none',
            }"
            @click="carouselIndex = index; scrollTo()"
          >
        </div>
        <UButton
          variant="ghost"
          color="neutral"
          class="aspect-square"
          @click="showModal = false"
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
          :items="$profile.settings.public.components.gallery.items"
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
        </UCarousel>
      </template>
    </UModal>
  </div>
</template>
