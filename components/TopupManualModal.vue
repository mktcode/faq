<script setup lang="ts">
const { user } = useUserSession()

const open = defineModel('open', {
  type: Boolean,
  default: false,
})
</script>

<template>
  <UModal
    v-model:open="open"
    title="Guthaben aufladen"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <p>
          Dein Guthaben kannst du auch per Banküberweisung aufladen. Überweise einfach den gewünschten Betrag an folgende Bankverbindung:
        </p>
        <div class="flex flex-col">
          <div>
            <span class="font-bold">Empfänger:</span> Markus Kottländer
          </div>
          <div>
            <span class="font-bold">IBAN:</span> DE12 3456 7890 1234 5678 90
          </div>
          <div>
            <span class="font-bold">BIC:</span> SOLIDE12XXX
          </div>
          <div>
            <span class="font-bold">Verwendungszweck:</span> Guthaben {{ user?.id }}
          </div>
        </div>
        <p>
          Sobald der Betrag eingegangen ist, wird dein Guthaben aufgeladen und du erhältst eine Bestätigung per E-Mail.
        </p>
      </div>
    </template>
  </UModal>
</template>
