<script setup lang="ts">
const toast = useToast()

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
  title: currentSettings.value?.title || '',
  description: currentSettings.value?.description || '',
  headerImage: currentSettings.value?.headerImage || '',
  headerImageOverlay: currentSettings.value?.headerImageOverlay || {
    color: 'white',
    opacity: 50,
  },
  headerTitleFontSize: currentSettings.value?.headerTitleFontSize || 5,
  headerTitleColor: currentSettings.value?.headerTitleColor || 'white',
  headerDescriptionFontSize: currentSettings.value?.headerDescriptionFontSize || 3,
  headerDescriptionColor: currentSettings.value?.headerDescriptionColor || 'white',
  color: currentSettings.value?.color || 'sky',
  font: currentSettings.value?.font || 'roboto',
  rounded: currentSettings.value?.rounded || 'md',
  logo: currentSettings.value?.logo || '',
})

async function saveSettings() {
  await $fetch('/api/user/settings', {
    method: 'POST',
    body: form.value,
  })
  toast.add({
    title: 'Einstellungen gespeichert',
    description: 'Deine Einstellungen wurden erfolgreich gespeichert.',
    color: 'success',
  })
}

const headerImageInput = ref<HTMLInputElement | null>(null)
const logoInput = ref<HTMLInputElement | null>(null)

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

    form.value.headerImage = imageUrls[0] || ''

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
    form.value.logo = imageUrl ? `${imageUrl}?${randomSuffix}` : ''

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
}

const handleLogoInputChange = () => {
  uploadLogo(logoInput.value?.files ? logoInput.value.files[0] : null)
}

const clickHeaderImageInput = () => {
  if (headerImageInput.value) {
    headerImageInput.value.click()
  }
}

const clickLogoInput = () => {
  if (logoInput.value) {
    logoInput.value.click()
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <div class="flex gap-2">
      <UFormField
        label="Titel"
        class="flex-1 w-full"
      >
        <UInput
          v-model="form.title"
          placeholder="Gib den Titel deines Unternehmens ein"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Schriftgröße"
        class="w-28"
      >
        <UInputNumber
          v-model="form.headerTitleFontSize"
          size="xl"
        />
      </UFormField>
      <div class="w-28">
        <ColorPicker
          v-model:color="form.headerTitleColor"
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
          v-model="form.description"
          placeholder="Gib eine kurze Beschreibung deines Unternehmens ein"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Schriftgröße"
        class="w-28"
      >
        <UInputNumber
          v-model="form.headerDescriptionFontSize"
          size="xl"
        />
      </UFormField>
      <div class="w-28">
        <ColorPicker
          v-model:color="form.headerDescriptionColor"
          label="Farbe"
        />
      </div>
    </div>
    <div class="p-1 border border-gray-200 rounded-lg flex flex-col gap-2">
      <div
        class="@container group relative flex flex-col items-center justify-center w-full rounded-lg cursor-pointer transition-all overflow-hidden hover:bg-gray-100"
      >
        <img
          v-if="form.headerImage"
          :src="form.headerImage"
          alt="Header Image"
          class="absolute w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-300"
        >
        <div
          class="absolute inset-0 z-10"
          :class="getColorClass(form.headerImageOverlay.color)"
          :style="{ opacity: form.headerImageOverlay.opacity / 100 }"
          @click.stop="clickHeaderImageInput"
        />
        <div class="flex flex-col items-center justify-center pt-5 p-6 z-10 pointer-events-none">
          <UIcon
            name="i-heroicons-camera"
            class="size-8 text-black/10 absolute top-3 left-3 pointer-events-none"
          />
          <img
            v-if="form.logo"
            :src="form.logo"
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
          <FontWrapper
            :font="form.font"
            class="text-center"
          >
            <h1
              v-if="form.title"
              class="text-lg font-semibold mt-2 leading-none"
              :class="getColorClass(form.headerTitleColor, 'text')"
              :style="{ 'font-size': form.headerTitleFontSize + 'cqw' }"
            >
              {{ form.title }}
            </h1>
            <p
              v-if="form.description"
              class="text-sm mt-1"
              :class="getColorClass(form.headerDescriptionColor, 'text')"
              :style="{ 'font-size': form.headerDescriptionFontSize + 'cqw' }"
            >
              {{ form.description }}
            </p>
            <div
              v-if="currentSettings?.links && currentSettings?.links.length"
              class="mt-4 flex flex-wrap items-center justify-center gap-2"
            >
              <UButton
                v-for="link in currentSettings.links"
                :key="link.url"
                :label="link.title"
                :href="link.url"
                size="sm"
                :class="getColorClass(form.color, 'bg')"
              />
            </div>
          </FontWrapper>
        </div>
        <input
          ref="headerImageInput"
          type="file"
          class="hidden"
          capture
          multiple
          @change="handleHeaderImageInputChange"
        >
        <input
          ref="logoInput"
          type="file"
          class="hidden"
          capture
          @change="handleLogoInputChange"
        >
      </div>
      <div
        v-if="form.headerImage || form.logo"
        class="flex items-center justify-end gap-2"
      >
        <UButton
          v-if="form.logo"
          label="Logo entfernen"
          icon="i-heroicons-trash"
          variant="ghost"
          color="error"
          size="sm"
          @click="form.logo = ''"
        />
        <UButton
          v-if="form.headerImage"
          label="Bild entfernen"
          icon="i-heroicons-trash"
          variant="ghost"
          color="error"
          size="sm"
          @click="form.headerImage = ''"
        />
      </div>
    </div>
    <div class="flex gap-2">
      <ColorPicker
        v-model:color="form.headerImageOverlay.color"
        :label="undefined"
      />
      <USlider
        v-model="form.headerImageOverlay.opacity"
        class="flex-1"
      />
    </div>
    <div class="flex gap-2">
      <ColorPicker
        v-model:color="form.color"
        label="Primäre Farbe"
      />
      <UFormField
        label="Stil"
        class="flex-1"
      >
        <USelect
          v-model="form.rounded"
          class="w-full"
          :items="[
            { label: 'Eckig', value: 'none' },
            { label: 'Rund', value: 'md' },
            { label: 'Sehr rund', value: 'xl' },
          ]"
        />
      </UFormField>
    </div>
    <FontPicker v-model:font="form.font" />
    <UButton
      label="Individuelles Design"
      variant="soft"
      color="primary"
      icon="i-heroicons-sparkles"
    />
    <UButton
      variant="solid"
      color="primary"
      @click="saveSettings"
    >
      Einstellungen speichern
    </UButton>
  </div>
</template>
