<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { availableComponents } from '~~/types/db';

const { $profile } = useProfile()

const { page, component, go } = useAdmin()

const isDesktop = useMediaQuery('(min-width: 640px)')

const showDeleteModal = ref(false)

function deleteComponent() {
  $profile.settings.public.pages = $profile.settings.public.pages.map(p => {
    if (p.id === page.value?.id) {
      p.components = p.components.filter(c => c.id !== component.value?.id)
    }
    return p
  })

  showDeleteModal.value = false
  go(`#website/page/${page.value?.id}`)
}
</script>

<template>
  <UDrawer
    v-if="page && component"
    :open="!!component"
    :direction="isDesktop ? 'left' : 'bottom'"
    close-icon="i-heroicons-arrow-left"
    handle-only
    :overlay="false"
    :close-threshold="0.85"
    class="!rounded-none bg-transparent"
    :ui="{
      content: 'ring-0',
      container: 'relative no-scrollbar rounded-none p-0 gap-0 bg-white [box-shadow:0_0_18px_rgba(0,0,0,0.2)] max-w-lg',
      handle: '!w-24 !h-3 sm:!w-3 sm:!h-24 hover:!w-32 hover:sm:!h-32 hover:sm:!w-3 bottom-2 sm:bottom-0 sm:left-2 !bg-primary-500 !opacity-50 hover:!opacity-100 hover:!bg-primary-500 transition-all',
      header: 'p-4 border-b border-gray-200',
      body: '',
      footer: '!p-0',
    }"
  >
    <template #header>
      <h3 class="text-lg font-semibold flex gap-2 relative">
        <UIcon
          :name="availableComponents.find(c => c.key === component?.key)?.icon || 'i-heroicons-cube-transparent'"
          class="inline-block size-6 opacity-50"
          :class="component?.key === 'header' ? 'rotate-180' : ''"
        />
        {{ component.title }}
        <div class="flex items-center gap-2 ml-auto">
          <UButton
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
            @click="go(`#website/page/${page.id}`)"
          />
        </div>
      </h3>
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
        }"
      >
        <template #header>
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <UIcon
              name="i-heroicons-trash"
              class="inline-block size-6 opacity-50"
            />
            Sektion löschen
          </h3>
        </template>

        <template #body>
          <p class="text-gray-700">
            Sind Sie sicher, dass Sie diese Sektion ({{ component.title }}) löschen möchten?
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
            @click="deleteComponent()"
          />
        </template>
      </UModal>
    </template>

    <template #body>
      <div
        class="p-4"
        v-if="component.key !== 'menu'"
      >
        <div class="flex items-center gap-4 mb-4">
          <UFormField
            label="Titel der Sektion"
            class="flex-1"
          >
            <UInput
              v-model="component.title"
              placeholder="z.B. Unsere Angebote"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Sichtbar">
            <USwitch
              v-model="component.showTitle"
              size="xl"
            />
          </UFormField>
        </div>
  
        <UFormField label="Beschreibung" hint="(optional)">
          <WysiwygEditor v-model="component.description" />
        </UFormField>
      </div>

      <ProfileAdminWebsiteHeader
        v-if="component.key === 'header'"
        v-model:component="component"
      />

      <ProfileAdminWebsiteMenu
        v-else-if="component.key === 'menu'"
        v-model:component="component"
      />

      <ProfileAdminWebsiteOffering
        v-if="component.key === 'offerings'"
        v-model:component="component"
      />
      <ProfileAdminWebsiteGallery
        v-else-if="component.key === 'gallery'"
        v-model:component="component"
      />
      <ProfileAdminWebsiteDownloads
        v-else-if="component.key === 'downloads'"
        v-model:component="component"
      />
      <ProfileAdminWebsiteContactForm
        v-else-if="component.key === 'form'"
        v-model:component="component"
      />
      <ProfileAdminWebsiteFaq
        v-else-if="component.key === 'faq'"
        v-model:component="component"
      />
    </template>

    <template #footer>
      <ProfileAdminSaveAndReset />
    </template>
  </UDrawer>
</template>
