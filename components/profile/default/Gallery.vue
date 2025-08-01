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
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
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
      :ui="{
        body: 'mbody overflow-hidden',
      }"
    >
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
          }"
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
