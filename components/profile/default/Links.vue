<script setup lang="ts">
defineProps<{
  links: {
    title: string
    url: string
    icon: string
  }[]
}>()
</script>

<template>
  <div class="w-full flex items-center justify-center gap-2 mb-4">
    <UButton
      v-for="(link, index) in links"
      :key="index"
      :label="link.title"
      :icon="link.icon === 'none' ? undefined : link.icon"
      :href="link.url"
      target="_blank"
      variant="soft"
    />
  </div>
</template>
