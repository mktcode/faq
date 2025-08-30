<script setup lang="ts">
import { toHslString } from "~/shared/color"

const { lastUsedColors } = useLastUsedColors();

defineEmits<{
  (e: 'colorSelected', color: { h: number; s: number; l: number }): void
}>()
</script>

<template>
  <div class="grid grid-cols-5 gap-1.5 border-t border-gray-200 p-2 pt-2 mt-2">
    <TransitionGroup name="list">
      <div
        v-for="color in lastUsedColors"
        :key="toHslString(color)"
        :style="{ backgroundColor: toHslString(color) }"
        class="w-full aspect-square rounded-lg cursor-pointer transition-all ring-2 ring-gray-100 hover:ring-gray-300"
        @click="$emit('colorSelected', color)"
      />
    </TransitionGroup>
  </div>
</template>