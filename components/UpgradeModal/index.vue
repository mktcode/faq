<script setup lang="ts">
const showModal = defineModel('show', {
  default: true,
  type: Boolean,
})
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
          Lernen wir uns kennen.
        </h2>
        <UButton
          icon="i-heroicons-x-mark"
          variant="ghost"
          @click="showModal = false"
        />
      </div>
      <p class="text-gray-500 mb-8">
        Ab hier wird es sehr individuell. Wir würden Sie gerne persönlich beraten und Ihnen ein individuelles Angebot erstellen.
        Klicken Sie auf "Angebot anfordern", um uns zu benachrichtigen.
        Wir sichten dann Ihr Profil und melden uns bei Ihnen, um alle Details zu besprechen.
        Bitte stellen Sie sicher, dass Ihr Profil eine aktuelle Telefonnummer oder E-Mail-Adresse enthält, damit wir Sie erreichen können.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        <div class="border border-gray-300 bg-green-50/10 rounded-lg p-4 w-full flex flex-col">
          <h3 class="text-lg font-semibold mb-4">
            Individuelles Design
          </h3>
          <p class="text-gray-500">
            Inhaltlich reicht ein Gewerbeprofil Ihnen, aber Sie wünschen sich eine individuellere Darstellung, zugeschnitten auf Ihr Unternehmen?
          </p>
          <div class="pt-4 mt-auto flex items-center justify-between">
            <div class="text-gray-700 text-xl font-semibold">
              500 € einmalig
            </div>
            <UButton
              label="Angebot anfordern"
            />
          </div>
        </div>
        <div class="border border-gray-300 bg-green-50/10 rounded-lg p-4 md:col-span-2">
          <h3 class="text-lg font-semibold mb-4">
            Profi-Website
          </h3>
          <p class="text-gray-500">
            Ein Gewerbeprofil reicht nicht. Sie brauchen ein individuelles Design, verschiedene Unterseiten, Formulare, Buchungskalender oder Warenkorb und Online-Zahlung, inkl. Domain und E-Mail-Postfächer?
          </p>
          <div class="pt-4 mt-auto flex items-center justify-between">
            <div class="text-gray-700 text-xl font-semibold">
              ab 2000 € einmalig<br>
              und 20 € pro Monat
            </div>
            <UButton
              label="Angebot anfordern"
            />
          </div>
        </div>
        <div class="border border-gray-300 bg-green-50/10 rounded-lg p-4 md:col-span-2">
          <h3 class="text-lg font-semibold mb-4">
            Etwas anderes?
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
