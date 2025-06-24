<script setup lang="ts">
async function integrate() {
  await $fetch('/api/user/qanda/integrate', {
    method: 'POST',
  })
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <UButton
      icon="i-heroicons-photo"
      variant="soft"
      color="neutral"
      block
      class="size-20 rounded-full mx-auto"
      @click="integrate"
    />
  </div>
</template>
