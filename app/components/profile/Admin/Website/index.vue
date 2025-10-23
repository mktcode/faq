<script setup lang="ts">
const toast = useToast()

const { $profile, showLegalDataWarning } = useProfile()
const { hasAgreedToBetaTerms, showBetaTermsModal } = useUserAgreements()
const { showWebsiteSettings, go } = useAdmin()

async function togglePublished() {
  const { published } = await $fetch('/api/user/togglePublished', { method: 'POST' })

  if (published) {
    toast.add({
      title: 'Website veröffentlicht',
      icon: 'i-lucide-check',
      description: `Ihre Website ist jetzt öffentlich zugänglich.`,
      color: 'success',
      progress: false,
    })
  }
  else {
    toast.add({
      title: 'Website nicht mehr öffentlich',
      icon: 'i-heroicons-eye-slash',
      description: `Ihre Website ist jetzt privat.`,
      color: 'warning',
      progress: false,
    })
  }
}

function addPage() {
  const newPage = {
    id: new Date().getTime(),
    title: 'Seite ' + ($profile.settings.public.pages.length + 1),
    description: 'Meine Unterseite über...',
    path: `/seite-${$profile.settings.public.pages.length + 1}`,
    components: [],
    lastMod: new Date().toISOString(),
  }

  $profile.settings.public.pages.push(newPage)
}

watch(() => showWebsiteSettings.value, (newVal) => {
  if (newVal && !hasAgreedToBetaTerms.value) {
    showBetaTermsModal.value = true
  }
}, { immediate: true })
</script>

<template>
  <USlideover
    :open="showWebsiteSettings"
    side="left"
    :ui="{
      wrapper: 'z-40',
      body: '!p-0 border-none',
      overlay: 'backdrop-blur-xs',
      footer: '!p-0',
    }"
  >
    <template #header>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-monitor-smartphone"
          class="inline-block size-6 opacity-50"
        />
        Website
      </h3>
      <ProfileAdminWebsiteVersionSwitcher />
      <UButton
        icon="i-heroicons-x-mark"
        variant="ghost"
        color="neutral"
        size="md"
        class="ml-auto"
        @click="go('')"
      />
    </template>

    <template #body>
      <ProfileAdminBetaTermsAgreement />
      <UAlert
        v-if="showLegalDataWarning"
        variant="soft"
        title="Unternehmensdaten vervollständigen"
        icon="i-heroicons-exclamation-triangle"
        class="rounded-none"
        :actions="[{
          label: 'Daten vervollständigen',
          icon: 'i-heroicons-building-office-2',
          size: 'lg',
          onClick: () => {
            go('#settings/company')
          },
        }]"
      >
        <template #description>
          Damit Sie Ihre Website veröffentlichen können, benötigen wir noch ein paar Angaben für das Impressum und die Datenschutzerklärung.
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
        label="Design"
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
        label="Dateien & Bilder"
        icon="i-lucide-folder-open"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="go('#website/files')"
      />

      <TransitionGroup name="list">
        <div
          v-for="(page, index) in $profile.settings.public.pages.sort((a, b) => a.path.localeCompare(b.path))"
          :key="page.path"
        >
          <UButton
            :label="page.title || `Seite ${index + 1}`"
            :icon="page.path === '/' ? 'i-heroicons-home' : 'i-heroicons-document-text'"
            class="w-full rounded-none p-4 border-b border-gray-200"
            variant="ghost"
            color="neutral"
            trailing-icon="i-heroicons-chevron-right"
            :ui="{
              trailingIcon: 'ml-auto opacity-30',
            }"
            @click="go(`#website/page/${page.id}`)"
          />
        </div>
      </TransitionGroup>

      <UButton
        label="Unterseite hinzufügen"
        icon="i-heroicons-document-text"
        class="w-full rounded-none p-4 border-b border-primary-200"
        variant="soft"
        trailing-icon="i-heroicons-plus"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="addPage()"
      />
    </template>

    <template #footer>
      <ProfileAdminWebsiteAssistant />
      <ProfileAdminSaveAndReset />
    </template>
  </USlideover>
</template>
