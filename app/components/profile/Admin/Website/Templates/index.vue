<script setup lang="ts">
const { showWebsiteTemplates, go } = useAdmin()

const { data: website } = await useFetch('/api/user/website/getWebsite')
const { data: partials } = await useFetch('/api/user/website/getPartials')
</script>

<template>
  <USlideover
    :open="showWebsiteTemplates"
    side="left"
    :ui="{
      wrapper: 'z-40',
      body: '!p-0 border-none',
      overlay: 'backdrop-blur-xs',
      footer: '!p-0',
      header: 'relative',
    }"
  >
    <template #header>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-layout-template"
          class="inline-block size-6 opacity-50"
        />
        Vorlagen
      </h3>
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        color="neutral"
        size="md"
        class="ml-auto"
        @click="go('#website')"
      />
      <UButton
        icon="i-heroicons-x-mark"
        variant="ghost"
        color="neutral"
        size="md"
        @click="go('')"
      />
    </template>

    <template #body>
      <ProfileAdminWebsiteTemplatesTemplate v-for="partial in partials" :key="partial.id" :partial="partial" />
    </template>

    <template #footer>
      <ProfileAdminWebsiteAssistant />
    </template>
  </USlideover>
</template>
