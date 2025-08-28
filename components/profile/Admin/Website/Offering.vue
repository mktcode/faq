<script setup lang="ts">
const { showOfferingSettings } = useAdmin()
</script>

<template>
  <UDrawer
    v-model:open="showOfferingSettings"
    side="left"
    close-icon="i-heroicons-arrow-left"
    handle-only
    direction="left"
    :overlay="false"
    :close-threshold="0.85"
    :close="{
      size: 'md',
    }"
    :ui="{
      content: 'shadow-2xl shadow-black',
      container: 'relative max-w-md no-scrollbar',
      handle: '!bg-gray-400',
      header: 'h-10',
    }"
  >
    <template #header>
      <ProfileMainDrawerTip />
      <h3 class="text-lg font-semibold flex gap-2">
        <UIcon
          name="i-heroicons-megaphone"
          class="inline-block size-6 opacity-50"
        />
        Ihr Angebot
        <ProfileAdminSaveAndReset />
      </h3>
    </template>

    <template #body>
      <DismissableAlert
        title="Beschreiben Sie Ihr Angebot"
        description="Ihre Änderungen wurden erfolgreich gespeichert."
        storage-key="offer-info-dismissed"
      >
        Fügen Sie hier Texte zu Ihren Angeboten und Dienstleistungen hinzu. Halten Sie sich kurz und prägnant, damit Ihre Kunden schnell verstehen, was Sie anbieten.
        Was unterscheidet Sie von anderen? Welche Vorteile hat der Kunde, kurz- wie langfristig?
      </DismissableAlert>
      <UFormField label="Layout">
        <USelect
          v-model="$profile.settings.public.components.offers.layout"
          :items="[
            { label: 'Raster', value: 'grid' },
            { label: 'Liste', value: 'list' },
            { label: 'Liste (breit)', value: 'list-wide' },
            { label: 'Karussell', value: 'carousel' },
          ]"
          class="w-full"
        />
      </UFormField>
      <div
        v-for="(offer, index) in $profile.settings.public.components.offers.items"
        :key="index"
        class="flex flex-col gap-4 border-b border-gray-200 pb-4"
      >
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-4">
            <UFormField
              label="Titel"
              class="flex-1"
            >
              <UInput
                v-model="offer.title"
                placeholder="Website erstellen"
                class="w-full"
              />
            </UFormField>
            <UButton
              icon="i-heroicons-trash"
              variant="soft"
              color="error"
              class="self-end"
              @click="$profile.settings.public.components.offers.items.splice(index, 1)"
            />
          </div>
        </div>
        <UFormField label="Beschreibung">
          <WysiwygEditor
            v-model="offer.description"
            placeholder="Hier kannst du deinen Willkommenstext eingeben..."
          />
        </UFormField>
      </div>
      <UButton
        icon="i-heroicons-plus"
        variant="soft"
        class="w-full"
        @click="$profile.settings.public.components.offers.items.push({ title: '', description: '' })"
      >
        Angebot hinzufügen
      </UButton>
    </template>
  </UDrawer>
</template>
