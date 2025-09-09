<script setup lang="ts">
import type { HeaderComponentSchema } from '~~/types/db'

const toast = useToast()

const component = defineModel('component', {
  type: Object as () => HeaderComponentSchema,
  required: true,
})

const headerImageInput = ref<HTMLInputElement | null>(null)
const headerVideoInput = ref<HTMLInputElement | null>(null)
const logoInput = ref<HTMLInputElement | null>(null)
const showUploadHeaderModal = ref(false)

const uploadHeaderImage = async (files: FileList | null) => {
  if (!files || files.length === 0) return

  const formData = new FormData()

  for (const file of Array.from(files)) {
    formData.append('files', file)
  }

  try {
    const { imageUrls } = await $fetch('/api/user/upload/image', {
      method: 'POST',
      body: formData,
    })

    component.value.image = imageUrls[0] || ''

    if (component.value.imageOverlay.opacity > 90) {
      component.value.imageOverlay.opacity = 90
    }

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

  for (const file of Array.from(files)) {
    formData.append('files', file)
  }

  try {
    const { success, videoUrl, message } = await $fetch('/api/user/upload/video', {
      method: 'POST',
      body: formData,
    })

    if (success && videoUrl) {
      component.value.video = videoUrl || ''

      if (component.value.imageOverlay.opacity > 90) {
        component.value.imageOverlay.opacity = 90
      }

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
        progress: false,
      })
    }
  }
  catch (error) {
    toast.add({
      title: 'Unbekannter Fehler',
      icon: 'i-heroicons-exclamation-circle',
      description: 'Das Video konnte nicht hochgeladen werden.',
      color: 'error',
      progress: false,
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
    component.value.logo = imageUrl ? `${imageUrl}?${randomSuffix}` : ''

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
  if (logoInput.value?.files) {
    for (const file of Array.from(logoInput.value.files)) {
      uploadLogo(file)
    }
  }
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
  const url = image === 'logo' ? component.value.logo : component.value.image

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
      progress: false,
    })
    return
  }

  if (image === 'logo') {
    component.value.logo = ''
  }
  else {
    component.value.image = ''
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="p-1 border border-gray-200 rounded-lg flex flex-col gap-2">
      <div
        class="@container group relative flex flex-col items-center justify-center w-full rounded-lg cursor-pointer transition-all overflow-hidden hover:bg-gray-100"
      >
        <video
          v-if="component.video"
          class="absolute inset-0 z-0 w-full h-full object-cover object-center pointer-events-none"
          :src="component.video"
          :poster="component.image || undefined"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          aria-hidden="true"
        />
        <img
          v-else-if="component.image"
          :src="component.image"
          alt="Header Image"
          class="absolute w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-300"
        >
        <div
          class="absolute inset-0 z-10"
          :style="{
            backgroundColor: toHslString(component.imageOverlay.color),
            opacity: component.imageOverlay.opacity / 100,
          }"
          @click.stop="showUploadHeaderModal = true"
        />
        <div class="flex flex-col items-center justify-center pt-5 p-6 z-10 pointer-events-none">
          <UIcon
            name="i-heroicons-camera"
            class="size-8 text-black/10 absolute top-3 left-3 pointer-events-none"
          />
          <img
            v-if="component.logo"
            :src="component.logo"
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
      <UFormField
        label="Schriftgröße Titel"
      >
        <UInputNumber
          v-model="component.titleFontSize"
          size="xl"
        />
      </UFormField>
      <div class="w-28">
        <HslPicker
          v-model:h="component.titleColor.h"
          v-model:s="component.titleColor.s"
          v-model:l="component.titleColor.l"
          label="Farbe"
        />
      </div>
    </div>
    <div class="flex gap-2">
      <UFormField
        label="Schriftgröße Beschreibung"
      >
        <UInputNumber
          v-model="component.descriptionFontSize"
          size="xl"
        />
      </UFormField>
      <div class="w-28">
        <HslPicker
          v-model:h="component.descriptionColor.h"
          v-model:s="component.descriptionColor.s"
          v-model:l="component.descriptionColor.l"
          label="Farbe"
        />
      </div>
    </div>
    <UFormField
      label="Variante"
    >
      <USelect
        v-model="component.height"
        :items="[
          { label: 'Vollbild', value: 'full' },
          { label: 'halber Bildschirm', value: 'half' },
          { label: 'automatische Höhe', value: 'auto' },
          { label: 'Box', value: 'boxed' },
        ]"
        class="w-full"
      />
    </UFormField>

    <div class="flex gap-2">
      <HslPicker
        v-model:h="component.imageOverlay.color.h"
        v-model:s="component.imageOverlay.color.s"
        v-model:l="component.imageOverlay.color.l"
        label="Hintergrund"
      />
      <UFormField
        label="Deckkraft"
        class="flex-1 pr-1"
      >
        <USlider
          v-model="component.imageOverlay.opacity"
          class="flex-1 mt-4"
        />
      </UFormField>
    </div>
    <div class="flex flex-col gap-4">
      <USwitch
        v-model="component.showShareButton"
        label="Teilen-Button anzeigen"
      />
      <div
        v-for="(link, index) in component.links"
        :key="index"
        class="flex items-start gap-2"
      >
        <IconPicker v-model:icon="link.icon" />
        <div class="flex flex-col gap-2 flex-1">
          <UInput
            v-model="link.title"
            placeholder="Instagram"
            class="flex-1"
          />
          <UInput
            v-model="link.url"
            placeholder="https://..."
            class="flex-1"
          />
        </div>
        <UButton
          icon="i-heroicons-trash"
          variant="ghost"
          color="neutral"
          @click="component.links.splice(index, 1)"
        />
      </div>
      <UButton
        label="Link hinzufügen"
        icon="i-heroicons-plus"
        variant="soft"
        color="neutral"
        @click="component.links.push({ title: '', url: '', icon: 'i-lucide-link' })"
      />
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
  </div>
</template>
