<template>
  <div class="flex flex-col gap-2">
    <div class="rounded-xl overflow-hidden w-full aspect-video flex items-center justify-center">
      <img
        src="https://picsum.photos/800/800"
        class="object-cover w-full hover:scale-110 transition-transform duration-500"
      >
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
      <div
        v-for="index in 6"
        :key="index"
        class="rounded-xl overflow-hidden w-full aspect-square flex items-center justify-center"
      >
        <img
          :src="`https://picsum.photos/seed/${index + Math.random()}/400/400`"
          class="object-cover w-full hover:scale-110 transition-transform duration-500"
        >
      </div>
    </div>
  </div>
</template>
