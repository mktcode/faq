<template>
  <div class="flex flex-col gap-4 w-full max-w-lg">
    <!-- Gallery Grid -->
    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="i in 7"
        :key="i"
        class="bg-gray-200 rounded-lg aspect-video flex items-center justify-center"
        :class="i === 1 ? 'col-span-3' : ''"
      >
        <UIcon name="i-heroicons-photo" class="w-8 h-8 text-gray-400" />
      </div>
    </div>
  </div>
</template>
