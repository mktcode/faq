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
    <div class="flex flex-col gap-2">
      <div
        class="overflow-hidden w-full aspect-video flex items-center justify-center cursor-pointer"
        :class="{
          'rounded-xl': designRounded === 'xl',
          'rounded-md': designRounded === 'md',
          'rounded-none': designRounded === 'none',
        }"
        @click="showModal = true"
      >
        <NuxtImg
          :src="settings.gallery[0].url"
          class="object-cover w-full hover:scale-110 transition-all duration-500"
          preload
        />
      </div>
      <div
        class="grid grid-cols-2 lg:grid-cols-3 gap-2"
      >
        <div
          v-for="(image, index) in settings.gallery.slice(1, 7)"
          :key="index"
          class="overflow-hidden w-full aspect-square flex items-center justify-center cursor-pointer"
          :class="{
            'rounded-xl': designRounded === 'xl',
            'rounded-md': designRounded === 'md',
            'rounded-none': designRounded === 'none',
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
          </UCarousel>
        </div>
      </template>
    </UModal>
  </div>
</template>
