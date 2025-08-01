<script setup lang="ts">
const { settings } = await useProfile()
const designRounded = ref(settings.value?.rounded || 'md')
const showModal = ref(false)
</script>

<template>
  <div
    v-if="settings?.gallery?.length"
    class="my-6 w-full"
  >
    <div
      class="grid grid-cols-2 lg:grid-cols-3 gap-2"
    >
      <div
        v-for="(image, index) in settings.gallery"
        :key="index"
        class="overflow-hidden w-full aspect-square flex items-center justify-center cursor-pointer"
        :class="{
          'rounded-xl': designRounded === 'xl',
          'rounded-md': designRounded === 'md',
          'rounded-none': designRounded === 'none',
          'col-span-3 aspect-video': index === 0,
        }"
        @click="showModal = true"
      >
        <NuxtImg
          :src="image.url"
          class="object-cover w-full h-full hover:scale-110 transition-all duration-500"
          preload
        />
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
            :items="settings.gallery"
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
            <div
              v-if="item.title || item.description"
              class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-xl"
            >
              <h3 class="text-lg font-semibold">{{ item.title }}</h3>
              <p class="text-sm">{{ item.description }}</p>
            </div>
          </UCarousel>
        </div>
      </template>
    </UModal>
  </div>
</template>
