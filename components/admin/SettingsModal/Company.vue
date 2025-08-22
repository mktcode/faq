<script setup lang="ts">
const { settings, saveSettings } = await useProfile()
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <DismissableAlert
      title="Wichtige Information"
      storage-key="company-info-dismissed"
    >
      Wir gehen davon aus, dass Sie am Anfang Ihrer Selbstständigkeit stehen.
      Viele Anforderungen gelten erst aber einer bestimmten Mitarbeiterzahl.
      Wenn Sie bereits mehr als 10 Mitarbeiter haben,
      <a
        href="https://markus-kottlaender.de"
        target="_blank"
        class="underline"
      >kontaktieren Sie uns</a> für eine individuelle Beratung.
    </DismissableAlert>

    <UFormField label="Name Ihres Unternehmens">
      <UInput
        v-model="settings.company.name"
        placeholder="Geben Sie den Titel Ihres Unternehmens ein"
        class="w-full"
      />
    </UFormField>
    <UFormField label="Straße und Hausnummer">
      <UInput
        v-model="settings.company.street"
        placeholder="Geben Sie die Straße und Hausnummer ein"
        class="w-full"
      />
    </UFormField>
    <div class="flex flex-col sm:flex-row gap-4">
      <UFormField
        label="PLZ"
        class="w-32"
      >
        <UInput
          v-model="settings.company.zip"
          placeholder="Postleitzahl"
        />
      </UFormField>
      <UFormField
        label="Stadt"
        class="flex-1"
      >
        <UInput
          v-model="settings.company.city"
          placeholder="Geben Sie die Stadt ein"
          class="w-full"
        />
      </UFormField>
    </div>
    <UFormField label="Telefonnummer">
      <UInput
        v-model="settings.company.phone"
        placeholder="Geben Sie die Telefonnummer ein"
        class="w-full"
      />
    </UFormField>
    <UFormField label="E-Mail-Adresse">
      <UInput
        v-model="settings.company.email"
        type="email"
        placeholder="Geben Sie die E-Mail-Adresse ein"
        class="w-full"
      />
    </UFormField>
    <UFormField
      label="Rechtsform"
    >
      <USelect
        :items="[
          { label: 'Freiberufler', value: 'freiberufler' },
          { label: 'Einzelunternehmer', value: 'einzelunternehmer' },
        ]"
        placeholder="Wähle deine Rechtsform"
        class="w-full"
      />
    </UFormField>
    <UFormField
      label="Kleinunternehmerregelung"
      description="Wenn Sie die Kleinunternehmerregelung nutzen, müssen Sie keine Umsatzsteuer ausweisen. Im Impressum steht dann ein entsprechender Hinweis."
    >
      <USwitch
        v-model="settings.company.isSmallBusiness"
        label="Ich bin Kleinunternehmer"
        class="w-full"
      />
    </UFormField>
    <Transition name="fade">
      <UFormField
        v-if="!settings.company.isSmallBusiness"
        label="Umsatzsteuer-ID oder Wirtschafts-ID"
        description="Geben Sie hier nicht Ihre persönliche Steuernummer (123/456/78901) an."
      >
        <UInput
          v-model="settings.company.taxId"
          placeholder="DE123456789"
          class="w-full"
        />
      </UFormField>
    </Transition>
    <UButton
      label="Einstellungen speichern"
      variant="solid"
      color="primary"
      class="mt-4"
      @click="saveSettings"
    />
  </div>
</template>
