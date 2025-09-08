<template>
  <div class="space-y-4 w-full">
    <!-- Headline -->
    <div class="bg-gray-200 rounded-lg h-7 w-1/2" />

    <!-- Download items -->
    <div class="space-y-3">
      <div v-for="i in 4" :key="i" class="flex items-center gap-3">
        <div class="bg-gray-200 rounded-lg w-10 h-10 flex items-center justify-center">
          <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-gray-400" />
        </div>
        <div class="flex-1 space-y-2">
          <div class="bg-gray-200 rounded-lg h-4 w-3/4" />
          <div class="bg-gray-200 rounded-lg h-3 w-1/2" />
        </div>
        <div class="bg-gray-200 rounded-lg h-8 w-24" />
      </div>
    </div>
  </div>
</template>
