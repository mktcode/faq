<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const $profile = useNuxtApp().$profile

const { copy, copied } = useClipboard()
const { copy: copyForInstagram, copied: copiedForInstagram } = useClipboard()

function shareOnInstagram() {
  copyForInstagram($profile.canonicalUrl)
  setTimeout(() => {
    window.open('https://www.instagram.com/', '_blank')
  }, 2000)
}

function getStaggeredAnimationClass(index: number) {
  return [
    'opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_1.0s_forwards]',
    'opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_1.1s_forwards]',
    'opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_1.2s_forwards]',
    'opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_1.3s_forwards]',
    'opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_1.4s_forwards]',
    'opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_1.5s_forwards]',
    'opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_1.6s_forwards]',
    'opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_1.7s_forwards]',
    'opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_1.8s_forwards]',
    'opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_1.9s_forwards]',
  ][index]
}
</script>

<template>
  <div
    id="links"
    class="max-w-xs sm:max-w-none w-full flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 mb-4"
  >
    <template v-if="$profile.settings.public.header.links && $profile.settings.public.header.links.length > 0">
      <UButton
        v-for="(link, index) in $profile.settings.public.header.links"
        :key="index"
        :label="link.title"
        :icon="link.icon === 'none' ? undefined : link.icon"
        :href="link.url"
        target="_blank"
        class="header-link shadow-sm hover:shadow-lg transition-all w-full sm:w-auto"
        :class="getStaggeredAnimationClass(index)"
      />
    </template>

    <UPopover
      v-if="$profile.settings.public.header.showShareButton"
      class="mb-auto"
    >
      <UButton
        label="Teilen"
        icon="i-heroicons-share"
        :class="getStaggeredAnimationClass($profile.settings.public.header.links ? $profile.settings.public.header.links.length : 0)"
        class="header-link shadow-sm hover:shadow-lg transition-all w-full sm:w-auto"
      />

      <template #content>
        <div class="m-4 inline-flex flex-col gap-4 max-w-xs">
          <template v-if="$profile.isOwned && !$profile.isPublic">
            <UAlert class="max-w-sm">
              <template #description>
                Ihre Website ist noch nicht veröffentlicht. Das können Sie in der
                <UIcon
                  name="i-heroicons-bars-3"
                  class="inline-block size-5 align-middle"
                /> Administration unter
                <UIcon
                  name="i-heroicons-cog-6-tooth"
                  class="inline-block size-5 align-middle"
                /> Einstellungen ändern.
              </template>
            </UAlert>
          </template>
          <div class="text-gray-600 text-lg border border-gray-200 rounded-lg p-2 pl-3 flex items-center justify-between">
            <span>
              {{ $profile.canonicalUrl.replace(/https?:\/\//, '').replace(/\/$/, '') }}
            </span>
            <UButton
              class="ml-2"
              :label="copied ? 'kopiert!' : 'kopieren'"
              variant="soft"
              size="sm"
              @click="copy($profile.canonicalUrl)"
            />
          </div>
          <div class="flex flex-col gap-2">
            <UButton
              label="Auf Facebook teilen"
              icon="i-lucide-facebook"
              variant="soft"
              target="_blank"
              :to="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent($profile.canonicalUrl)}`"
            />
            <UButton
              :label="copiedForInstagram ? 'Link kopiert! Öffne Instagram...' : 'Auf Instagram teilen'"
              icon="i-lucide-instagram"
              variant="soft"
              @click="shareOnInstagram"
            />
            <UButton
              label="per E-Mail teilen"
              icon="i-heroicons-envelope"
              variant="soft"
              target="_blank"
              :to="`mailto:?subject=${encodeURIComponent('Schau dir meine Website an!')}&body=${encodeURIComponent(`Hier ist meine Website: ${$profile.canonicalUrl}`)}`"
            />
            <UButton
              label="Auf WhatsApp teilen"
              icon="i-ic-baseline-whatsapp"
              variant="soft"
              target="_blank"
              :to="`https://wa.me/?text=${encodeURIComponent(`Meine Website: ${$profile.canonicalUrl}`)}`"
            />
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>
