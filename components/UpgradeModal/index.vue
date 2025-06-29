<script setup lang="ts">
const showModal = useState('showUpgradeModal', () => false)
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
    :ui="{
      content: 'max-w-3xl',
    }"
  >
    <template #body>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold">
          Der nächste Schritt
        </h2>
        <UButton
          icon="i-heroicons-x-mark"
          variant="ghost"
          class="opacity-50 hover:opacity-100"
          @click="showModal = false"
        />
      </div>
      <p class="text-gray-500 mb-4">
        Mit einem Premium-Design wird Ihr Gewerbeprofil zur individuellen Website.
        Wir besprechen Ihre Farben, Schriftarten und zusätzliche Inhalte und gestalten ein Design, das auf Ihr Unternehmen zugeschnitten ist.
      </p>
      <p class="text-gray-900 font-bold text-3xl mb-8">
        ab 500 €
      </p>
      <h3 class="text-lg font-semibold mb-4">
        Haben Sie schon eine konkrete Vorstellung?
      </h3>
      <p class="text-gray-500">
        Füllen Sie Ihr Gewerbeprofil so gut es geht aus. Darüber hinaus können Sie uns hier gerne Ihre Wünsche und Ideen mitteilen.
      </p>
      <UTextarea
        placeholder="Geben Sie hier Ihre Wünsche und Ideen ein..."
        class="w-full mt-4"
      />
      <div class="pt-4 mt-auto flex items-center justify-between">
        <UButton
          label="Anfrage senden"
          class="ml-auto"
        />
      </div>
    </template>
  </UModal>
</template>
