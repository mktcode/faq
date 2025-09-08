<script setup lang="ts">
const { websiteSelectedPage, go } = useAdmin()

const { $profile } = useProfile()

const page = computed(() => {
  return $profile.settings.public.pages.find(page => page.id === websiteSelectedPage.value?.pageId)
})

const component = computed(() => {
  if (!websiteSelectedPage.value || websiteSelectedPage.value.componentId === null) {
    return null
  }

  return $profile.settings.public.pages.find(page => page.id === websiteSelectedPage.value?.pageId)?.components[websiteSelectedPage.value.componentId]
})
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
      <UButton
        icon="i-heroicons-x-mark"
        variant="ghost"
        color="neutral"
        size="md"
        class="ml-auto"
        @click="go('#website')"
      />
    </template>

    <template #body>
      <UButton
        v-for="(component, index) in page.components"
        :key="component.key + index"
        :label="component.title"
        icon="i-heroicons-paint-brush"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="go(`#website/page/${page.id}/component/${index}`)"
      />
    </template>
  </USlideover>
</template>
