<script setup lang="ts">
const { beta = false } = defineProps<{
  beta?: boolean
}>()
</script>

<template>
  <div class="@container flex flex-col gap-[0.2cqw] mx-auto w-full">
    <div class="text-[22cqw] font-bold drop-shadow-lg leading-none text-center">
      Solihost
    </div>
    <div class="relative h-[5cqw]">
      <div class="absolute rounded-l-full bg-gradient-to-r from-sky-600 via-sky-400 via-90% to-transparent h-[5cqw] w-full rotate-1 -left-[1cqw] opacity-50" />
      <div class="absolute rounded-l-full bg-gradient-to-r from-sky-600 via-sky-400 via-90% to-transparent h-[5cqw] w-full -rotate-3 left-[1cqw] opacity-80" />
    </div>
    <div
      v-if="beta"
      class="text-gray-400 text-[5cqw] font-light ml-auto pr-[5cqw]"
    >
      beta
    </div>
  </div>
</template>
