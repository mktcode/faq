<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
    <div v-for="i in 6" :key="i" class="flex flex-col gap-3">
      <!-- Headline -->
      <div class="bg-gray-200 rounded-lg h-8 w-3/4" />

      <!-- Image -->
      <div class="bg-gray-200 rounded-lg w-full aspect-[16/6] flex items-center justify-center">
        <UIcon name="i-heroicons-photo" class="w-12 h-12 text-gray-400" />
      </div>

      <!-- Text -->
      <div class="space-y-2">
        <div class="bg-gray-200 rounded-lg h-4 w-full" />
        <div class="bg-gray-200 rounded-lg h-4 w-11/12" />
        <div class="bg-gray-200 rounded-lg h-4 w-3/4" />
      </div>

      <!-- Button -->
      <div class="bg-gray-200 rounded-lg h-9 w-32" />
    </div>
  </div>
</template>