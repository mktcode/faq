<script setup lang="ts">
const updateProfileInterval = ref<NodeJS.Timeout | null>(null)
const { updateProfile } = useProfile()

onMounted(() => {
  updateProfileInterval.value = setInterval(async () => {
    await updateProfile()
  }, 5000)
})

onBeforeUnmount(() => {
  if (updateProfileInterval.value) {
    clearInterval(updateProfileInterval.value)
  }
})
</script>

<template>
  <p class="text-gray-600">
    Sie befinden sich gerade im Zahlungsprozess. Schließen Sie Ihre Zahlung bitte ab.
  </p>
  <UButton
    label="Zahlung fortsetzen"
    trailing-icon="i-heroicons-arrow-right"
    :ui="{
      trailingIcon: 'ml-auto',
    }"
  />
  <UButton
    label="Vorgang abbrechen"
    icon="i-heroicons-x-mark"
    variant="soft"
  />
</template>