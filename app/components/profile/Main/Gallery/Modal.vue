<script setup lang="ts">
import type { GalleryComponentSchema } from '~~/types/db';

const open = defineModel('open', {
  type: Boolean,
  required: true,
})

const { startIndex } = defineProps<{
  component: GalleryComponentSchema;
  startIndex: number;
}>()

const carousel = useTemplateRef('carousel')
const activeIndex = ref(startIndex)

function onSelect(index: number) {
  activeIndex.value = index
}

function select(index: number) {
  activeIndex.value = index

  carousel.value?.emblaApi?.scrollTo(index)
}
</script>

<template>
  <UModal
    v-model:open="open"
    fullscreen
    :ui="{
      body: 'mbody overflow-hidden',
      header: 'flex gap-4 items-center justify-between p-4',
    }"
    @after:enter=""
  >
    <template #header>
      <h2 class="text-lg font-semibold">
        {{ component.title }}
      </h2>
      <div class="flex items-center gap-0.5 overflow-x-scroll">
        <img
          v-for="(item, index) in component.items"
          :key="index"
          :src="item?.url"
          class="size-10 object-cover shrink-0 cursor-pointer transition-all border-2"
          :class="{
            'border-primary': index === activeIndex,
            'border-transparent opacity-60 hover:opacity-100': index !== activeIndex,
            'rounded-full': $profile.settings.public.design.rounded === 'xl',
            'rounded-md': $profile.settings.public.design.rounded === 'md',
            'rounded-none': $profile.settings.public.design.rounded === 'none',
          }"
          @click="select(index)"
        >
      </div>
      <UButton
        variant="ghost"
        color="neutral"
        class="aspect-square"
        @click="open = false"
      >
        <UIcon
          name="i-lucide-x"
          class="size-5"
        />
      </UButton>
    </template>

    <template #body>
      <UCarousel
        :start-index="startIndex"
        ref="carousel"
        v-slot="{ item }"
        :items="component.items"
        :ui="{
          root: 'h-full',
          viewport: 'h-full',
          container: 'h-full',
          item: 'h-full flex flex-col items-center justify-center',
          controls: 'absolute z-50 -top-16 left-1/2 w-[80vw] -translate-x-1/2',
        }"
        @select="onSelect"
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
</template>
