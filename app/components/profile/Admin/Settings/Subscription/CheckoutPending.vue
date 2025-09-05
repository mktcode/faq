<script setup lang="ts">
const updateProfileInterval = ref<NodeJS.Timeout | null>(null)
const { updateProfile } = useProfile()

defineProps<{
  url: string
}>()

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
  <div class="p-4 flex flex-col gap-2">
    <p class="text-gray-600">
      Sie befinden sich gerade im Zahlungsprozess. Schließen Sie Ihre Zahlung bitte ab.
    </p>
    <UButton
      label="Zahlung fortsetzen"
      trailing-icon="i-heroicons-arrow-right"
      :ui="{
        trailingIcon: 'ml-auto',
      }"
      :to="url"
      target="_blank"
    />
    <UButton
      label="Vorgang abbrechen"
      icon="i-heroicons-x-mark"
      variant="soft"
    />
  </div>
</template>
