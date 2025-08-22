<script setup lang="ts">
const { username, settings, saveSettings } = await useProfile()
const { appHost } = useRuntimeConfig().public

function computeSlug(title: string) {
  return title.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <p class="text-gray-400">
      Fügen Sie hier Texte zu Ihren Angeboten und Dienstleistungen hinzu. Halten Sie sich kurz und prägnant, damit Ihre Kunden schnell verstehen, was Sie anbieten.
      Was unterscheidet Sie von anderen? Welche Vorteile hat der Kunde, kurz- wie langfristig?
    </p>
    <div
      v-for="(offer, index) in settings.components.offers.items"
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
              @keyup="offer.slug = computeSlug(offer.title)"
            />
          </UFormField>
          <UButton
            icon="i-heroicons-trash"
            variant="soft"
            color="error"
            class="self-end"
            @click="settings.components.offers.items.splice(index, 1)"
          />
        </div>
        <div class="flex items-center gap-2">
          <UButtonGroup class="flex-1">
            <label
              :for="`offer-slug-${index}`"
              class="flex"
            >
              <UBadge
                color="neutral"
                variant="soft"
                size="sm"
                :label="`https://${username}.${appHost}/`"
              />
            </label>
            <UInput
              :id="`offer-slug-${index}`"
              v-model="offer.slug"
              placeholder="website-erstellen"
              class="w-full"
              size="sm"
            />
          </UButtonGroup>
          <UButton
            icon="i-heroicons-clipboard"
            variant="soft"
            class="self-end"
            size="sm"
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
      @click="settings.components.offers.items.push({ title: '', description: '', slug: '' })"
    >
      Angebot hinzufügen
    </UButton>
    <UButton
      variant="solid"
      color="primary"
      @click="() => saveSettings()"
    >
      Einstellungen speichern
    </UButton>
  </div>
</template>
