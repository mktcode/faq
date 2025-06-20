<script setup lang="ts">
definePageMeta({
  validate: async (route) => {
    return (
      typeof route.params.username === 'string' && /^\w+$/.test(route.params.username)
    )
  },
})

const route = useRoute()
const username = computed(() => Array.isArray(route.params.username) ? route.params.username[0] : route.params.username)
</script>

<template>
  <AskMain :username="username" />
</template>
