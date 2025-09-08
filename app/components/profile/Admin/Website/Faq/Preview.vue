<template>
  <div class="space-y-4 w-full">
    <!-- Headline -->
    <div class="bg-gray-200 rounded-lg h-7 w-1/3" />

    <!-- FAQ items -->
    <div class="space-y-3">
      <div v-for="i in 5" :key="i" class="space-y-2">
        <!-- Question row -->
        <div class="flex items-center gap-3">
          <div class="bg-gray-200 rounded-lg h-5 w-5" />
          <div class="bg-gray-200 rounded-lg h-5 flex-1" />
        </div>
        <!-- Answer preview -->
        <div class="pl-8 space-y-2">
          <div class="bg-gray-200 rounded-lg h-4 w-11/12" />
          <div class="bg-gray-200 rounded-lg h-4 w-2/3" />
        </div>
      </div>
    </div>
  </div>
</template>
