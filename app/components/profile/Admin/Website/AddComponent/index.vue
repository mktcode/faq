<script setup lang="ts">
import { availableComponents, type ComponentUnionSchema } from '~~/types/db';

const { page, go } = useAdmin()

const open = defineModel('open', {
  type: Boolean,
  required: true,
})

function addComponent(component: ComponentUnionSchema) {
  if (!page.value) return

  page.value.components.push(component)
  open.value = false
  go(`#website/page/${page.value.id}/component/${page.value.components.length - 1}`)
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileAdminWebsiteAddComponentItem
          v-for="availableComponent in availableComponents"
          :key="availableComponent.title"
          :component="availableComponent"
          @add="addComponent(availableComponent.defaults)"
        >
          <template #preview>
            <ProfileAdminWebsiteOfferingPreview v-if="availableComponent.key === 'offerings'" />
            <ProfileAdminWebsiteGalleryPreview v-else-if="availableComponent.key === 'gallery'" />
            <ProfileAdminWebsiteFaqPreview v-else-if="availableComponent.key === 'faq'" />
            <ProfileAdminWebsiteDownloadsPreview v-else-if="availableComponent.key === 'downloads'" />
            <ProfileAdminWebsiteContactFormPreview v-else-if="availableComponent.key === 'form'" />
          </template>
        </ProfileAdminWebsiteAddComponentItem>
      </div>
    </template>
  </UModal>
</template>
