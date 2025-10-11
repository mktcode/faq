<script setup lang="ts">
import type { HtmlComponentSchema } from '~~/types/db';

const content = ref<HTMLElement | null>(null)

const { saveSettings, isSavingSettings } = useProfile()
const { hideNav, contentChanges } = useAdmin()

const { component } = defineProps<{
  component: HtmlComponentSchema;
}>()

defineEmits<{
  edit: [componentId: number]
}>()

function storeContentChange(html: string) {
  contentChanges.value[component.id] = html
}

async function saveContentChanges() {
  if (contentChanges.value[component.id]) {
    component.html = contentChanges.value[component.id] as string
    await saveSettings()
    delete contentChanges.value[component.id]
  }
}

function resetHtml() {
  if (content.value) {
    content.value.innerHTML = component.html
  }
  delete contentChanges.value[component.id]
}
</script>

<template>
  <div
    class="w-full relative"
    :id="component.key + '-' + component.id"
    :class="component.key"
  >
    <ProfileMainEditSectionButton
      v-if="$profile.isOwned || $profile.isAdmin"
      @click="$emit('edit', component.id)"
    />
    <Transition name="fade">
      <div
        v-if="contentChanges[component.id] && ($profile.isOwned || $profile.isAdmin)"
      >
        <UButton
          icon="i-heroicons-check"
          variant="soft"
          size="xl"
          class="px-4 transition-all rounded-r-full z-50 absolute top-12 -left-2 hover:left-0"
          :class="hideNav ? '-translate-x-full' : 'translate-x-0'"
          :loading="isSavingSettings"
          @click="saveContentChanges"
        />
        <UButton
          icon="i-heroicons-x-mark"
          variant="soft"
          size="xl"
          class="px-4 transition-all rounded-r-full z-50 absolute top-20 -left-2 hover:left-0"
          :class="hideNav ? '-translate-x-full' : 'translate-x-0'"
          @click="resetHtml"
        />
      </div>
    </Transition>
    <div
      class="w-full"
      ref="content"
      v-html="component.html"
      :contenteditable="($profile.isOwned || $profile.isAdmin) && !hideNav"
      @input="storeContentChange(($event.target as HTMLDivElement).innerHTML)"
    />
  </div>
</template>
