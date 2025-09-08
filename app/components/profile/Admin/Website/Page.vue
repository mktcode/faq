<script setup lang="ts">
import { availableComponents } from '~~/types/db';
const { page, component, go } = useAdmin()

const { $profile } = useProfile()

const showDeleteModal = ref(false)

function deletePage() {
  $profile.settings.public.pages = $profile.settings.public.pages.filter(p => p.id !== page.value?.id)
  showDeleteModal.value = false
  go('#website')
}

const showAddComponent = ref(false)
</script>

<template>
  <USlideover
    v-if="page"
    :open="!!(page && !component)"
    side="left"
    :close="{
      size: 'md',
      onClick: () => {
        go('')
      },
    }"
    :ui="{
      wrapper: 'z-40',
      body: '!p-0',
      overlay: 'backdrop-blur-xs',
      footer: 'justify-between',
    }"
  >
    <template #header>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          :name="page.path === '/' ? 'i-heroicons-home' : 'i-heroicons-document-text'"
          class="inline-block size-6 opacity-50"
        />
        {{ page.title }}
      </h3>
      <div class="flex items-center gap-2 ml-auto">
        <UButton
          v-if="page.path !== '/'"
          icon="i-heroicons-trash"
          variant="ghost"
          color="neutral"
          size="md"
          @click="showDeleteModal = true"
        />
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="neutral"
          size="md"
          @click="go('#website')"
        />
      </div>
      <UModal
        :open="showDeleteModal"
        :close="{
          size: 'md',
          onClick: () => {
            showDeleteModal = false
          },
        }"
        :ui="{
          wrapper: 'z-50',
          footer: 'justify-between',
        }"
      >
        <template #header>
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <UIcon
              name="i-heroicons-trash"
              class="inline-block size-6 opacity-50"
            />
            Seite löschen
          </h3>
        </template>

        <template #body>
          <p class="text-gray-700">
            Sind Sie sicher, dass Sie diese Seite ({{ page.title }}) löschen möchten?
          </p>
        </template>

        <template #footer>
          <UButton
            label="Abbrechen"
            variant="soft"
            @click="showDeleteModal = false"
          />
          <UButton
            label="Löschen"
            color="error"
            @click="deletePage()"
          />
        </template>
      </UModal>
    </template>

    <template #body>
      <div class="p-4 border-b border-gray-200 flex flex-col gap-4">
        <UFormField label="Seitentitel">
          <UInput
            v-model="page.title"
            label="Titel"
            placeholder="Startseite"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Beschreibung">
          <UInput
            v-model="page.description"
            label="Beschreibung"
            placeholder="Willkommen auf meiner Website"
            class="w-full"
          />
        </UFormField>
        <UFormField
          v-if="page.id !== 0"
          label="Addresse"
        >
          <UButtonGroup class="w-full">
            <UBadge
              label="www.meine-domain.de"
              variant="outline"
              color="neutral"
            />
            <UInput
              v-model="page.path"
              label="Seitenpfad"
              placeholder="/"
              class="flex-1"
            />
          </UButtonGroup>
        </UFormField>
      </div>

      <UButton
        v-for="(component, index) in page.components"
        :key="component.key + index"
        :label="component.title"
        :icon="availableComponents.find(c => c.key === component.key)?.icon || 'i-heroicons-cube-transparent'"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="go(`#website/page/${page.id}/component/${index}`)"
      />

      <UButton
        label="Komponente hinzufügen"
        icon="i-heroicons-plus"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="showAddComponent = true"
      />

      <ProfileAdminWebsiteAddComponent
        v-model:open="showAddComponent"
      />
    </template>
  </USlideover>
</template>
