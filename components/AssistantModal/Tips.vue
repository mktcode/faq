<script setup lang="ts">
const tipsOpen = ref(false)
</script>

<template>
  <UCollapsible
    v-model:open="tipsOpen"
    class="flex flex-col gap-2"
    :ui="{
      root: 'border-b border-gray-200',
      content: 'flex flex-col gap-2 text-sm px-3 pb-3',
    }"
  >
    <UButton
      icon="i-heroicons-light-bulb"
      label="Tipps"
      color="neutral"
      variant="link"
      trailing-icon="i-heroicons-chevron-down"
      :ui="{
        leadingIcon: 'size-5',
        trailingIcon: `ml-auto transition-transform ${tipsOpen ? 'rotate-180' : ''}`,
      }"
    />

    <template #content>
      <strong>Unternehmenskontext</strong><br>
      Hilft dem Assistenten, besser auf Ihre spezifischen Bedürfnisse einzugehen und relevantere Antworten zu liefern.
      Hinterlegen Sie Informationen zur Zielgruppe oder Ihren Alleinstellungsmerkmalen.

      <strong>Online-Recherche:</strong><br>
      Sagen Sie "Suche nach ..." oder "Kannst du das mal recherchieren?" und der Assistent wird versuchen, relevante Informationen online zu finden.

      <strong>Bilder generieren:</strong><br>
      Für Ihre Website oder Social Media.
    </template>
  </UCollapsible>
</template>