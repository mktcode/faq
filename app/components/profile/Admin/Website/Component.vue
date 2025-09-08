<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

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
    :ui="{
      content: 'shadow-2xl shadow-black min-w-sm',
      container: 'relative max-w-md no-scrollbar',
      handle: '!bg-gray-400',
      header: 'h-10',
    }"
  >
    <template #header>
      <h3 class="text-lg font-semibold flex gap-2 relative">
        <UIcon
          name="i-heroicons-paint-brush"
          class="inline-block size-6 opacity-50"
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
  </UDrawer>
</template>
