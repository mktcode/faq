<template>
  <div class="flex flex-col gap-4 w-full max-w-lg">
    <div class="bg-gray-100 border-2 border-gray-300 rounded-lg h-10 w-full" />

    <!-- Name fields -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-gray-100 border-2 border-gray-300 rounded-lg h-10 w-full" />
      <div class="bg-gray-100 border-2 border-gray-300 rounded-lg h-10 w-full" />
    </div>

    <!-- Address fields -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-gray-100 border-2 border-gray-300 rounded-lg h-10 w-full col-span-2" />
      <div class="bg-gray-100 border-2 border-gray-300 rounded-lg h-10 w-full" />
    </div>

    <!-- Select -->
    <div class="bg-gray-100 border-2 border-gray-300 rounded-lg h-10 w-full flex justify-end">
      <UIcon name="i-heroicons-chevron-up-down" class="w-5 h-5 text-gray-400 m-2" />
    </div>

    <!-- Message -->
    <div class="bg-gray-100 border-2 border-gray-300 rounded-lg h-28 w-full" />

    <!-- Submit button -->
    <div class="bg-gray-200 rounded-lg h-10 w-36 ml-auto" />
  </div>
  
</template>
