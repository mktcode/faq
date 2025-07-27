<script setup lang="ts">
const isOpen = ref(true)

const router = useRouter()
const route = useRoute()

function removeQueryParam() {
  const newQuery = { ...route.query }
  if (!newQuery['subscriptionSuccess']) return
  delete newQuery['subscriptionSuccess']
  router.replace({ query: newQuery })
}

watch(isOpen, (newValue) => {
  if (!newValue) {
    removeQueryParam()
  }
})
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold text-center">
          Abonnement freigeschaltet!
        </h1>
        <p class="text-center text-gray-600">
          Sie haben nun Zugriff auf alle erweiterten Funktionen.
        </p>
        <UButton
          label="Alles klar!"
          class="ml-auto"
          @click="isOpen = false"
        />
      </div>
    </template>
  </UModal>
</template>
