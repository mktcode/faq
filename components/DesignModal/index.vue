<script setup lang="ts">
const showModal = useState('showDesignModal', () => false)
const toast = useToast()
const { settings, saveSettings, isSubscribed } = await useProfile()

const headerImageInput = ref<HTMLInputElement | null>(null)
const headerVideoInput = ref<HTMLInputElement | null>(null)
const logoInput = ref<HTMLInputElement | null>(null)
const showUploadHeaderModal = ref(false)
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

    settings.value.header.image = imageUrls[0] || ''

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
    const { videoUrl } = await $fetch('/api/user/upload/video', {
      method: 'POST',
      body: formData,
    })

    settings.value.header.video = videoUrl || ''

    await saveSettings()

    // Clear the input to allow selecting the same file again
    if (headerVideoInput.value) {
      headerVideoInput.value.value = ''
    }
  }
  catch (error) {
    console.error('Error uploading files:', error)
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
    settings.value.company.logo = imageUrl ? `${imageUrl}?${randomSuffix}` : ''

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
  const url = image === 'logo' ? settings.value.company.logo : settings.value.header.image

  const { success } = await $fetch('/api/user/upload/delete', {
    method: 'POST',
    body: JSON.stringify({ url }),
  })

  if (!success) {
    toast.add({
      title: 'Fehler',
      description: 'Die Datei konnte nicht gelöscht werden.',
      color: 'error',
    })
    return
  }

  if (image === 'logo') {
    settings.value.company.logo = ''
  }
  else {
    settings.value.header.image = ''
  }

  saveSettings()
}
</script>

<template>
  <UDrawer
    v-model:open="showModal"
    side="left"
    close-icon="i-heroicons-arrow-left"
    handle-only
    :overlay="false"
    :close-threshold="0.85"
    :close="{
      size: 'md',
    }"
    :ui="{
      content: 'shadow-2xl shadow-black',
      container: 'max-w-lg mx-auto',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-paint-brush"
          class="inline-block size-6 opacity-50"
        />
        Design &amp; Kopfbereich
      </h3>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
        <div class="flex gap-2">
          <ColorPicker
            v-model:color="settings.design.color"
            label="Primäre Farbe"
          />
          <UFormField
            label="Stil"
            class="flex-1"
          >
            <USelect
              v-model="settings.design.rounded"
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
          <FontPicker v-model:font="settings.design.font" />
        </UFormField>
        <div class="flex gap-2">
          <UFormField
            label="Titel"
            class="flex-1 w-full"
          >
            <UInput
              v-model="settings.header.title"
              placeholder="Gib den Titel deines Unternehmens ein"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Schriftgröße"
            class="w-28"
          >
            <UInputNumber
              v-model="settings.header.titleFontSize"
              size="xl"
            />
          </UFormField>
          <div class="w-28">
            <ColorPicker
              v-model:color="settings.header.titleColor"
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
              v-model="settings.header.description"
              placeholder="Gib eine kurze Beschreibung deines Unternehmens ein"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Schriftgröße"
            class="w-28"
          >
            <UInputNumber
              v-model="settings.header.descriptionFontSize"
              size="xl"
            />
          </UFormField>
          <div class="w-28">
            <ColorPicker
              v-model:color="settings.header.descriptionColor"
              label="Farbe"
            />
          </div>
        </div>
        <div class="p-1 border border-gray-200 rounded-lg flex flex-col gap-2">
          <div
            class="@container group relative flex flex-col items-center justify-center w-full rounded-lg cursor-pointer transition-all overflow-hidden hover:bg-gray-100"
          >
            <video
              v-if="settings.header.video"
              class="absolute inset-0 z-0 w-full h-full object-cover object-center pointer-events-none"
              :src="settings.header.video"
              :poster="settings.header.image || undefined"
              autoplay
              muted
              loop
              playsinline
              preload="auto"
              aria-hidden="true"
            />
            <img
              v-else-if="settings.header.image"
              :src="settings.header.image"
              alt="Header Image"
              class="absolute w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-300"
            >
            <div
              class="absolute inset-0 z-10"
              :style="{
                backgroundColor: settings.header.imageOverlay.color || 'transparent',
                opacity: settings.header.imageOverlay.opacity / 100,
              }"
              @click.stop="showUploadHeaderModal = true"
            />
            <div class="flex flex-col items-center justify-center pt-5 p-6 z-10 pointer-events-none">
              <UIcon
                name="i-heroicons-camera"
                class="size-8 text-black/10 absolute top-3 left-3 pointer-events-none"
              />
              <img
                v-if="settings.company.logo"
                :src="settings.company.logo"
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
            v-if="settings.header.image || settings.company.logo"
            class="flex items-center justify-end gap-2"
          >
            <UButton
              v-if="settings.company.logo"
              label="Logo entfernen"
              icon="i-heroicons-trash"
              variant="ghost"
              color="error"
              size="sm"
              @click="deleteImage('logo')"
            />
            <UButton
              v-if="settings.header.image"
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
          <ColorPicker
            v-model:color="settings.header.imageOverlay.color"
            label="Hintergrund"
          />
          <UFormField
            label="Deckkraft"
            class="flex-1"
          >
            <USlider
              v-model="settings.header.imageOverlay.opacity"
              class="flex-1 mt-4"
            />
          </UFormField>
        </div>
        <UFormField
          label="Höhe"
        >
          <USelect
            v-model="settings.header.height"
            :items="[
              { label: 'Automatisch', value: 'auto' },
              { label: 'Hälfte', value: 'half' },
              { label: 'Voll', value: 'full' },
            ]"
            class="w-full"
          />
        </UFormField>
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
            :disabled="!isSubscribed"
          >
            <template #trailing>
              <div class="ml-auto flex items-center gap-2">
                <UBadge
                  v-if="!isSubscribed"
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
              v-model="settings.css"
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
        <UButton
          label="Einstellungen speichern"
          variant="solid"
          color="primary"
          @click="saveSettings"
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
            :disabled="!isSubscribed"
          >
            <template #trailing>
              <UBadge
                v-if="!isSubscribed"
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
            :disabled="!isSubscribed"
            @click="clickHeaderVideoInput"
          >
            <template #trailing>
              <UBadge
                v-if="!isSubscribed"
                label="Premium"
                variant="outline"
                class="ml-auto"
              />
            </template>
          </UButton>
        </template>
      </UModal>
    </template>
  </UDrawer>
</template>
