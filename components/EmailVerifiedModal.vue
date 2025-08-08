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
          E-Mail-Adresse verifiziert
        </h1>
        <p class="text-center text-gray-600">
          Vielen Dank! Sie können nun ein Abonnement abschließen, um Zugriff auf erweiterte Funktionen zu erhalten.
        </p>
        <UButton
          label="Abonnement abschließen"
          trailing-icon="i-heroicons-rocket-launch"
          class="w-full"
          :ui="{
            trailingIcon: 'ml-auto',
          }"
          :loading="isStartingCheckout"
          @click="startCheckoutSession"
        />
        <UButton
          label="Später"
          variant="soft"
          class="w-full"
          @click="isOpen = false"
        />
      </div>
    </template>
  </UModal>
</template>
