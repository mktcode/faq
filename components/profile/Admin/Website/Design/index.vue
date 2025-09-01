<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { toHslString } from '~/shared/color'

const { showWebsiteDesignSettings, go } = useAdmin()
const toast = useToast()

const { $profile, saveSettings } = useProfile()

const isDesktop = useMediaQuery('(min-width: 640px)')

const headerImageInput = ref<HTMLInputElement | null>(null)
const headerVideoInput = ref<HTMLInputElement | null>(null)
const logoInput = ref<HTMLInputElement | null>(null)
const showUploadHeaderModal = ref(false)
const showLinksModal = useState('showLinksModal', () => false)
const showCustomCss = ref(false)

const uploadHeaderImage = async (files: FileList | null) => {
  if (!files || files.length === 0) return

  const formData = new FormData()

  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i])
  }

  try {
    const { imageUrls } = await $fetch('/api/user/upload/image', {
      method: 'POST',
      body: formData,
    })

    $profile.settings.public.header.image = imageUrls[0] || ''

    if ($profile.settings.public.header.imageOverlay.opacity > 90) {
      $profile.settings.public.header.imageOverlay.opacity = 90
    }

    await saveSettings()

    // Clear the input to allow selecting the same file again
    if (headerImageInput.value) {
      headerImageInput.value.value = ''
    }
  }
  catch (error) {
    console.error('Error uploading files:', error)
  }
}

const uploadHeaderVideo = async (files: FileList | null) => {
  if (!files || files.length === 0) return

  const formData = new FormData()

  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i])
  }

  try {
    const { success, videoUrl, message } = await $fetch('/api/user/upload/video', {
      method: 'POST',
      body: formData,
    })

    if (success && videoUrl) {
      $profile.settings.public.header.video = videoUrl || ''

      if ($profile.settings.public.header.imageOverlay.opacity > 90) {
        $profile.settings.public.header.imageOverlay.opacity = 90
      }

      await saveSettings()

      // Clear the input to allow selecting the same file again
      if (headerVideoInput.value) {
        headerVideoInput.value.value = ''
      }
    }
    else {
      toast.add({
        title: 'Fehler',
        icon: 'i-heroicons-exclamation-circle',
        description: message || 'Das Video konnte nicht hochgeladen werden.',
        color: 'error',
        progress: false
      })
    }
  }
  catch (error) {
    toast.add({
      title: 'Unbekannter Fehler',
      icon: 'i-heroicons-exclamation-circle',
      description: 'Das Video konnte nicht hochgeladen werden.',
      color: 'error',
      progress: false
    })
  }
}

const uploadLogo = async (file: File | null) => {
  if (!file) return

  const formData = new FormData()
  formData.append('files', file)

  try {
    const { imageUrl } = await $fetch('/api/user/upload/logo', {
      method: 'POST',
      body: formData,
    })

    const randomSuffix = Math.random().toString(36).substring(2, 15)
    $profile.settings.public.company.logo = imageUrl ? `${imageUrl}?${randomSuffix}` : ''

    await saveSettings()

    if (logoInput.value) {
      logoInput.value.value = ''
    }
  }
  catch (error) {
    console.error('Error uploading files:', error)
  }
}

const handleHeaderImageInputChange = () => {
  uploadHeaderImage(headerImageInput.value?.files || null)
  showUploadHeaderModal.value = false
}

const handleHeaderVideoInputChange = () => {
  uploadHeaderVideo(headerVideoInput.value?.files || null)
  showUploadHeaderModal.value = false
}

const handleLogoInputChange = () => {
  uploadLogo(logoInput.value?.files ? logoInput.value.files[0] : null)
}

const clickHeaderImageInput = () => {
  if (headerImageInput.value) {
    headerImageInput.value.click()
  }
}

const clickHeaderVideoInput = () => {
  if (headerVideoInput.value) {
    headerVideoInput.value.click()
  }
}

const clickLogoInput = () => {
  if (logoInput.value) {
    logoInput.value.click()
  }
}

async function deleteImage(image: 'logo' | 'header') {
  const url = image === 'logo' ? $profile.settings.public.company.logo : $profile.settings.public.header.image

  const { success } = await $fetch('/api/user/upload/delete', {
    method: 'POST',
    body: JSON.stringify({ url }),
  })

  if (!success) {
    toast.add({
      title: 'Fehler',
      icon: 'i-heroicons-exclamation-circle',
      description: 'Die Datei konnte nicht gelöscht werden.',
      color: 'error',
      progress: false
    })
    return
  }

  if (image === 'logo') {
    $profile.settings.public.company.logo = ''
  }
  else {
    $profile.settings.public.header.image = ''
  }

  saveSettings()
}
</script>

<template>
  <UDrawer
    :open="showWebsiteDesignSettings"
    :direction="isDesktop ? 'left' : 'bottom'"
    close-icon="i-heroicons-arrow-left"
    handle-only
    :overlay="false"
    :close-threshold="0.85"
    @close="() => go('#website')"
    :ui="{
      content: 'shadow-2xl shadow-black',
      container: 'relative max-w-md no-scrollbar',
      handle: '!bg-gray-400',
      header: 'h-10',
    }"
  >
    <template #header>
      <ProfileMainDrawerTip />
      <h3 class="text-lg font-semibold flex gap-2 relative">
        <UIcon
          name="i-heroicons-paint-brush"
          class="inline-block size-6 opacity-50"
        />
        Design und Kopfbereich
        <div class="flex items-center gap-2 ml-auto">
          <ProfileAdminSaveAndReset />
          <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            color="neutral"
            size="md"
            @click="go('#website')"
          />
        </div>
      </h3>
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <div class="p-1 border border-gray-200 rounded-lg flex flex-col gap-2">
          <div
            class="@container group relative flex flex-col items-center justify-center w-full rounded-lg cursor-pointer transition-all overflow-hidden hover:bg-gray-100"
          >
            <video
              v-if="$profile.settings.public.header.video"
              class="absolute inset-0 z-0 w-full h-full object-cover object-center pointer-events-none"
              :src="$profile.settings.public.header.video"
              :poster="$profile.settings.public.header.image || undefined"
              autoplay
              muted
              loop
              playsinline
              preload="auto"
              aria-hidden="true"
            />
            <img
              v-else-if="$profile.settings.public.header.image"
              :src="$profile.settings.public.header.image"
              alt="Header Image"
              class="absolute w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-300"
            >
            <div
              class="absolute inset-0 z-10"
              :style="{
                backgroundColor: toHslString($profile.settings.public.header.imageOverlay.color),
                opacity: $profile.settings.public.header.imageOverlay.opacity / 100,
              }"
              @click.stop="showUploadHeaderModal = true"
            />
            <div class="flex flex-col items-center justify-center pt-5 p-6 z-10 pointer-events-none">
              <UIcon
                name="i-heroicons-camera"
                class="size-8 text-black/10 absolute top-3 left-3 pointer-events-none"
              />
              <img
                v-if="$profile.settings.public.company.logo"
                :src="$profile.settings.public.company.logo"
                class="w-full max-w-[32cqw] pointer-events-auto hover:scale-105 transition-transform duration-600"
                @click.stop="clickLogoInput"
              >
              <UButton
                v-else
                icon="i-heroicons-camera"
                variant="solid"
                color="neutral"
                block
                class="group/logo size-20 rounded-full mx-auto bg-black/30 hover:bg-black hover:text-gray-400 transition-all duration-600 pointer-events-auto"
                :ui="{
                  leadingIcon: 'group-hover/logo:scale-125 transition-transform duration-800',
                }"
                @click.stop="clickLogoInput"
              />
            </div>
            <input
              ref="headerImageInput"
              type="file"
              class="hidden"
              accept="image/*"
              @change="handleHeaderImageInputChange"
            >
            <input
              ref="headerVideoInput"
              type="file"
              class="hidden"
              accept="video/*"
              @change="handleHeaderVideoInputChange"
            >
            <input
              ref="logoInput"
              type="file"
              class="hidden"
              @change="handleLogoInputChange"
            >
          </div>
          <div
            v-if="$profile.settings.public.header.image || $profile.settings.public.company.logo"
            class="flex items-center justify-end gap-2"
          >
            <UButton
              v-if="$profile.settings.public.company.logo"
              label="Logo entfernen"
              icon="i-heroicons-trash"
              variant="ghost"
              color="error"
              size="sm"
              @click="deleteImage('logo')"
            />
            <UButton
              v-if="$profile.settings.public.header.image"
              label="Bild entfernen"
              icon="i-heroicons-trash"
              variant="ghost"
              color="error"
              size="sm"
              @click="deleteImage('header')"
            />
          </div>
        </div>
        <div class="flex gap-2">
          <HslPicker
            v-model:h="$profile.settings.public.header.imageOverlay.color.h"
            v-model:s="$profile.settings.public.header.imageOverlay.color.s"
            v-model:l="$profile.settings.public.header.imageOverlay.color.l"
            label="Hintergrund"
          />
          <UFormField
            label="Deckkraft"
            class="flex-1 pr-1"
          >
            <USlider
              v-model="$profile.settings.public.header.imageOverlay.opacity"
              class="flex-1 mt-4"
            />
          </UFormField>
        </div>
        <UFormField
          label="Variante"
        >
          <USelect
            v-model="$profile.settings.public.header.height"
            :items="[
              { label: 'Vollbild', value: 'full' },
              { label: 'halber Bildschirm', value: 'half' },
              { label: 'automatische Höhe', value: 'auto' },
              { label: 'Box', value: 'boxed' },
            ]"
            class="w-full"
          />
        </UFormField>
        <UButton
          label="Links bearbeiten"
          @click="showLinksModal = true"
        />
        <div class="flex gap-2">
          <HslPicker
            v-model:h="$profile.settings.public.design.color.h"
            v-model:s="$profile.settings.public.design.color.s"
            v-model:l="$profile.settings.public.design.color.l"
            label="Primäre Farbe"
          />
          <UFormField
            label="Stil"
            class="flex-1"
          >
            <USelect
              v-model="$profile.settings.public.design.rounded"
              class="w-full"
              :items="[
                { label: 'Eckig', value: 'none' },
                { label: 'Rund', value: 'md' },
                { label: 'Sehr rund', value: 'xl' },
              ]"
            />
          </UFormField>
        </div>
        <UFormField label="Schriftart">
          <FontPicker v-model:font="$profile.settings.public.design.font" />
        </UFormField>
        <div class="flex gap-2">
          <UFormField
            label="Titel"
            class="flex-1 w-full"
          >
            <UInput
              v-model="$profile.settings.public.header.title"
              placeholder="Gib den Titel deines Unternehmens ein"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Schriftgröße"
            class="w-28"
          >
            <UInputNumber
              v-model="$profile.settings.public.header.titleFontSize"
              size="xl"
            />
          </UFormField>
          <div class="w-28">
            <HslPicker
              v-model:h="$profile.settings.public.header.titleColor.h"
              v-model:s="$profile.settings.public.header.titleColor.s"
              v-model:l="$profile.settings.public.header.titleColor.l"
              label="Farbe"
            />
          </div>
        </div>
        <div class="flex gap-2">
          <UFormField
            label="Willkommen / Slogan"
            class="flex-1 w-full"
          >
            <UInput
              v-model="$profile.settings.public.header.description"
              placeholder="Gib eine kurze Beschreibung deines Unternehmens ein"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Schriftgröße"
            class="w-28"
          >
            <UInputNumber
              v-model="$profile.settings.public.header.descriptionFontSize"
              size="xl"
            />
          </UFormField>
          <div class="w-28">
            <HslPicker
              v-model:h="$profile.settings.public.header.descriptionColor.h"
              v-model:s="$profile.settings.public.header.descriptionColor.s"
              v-model:l="$profile.settings.public.header.descriptionColor.l"
              label="Farbe"
            />
          </div>
        </div>
        <ProfileAdminWebsiteDesignComponentOrder />
        <UCollapsible
          v-model:open="showCustomCss"
          class="flex flex-col gap-2"
          :ui="{
            root: 'border border-gray-200 rounded-lg',
            content: '',
          }"
        >
          <UButton
            icon="i-lucide-file-json-2"
            label="Stylesheet bearbeiten"
            color="neutral"
            variant="link"
            trailing-icon="i-heroicons-chevron-down"
            :disabled="!$profile.subscription.plan"
          >
            <template #trailing>
              <div class="ml-auto flex items-center gap-2">
                <UBadge
                  v-if="!$profile.subscription.plan"
                  label="Premium"
                  variant="outline"
                />
                <UIcon
                  v-else
                  name="i-heroicons-chevron-down"
                  class="transition-transform"
                  :class="{ 'rotate-180': showCustomCss }"
                />
              </div>
            </template>
          </UButton>

          <template #content>
            <UTextarea
              v-model="$profile.settings.public.css"
              placeholder="CSS hier eingeben"
              class="w-full"
              autoresize
              :rows="2"
              :maxrows="15"
              :ui="{
                base: 'text-sm rounded-t-none',
              }"
            />
          </template>
        </UCollapsible>
      </div>
      <UModal
        v-model:open="showUploadHeaderModal"
        title="Hintergrund auswählen"
        :dismissible="false"
        :ui="{
          body: 'flex flex-col !p-0',
        }"
      >
        <template #body>
          <UButton
            label="Bild auswählen"
            icon="i-heroicons-camera"
            class="w-full rounded-none p-4 border-b border-gray-200"
            variant="ghost"
            color="neutral"
            @click="clickHeaderImageInput"
          />
          <UButton
            label="Bild generieren"
            icon="i-heroicons-sparkles"
            class="w-full rounded-none p-4 border-b border-gray-200"
            variant="ghost"
            color="neutral"
            :disabled="!$profile.subscription.plan"
          >
            <template #trailing>
              <UBadge
                v-if="!$profile.subscription.plan"
                label="Premium"
                variant="outline"
                class="ml-auto"
              />
            </template>
          </UButton>
          <UButton
            label="Video auswählen"
            icon="i-heroicons-play"
            class="w-full rounded-none p-4"
            variant="ghost"
            color="neutral"
            :disabled="!$profile.subscription.plan"
            @click="clickHeaderVideoInput"
          >
            <template #trailing>
              <UBadge
                v-if="!$profile.subscription.plan"
                label="Premium"
                variant="outline"
                class="ml-auto"
              />
            </template>
          </UButton>
        </template>
      </UModal>
      <ProfileAdminWebsiteDesignLinksModal />
    </template>
  </UDrawer>
</template>
