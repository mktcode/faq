<script setup lang="ts">
const showModal = useState('showAssistantTipsModal', () => false)
</script>

<template>
  <USlideover
    v-model:open="showModal"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: 'flex flex-col gap-4',
    }"
    :close="{
      size: 'md',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-bot"
          class="inline-block size-6 opacity-50"
        />
        Assistent: Tipps
      </h3>
    </template>

    <template #body>
      <div>
        <strong>Bildschirmausschnitt teilen</strong><br>
        Teilen Sie einen Bildschirmausschnitt, um dem Assistenten zu helfen, Ihr Problem besser zu verstehen.
        Auf einem Windows-PC drücken Sie <UKbd value="win" /> + <UKbd value="shift" /> + <UKbd value="s" />, auf einem Mac <UKbd value="shift" /> + <UKbd value="command" /> + <UKbd value="4" />
        und auf dem Smartphone meist die Leiser-Taste + Ein-/Ausschalt-Taste.
        Achten Sie bitte darauf, keine sensiblen Informationen zu teilen.
      </div>

      <div>
        <strong>Unternehmenskontext</strong><br>
        Hilft dem Assistenten, besser auf Ihre spezifischen Bedürfnisse einzugehen und relevantere Antworten zu liefern.
        Hinterlegen Sie Informationen zur Zielgruppe oder Ihren Alleinstellungsmerkmalen.
      </div>

      <div>
        <strong>Online-Recherche:</strong><br>
        Sagen Sie "Suche nach ..." oder "Kannst du das mal recherchieren?" und der Assistent wird versuchen, relevante Informationen online zu finden.
      </div>
    </template>
  </USlideover>
</template>