<script setup lang="ts">
import { availableComponents, type SettingsForm } from '~~/types/db';

const { go } = useAdmin()

const open = defineModel('open', {
  type: Boolean,
  required: true,
})

const page = defineModel('page', {
  type: Object as () => SettingsForm['public']['pages'][0],
  required: true,
})

function addComponent(component: SettingsForm['public']['pages'][0]['components'][0]) {
  page.value.components.push(component)
  open.value = false
  go(`#website/component/${component.key}/${page.value.components.length - 1}`)
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
          @add="addComponent($event)"
        />
      </div>
    </template>
  </UModal>
</template>
