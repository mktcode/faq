<script setup lang="ts">
const isOpen = ref(true)
const { isStartingCheckout, startCheckoutSession } = useCheckoutSession()
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold text-center">
          E-Mail verifiziert
        </h1>
        <p class="text-center text-gray-600">
          Deine E-Mail-Adresse wurde erfolgreich verifiziert. Vielen Dank!
        </p>
        <p class="text-center text-gray-600">
          Du kannst nun ein Abonnement abschließen, um Zugriff auf erweiterte Funktionen zu erhalten.
        </p>
        <UButton
          label="Plus abonnieren"
          trailing-icon="i-heroicons-rocket-launch"
          class="w-full"
          :ui="{
            trailingIcon: 'ml-auto',
          }"
          :loading="isStartingCheckout"
          @click="startCheckoutSession"
        />
        <UButton
          label="Nein, danke."
          variant="soft"
          class="w-full"
          @click="isOpen = false"
        />
      </div>
    </template>
  </UModal>
</template>
