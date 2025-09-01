<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const { showWebsiteOfferingSettings, go } = useAdmin()

const { $profile } = useProfile()

const isDesktop = useMediaQuery('(min-width: 640px)')

function changeOrder(index: number, direction: 'up' | 'down') {
  const items = $profile.settings.public.components.offers.items
  if (direction === 'up' && index > 0) {
    const temp = items[index - 1]
    items[index - 1] = items[index]
    items[index] = temp
  }
  else if (direction === 'down' && index < items.length - 1) {
    const temp = items[index + 1]
    items[index + 1] = items[index]
    items[index] = temp
  }
}
</script>

<template>
  <UDrawer
    :open="showWebsiteOfferingSettings"
    :direction="isDesktop ? 'left' : 'bottom'"
    close-icon="i-heroicons-arrow-left"
    handle-only
    :overlay="false"
    :close-threshold="0.85"
    @close="() => go('#website')"
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
        <div class="flex items-center gap-2 ml-auto">
          <ProfileAdminSaveAndReset />
          <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            color="neutral"
            size="md"
            @click="go('#website')"
          />
        </div>
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
        @click="$profile.settings.public.components.offers.items.unshift({ id: Date.now(), title: 'Neues Angebot', description: '' })"
      >
        Angebot hinzufügen
      </UButton>
      <TransitionGroup name="list">
        <ProfileAdminWebsiteOfferingItem
          v-for="(offering, index) in $profile.settings.public.components.offers.items"
          :key="offering.id"
          v-model:offering="$profile.settings.public.components.offers.items[index]"
          :index="index"
          @change-order="changeOrder(index, $event)"
        />
      </TransitionGroup>
    </template>
  </UDrawer>
</template>
