<script setup lang="ts">
const { showAssistantTips, go } = useAdmin()
</script>

<template>
  <USlideover
    :open="showAssistantTips"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: 'flex flex-col gap-4',
    }"
    :close="{
      size: 'md',
      onClick: () => {
        go('#assistant')
      }
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
        <strong>Zusätzlicher Kontext</strong><br>
        Die besten Ergebnisse liefert der Assistent, wenn er versteht, wer Sie sind und worum es Ihnen geht.
        In den Einstellungen können Sie zusätzliche Kontextinformationen hinterlegen und vom Assistenten selbst pflegen lassen.
        Vom allgemeinen Schreibstil und Ton über Informationen zu Ihrem Unternehmen, die so nicht auf der Website stehen, bis hin zu Themen und Fragen, die immer berücksichtigt werden sollen.
      </div>

      <div>
        <strong>Online-Recherche:</strong><br>
        Der Assistent wird immer versuchen, relevante Informationen online zu finden, wenn Sie eine entsprechende Anfrage stellen.
        Aktivieren Sie die <strong>Recherche</strong>-Funktion links unter dem Eingabefeld, wird in mehreren Schritten recherchiert und ein Bericht verfasst.
        Das Format können Sie in den Einstellungen angeben.
      </div>

      <div>
        <strong>Bildschirmausschnitt teilen</strong><br>
        Teilen Sie einen Bildschirmausschnitt, um dem Assistenten zu helfen, Ihr Problem besser zu verstehen.
        Auf einem Windows-PC drücken Sie <UKbd value="win" /> + <UKbd value="shift" /> + <UKbd value="s" />, auf einem Mac <UKbd value="shift" /> + <UKbd value="command" /> + <UKbd value="4" />
        und auf dem Smartphone meist die Leiser-Taste + Ein-/Ausschalt-Taste.
      </div>

      <div>
        <strong>Gesprächsverlauf</strong><br>
        Starten Sie regelmäßig eine neue Unterhaltung, damit der Assistent nicht durch alte Informationen abgelenkt wird.
        In einem einzelnen Gesprächsverlauf werden ältere Nachrichten außerdem irgendwann nur noch zusammengefasst gespeichert.
        Die grundlegenden Informationen über Ihr Unternehmen und Ihre zusätzlichen Kontextinformationen hat der Assistent in jedem Gespräch "auf dem Schirm".
      </div>
    </template>
  </USlideover>
</template>
