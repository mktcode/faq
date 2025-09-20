<script setup lang="ts">
import type { GalleryComponentSchema } from '~~/types/db';

defineProps<{
  component: GalleryComponentSchema;
}>()

defineEmits<{
  edit: [componentId: number]
}>()

const showModal = ref(false)
const startIndex = ref(0)

function openModal(index: number) {
  startIndex.value = index
  showModal.value = true
}

</script>

<template>
  <ProfileMainSection
    :component="component"
    @edit="$emit('edit', $event)"
  >
    <ProfileMainComponentHeader :component="component" />
    <div
      v-if="component.items.length"
      class="w-full"
    >
      <ProfileMainGalleryGrid
        v-if="component.type === 'grid'"
        @open-modal="openModal"
        :component="component"
      />
      <ProfileMainGalleryGridWithHeader
        v-if="component.type === 'grid-with-header'"
        @open-modal="openModal"
        :component="component"
      />
      <ProfileMainGalleryMasonry
        v-if="component.type === 'masonry'"
        @open-modal="openModal"
        :component="component"
      />
      <ProfileMainGalleryModal
        v-model:open="showModal"
        :start-index="startIndex"
        :component="component"
      />
    </div>
  </ProfileMainSection>
</template>
