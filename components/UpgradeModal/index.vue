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
          Ihr Firmendesign
        </h2>
        <UButton
          icon="i-heroicons-x-mark"
          variant="ghost"
          class="opacity-50 hover:opacity-100"
          @click="showModal = false"
        />
      </div>
      <p class="text-gray-500 mb-8">
        Mit einem individuellen Premium-Design steht Ihr Gewerbeprofil einer richtigen Website in nichts nach.
        Wir besprechen Ihre Farben, Schriftarten und zusätzliche Inhalte und gestalten  ein Webdesign, das zu Ihrem Unternehmen passt.
      </p>
      <div class="flex flex-col gap-2">
        <div class="border border-gray-300 bg-green-50/10 rounded-lg p-4 w-full flex flex-col">
          <h3 class="text-lg font-semibold mb-4">
            Domain und E-Mail
          </h3>
          <p class="text-gray-500">
            Sie brauchen erstmal nicht mehr als Ihr Gewerbeprofil, aber eine eigene Domain und E-Mail-Adresse muss schon sein?
          </p>
          <div class="pt-4 mt-auto flex items-center justify-between">
            <div class="text-gray-700 text-xl font-semibold">
              1 € pro Monat
            </div>
            <UButton
              label="Domain sichern"
            />
          </div>
        </div>
        <div class="border border-gray-300 bg-green-50/10 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4">
            Haben Sie noch einen Wunsch?
          </h3>
          <p class="text-gray-500">
            Sie haben spezielle Wünsche oder benötigen eine individuelle Lösung, die hier nicht aufgeführt ist?
            Kein Problem, wir sind flexibel und finden gemeinsam eine Lösung.
          </p>
          <UTextarea
            placeholder="Beschreiben Sie hier Ihre Wünsche..."
            class="w-full mt-4"
          />
          <div class="pt-4 mt-auto flex items-center justify-between">
            <UButton
              label="Anfrage senden"
              class="ml-auto"
            />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
