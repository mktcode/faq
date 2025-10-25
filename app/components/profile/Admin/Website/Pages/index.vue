<script setup lang="ts">
const { showWebsitePages, go } = useAdmin()

const { data: pages } = await useFetch('/api/user/website/getPages')
</script>

<template>
  <USlideover
    :open="showWebsitePages"
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
        Seiten
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
      <ProfileAdminWebsitePagesPage v-for="page in pages" :key="page.id" :page="page" />
    </template>

    <template #footer>
      <ProfileAdminWebsiteAssistant />
    </template>
  </USlideover>
</template>
