<script setup lang="ts">
const { saveSettings } = useProfile()
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <div class="flex flex-col sm:flex-row gap-4">
      <UFormField label="Vorname">
        <UInput
          v-model="$profile.settings.public.company.firstname"
          placeholder="Vorname"
        />
      </UFormField>
      <UFormField
        label="Nachname"
      >
        <UInput
          v-model="$profile.settings.public.company.lastname"
          placeholder="Nachname"
          class="w-full"
        />
      </UFormField>
    </div>
    <UFormField label="Name Ihres Unternehmens">
      <UInput
        v-model="$profile.settings.public.company.name"
        placeholder="Geben Sie den Titel Ihres Unternehmens ein"
        class="w-full"
      />
    </UFormField>
    <UFormField label="Straße und Hausnummer">
      <UInput
        v-model="$profile.settings.public.company.street"
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
          v-model="$profile.settings.public.company.zip"
          placeholder="Postleitzahl"
        />
      </UFormField>
      <UFormField
        label="Stadt"
        class="flex-1"
      >
        <UInput
          v-model="$profile.settings.public.company.city"
          placeholder="Geben Sie die Stadt ein"
          class="w-full"
        />
      </UFormField>
    </div>
    <UFormField label="Telefonnummer">
      <UInput
        v-model="$profile.settings.public.company.phone"
        placeholder="Geben Sie die Telefonnummer ein"
        class="w-full"
      />
    </UFormField>
    <UFormField label="E-Mail-Adresse">
      <UInput
        v-model="$profile.settings.public.company.email"
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
        v-model="$profile.settings.public.company.isSmallBusiness"
        label="Ich bin Kleinunternehmer"
        class="w-full"
      />
    </UFormField>
    <Transition name="fade">
      <UFormField
        v-if="!$profile.settings.public.company.isSmallBusiness"
        label="Umsatzsteuer-ID oder Wirtschafts-ID"
        description="Lassen Sie das Feld leer, wenn Sie beides nicht haben. Ihre persönliche Steuernummer (123/456/78901) ist dann nur auf Rechnungen erforderlich, nicht aber im Impressum."
      >
        <UButtonGroup>
          <USelect
            v-model="$profile.settings.public.company.taxIdType"
            :items="[
              { label: 'USt-IdNr.', value: 'ustid' },
              { label: 'W-IdNr.', value: 'wid' },
            ]"
          />
          <UInput
            v-model="$profile.settings.public.company.taxId"
            placeholder="DE123456789"
            class="w-full"
          />
        </UButtonGroup>
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
