<script setup lang="ts">
const toast = useToast()

const { $profile } = useProfile()

const { showWebsiteSettings, go } = useAdmin()

const showLegalDataWarning = computed(() => {
  return !$profile.settings.public.company.name || !$profile.settings.public.company.street || !$profile.settings.public.company.phone
})

async function togglePublished() {
  const { published } = await $fetch('/api/user/togglePublished', { method: 'POST' })

  if (published) {
    toast.add({
      title: 'Profil veröffentlicht',
      description: `Dein Profil ist jetzt öffentlich zugänglich.`,
      color: 'success',
    })
  }
  else {
    toast.add({
      title: 'Profil nicht mehr veröffentlicht',
      description: `Dein Profil ist jetzt privat.`,
      color: 'warning',
    })
  }
}
</script>

<template>
  <USlideover
    :open="showWebsiteSettings"
    side="left"
    :close="{
      size: 'md',
      onClick: () => {
        go('')
      }
    }"
    :ui="{
      wrapper: 'z-40',
      body: '!p-0',
      overlay: 'backdrop-blur-xs',
      footer: 'justify-between',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-monitor-smartphone"
          class="inline-block size-6 opacity-50"
        />
        Website
      </h3>
    </template>

    <template #body>
      <UAlert
        v-if="showLegalDataWarning"
        variant="soft"
        title="Unternehmensdaten vervollständigen"
        icon="i-heroicons-exclamation-triangle"
        class="rounded-none"
      >
        <template #description>
          Damit wir Ihre Website veröffentlichen können, benötigen wir noch einige Angaben für das Impressum und die Datenschutzerklärung. Bitte tragen Sie dazu Ihre
          <UIcon
            name="i-heroicons-building-office-2"
            class="inline-block size-4 align-middle"
          /> <strong>Unternehmensdaten</strong> vollständig ein.
        </template>
      </UAlert>
      <div class="p-4 border-b border-gray-200">
        <USwitch
          v-model="$profile.isPublic"
          :disabled="showLegalDataWarning"
          :label="$profile.isPublic ? 'Veröffentlicht' : 'Nicht veröffentlicht'"
          :description="$profile.isPublic ? 'Ihre Website ist öffentlich zugänglich und darf von Suchmaschinen erfasst werden.' : 'Nur Sie können Ihre Website sehen und nur wenn Sie angemeldet sind.'"
          @update:model-value="togglePublished"
        />
      </div>

      <UButton
        label="Design & Kopfbereich"
        icon="i-heroicons-paint-brush"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="go('#website/design')"
      />

      <UButton
        label="Angebote"
        icon="i-heroicons-megaphone"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="go('#website/offering')"
      />

      <UButton
        label="Kontaktformular"
        icon="i-heroicons-envelope"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="go('#website/contact-form')"
      />

      <UButton
        label="Gallerie"
        icon="i-heroicons-photo"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="go('#website/gallery')"
      />

      <UButton
        label="Häufige Fragen"
        icon="i-heroicons-question-mark-circle"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="go('#website/faq')"
      />

      <UButton
        label="Downloads"
        icon="i-heroicons-arrow-down-tray"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="go('#website/downloads')"
      />
    </template>
  </USlideover>
</template>
