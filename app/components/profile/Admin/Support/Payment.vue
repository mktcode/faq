<script setup lang="ts">
const { showSupportPayment, go } = useAdmin()
</script>

<template>
  <USlideover
    :open="showSupportPayment"
    side="right"
    :overlay="false"
    close-icon="i-heroicons-arrow-left"
    :close="{
      size: 'md',
      onClick: () => {
        go('#support')
      },
    }"
    :ui="{
      wrapper: 'z-40',
      overlay: 'backdrop-blur-xs',
      footer: 'justify-between',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-heart"
          class="inline-block size-6 opacity-50"
        />
        Unterstützen Sie uns
      </h3>
    </template>

    <template #body>
      <p class="mb-4">
        Wenn Sie unsere Arbeit und unseren Support schätzen, freuen wir uns über Ihre finanzielle Unterstützung. Jeder Beitrag
        hilft uns, unsere Dienste zu verbessern und weiterhin persönlichen Support anzubieten, auch für kleinere Budgets.
      </p>
      <div class="flex flex-col gap-2">
        <UButton
          target="_blank"
          rel="noopener noreferrer"
          label="Betrag wählen"
          icon="i-heroicons-banknotes"
          trailing-icon="i-heroicons-arrow-top-right-on-square"
          :ui="{
            trailingIcon: 'ml-auto opacity-50 size-6',
          }"
          block
        />

        <UButton
          target="_blank"
          rel="noopener noreferrer"
          label="Auf Google bewerten"
          icon="i-heroicons-star"
          trailing-icon="i-heroicons-arrow-top-right-on-square"
          :ui="{
            trailingIcon: 'ml-auto opacity-50 size-6',
          }"
          block
        />
      </div>
    </template>
  </USlideover>
</template>
