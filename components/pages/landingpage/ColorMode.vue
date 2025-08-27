<script setup lang="ts">
const { colorMode } = useColorMode()
</script>

<template>
  <div :class="[{ dark: colorMode === 'dark' }]">
    <slot />
  </div>
</template>