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
      body: 'flex flex-col gap-2',
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
      <UFormField label="Anordnung">
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
      <UButton
        icon="i-heroicons-plus"
        variant="soft"
        class="w-full"
        @click="$profile.settings.public.components.offers.items.push({ title: 'Neues Angebot', description: '' })"
      >
        Angebot hinzufügen
      </UButton>
      <UCollapsible
        v-for="(offer, index) in $profile.settings.public.components.offers.items"
        class="flex flex-col border border-gray-200 rounded-md"
        :unmount-on-hide="false"
      >
        <template #default="{ open }">
          <UButtonGroup>
            <UButton
              :label="offer.title"
              variant="link"
              color="neutral"
              trailing-icon="i-lucide-chevron-down"
              class="flex-1 truncate"
            >
              <template #trailing>
                <UIcon
                  name="i-lucide-chevron-down"
                  class="inline-block size-5 opacity-50 ml-auto transition-transform"
                  :class="{ 'rotate-180': open }"
                />
              </template>
            </UButton>
            <UButton
              icon="i-heroicons-trash"
              variant="soft"
              color="error"
              @click="$profile.settings.public.components.offers.items.splice(index, 1)"
              class="rounded-none"
            />
          </UButtonGroup>
        </template>

        <template #content>
          <UInput
            v-model="offer.title"
            placeholder="Website erstellen"
            class="w-full"
            :ui="{ base: 'rounded-none' }"
          />
          <WysiwygEditor
            v-model="offer.description"
            placeholder="Hier kannst du deinen Willkommenstext eingeben..."
            rounded="none"
          />
        </template>
      </UCollapsible>
    </template>
  </UDrawer>
</template>
