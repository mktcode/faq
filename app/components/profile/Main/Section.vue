<script setup lang="ts">
defineProps<{
  componentId: number;
}>()

defineEmits<{
  edit: [componentId: number]
}>()
</script>

<template>
  <div class="w-full relative">
    <UButton
      v-if="$profile.isOwned"
      label="Sektion bearbeiten"
      trailing-icon="i-heroicons-pencil"
      variant="soft"
      size="xl"
      class="absolute top-8 -left-48 hover:-left-4 pl-8 transition-all rounded-full z-10"
      @click="$emit('edit', componentId)"
    />

    <div class="max-w-5xl mx-auto py-24 px-6">
      <slot />
    </div>
  </div>
</template>
