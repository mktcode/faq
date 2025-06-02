<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const toast = useToast()

const userId = ref<number>(0)
const topupAmount = ref<number>(0)

async function createTopup() {
  if (userId.value === 0) {
    return
  }

  await $fetch('/api/admin/topup', {
    method: 'POST',
    body: {
      userId: userId.value,
      amount: topupAmount.value,
    },
  })

  toast.add({
    title: 'Erfolg.',
    description: 'Zahlung wurde erstellt.',
    color: 'success',
  })
}
</script>

<template>
  <NuxtLayout name="default">
    <h3>Neue Zahlung für</h3>
    <div class="flex flex-col gap-4">
      <div>
        <label for="userId">Benutzer ID</label>
        <UInputNumber
          v-model="userId"
        />
      </div>
      <UInputNumber
        v-model="topupAmount"
        :min="0"
        :step="0.1"
      />
    </div>
    <UButton
      class="mt-4"
      :disabled="userId === 0"
      @click="createTopup"
    >
      Zahlung erstellen
    </UButton>
  </NuxtLayout>
</template>
