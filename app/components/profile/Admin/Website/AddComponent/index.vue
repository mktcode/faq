<script setup lang="ts">
import { availableComponents, type ComponentUnionSchema } from '~~/types/db';

const { page, go } = useAdmin()

const open = defineModel('open', {
  type: Boolean,
  required: true,
})

function addComponent(component: ComponentUnionSchema) {
  if (!page.value) return

  component.id = new Date().getTime()
  component.order = Math.max(0, ...page.value.components.map(c => c.order)) + 1
  page.value.components.push(component)
  open.value = false
  go(`#website/page/${page.value.id}/component/${component.id}`)
}
</script>

<template>
  <UModal
    v-model:open="open"
    fullscreen
    title="Sektion hinzufügen"
    description="Wählen Sie eine Sektion aus, die Sie Ihrer Webseite hinzufügen möchten."
    :ui="{
      footer: 'justify-between'
    }"
  >
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto">
        <ProfileAdminWebsiteAddComponentItem
          v-for="availableComponent in availableComponents"
          :key="availableComponent.title"
          :component="availableComponent"
          @add="addComponent(availableComponent.defaults)"
        >
          <template #preview>
            <ProfileAdminWebsiteHeaderPreview v-if="availableComponent.key === 'header'" />
            <ProfileAdminWebsiteMenuPreview v-else-if="availableComponent.key === 'menu'" />
            <ProfileAdminWebsiteOfferingPreview v-if="availableComponent.key === 'offerings'" />
            <ProfileAdminWebsiteGalleryPreview v-else-if="availableComponent.key === 'gallery'" />
            <ProfileAdminWebsiteFaqPreview v-else-if="availableComponent.key === 'faq'" />
            <ProfileAdminWebsiteDownloadsPreview v-else-if="availableComponent.key === 'downloads'" />
            <ProfileAdminWebsiteContactFormPreview v-else-if="availableComponent.key === 'form'" />
            <ProfileAdminWebsiteHtmlPreview v-else-if="availableComponent.key === 'html'" />
          </template>
        </ProfileAdminWebsiteAddComponentItem>
      </div>
    </template>
  </UModal>
</template>
