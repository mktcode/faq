<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import type { HeaderComponentSchema } from '~~/types/db';

defineProps<{
  component: HeaderComponentSchema;
}>()

const { $profile } = useProfile()
const { go } = useAdmin()

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
    <template v-if="component.links && component.links.length > 0">
      <UButton
        v-for="(link, index) in component.links"
        :key="index"
        :icon="link.icon?.startsWith('https://') ? undefined : link.icon"
        :href="link.url"
        target="_blank"
        class="shadow-sm hover:shadow-lg transition-all w-full sm:w-auto"
        :class="getStaggeredAnimationClass(index)"
      >
        <template #default>
          <img
            v-if="link.icon?.startsWith('https://')"
            :src="link.icon"
            alt=""
            class="inline-block max-w-8 max-h-8 align-middle"
          />
          {{ link.title }}
        </template>
      </UButton>
    </template>

    <UPopover
      v-if="component.showShareButton"
      class="mb-auto"
    >
      <UButton
        label="Website Teilen"
        icon="i-heroicons-share"
        :class="getStaggeredAnimationClass(component.links ? component.links.length : 0)"
        class="shadow-sm hover:shadow-lg transition-all w-full sm:w-auto"
      />

      <template #content>
        <div class="m-4 inline-flex flex-col gap-4 max-w-xs">
          <template v-if="($profile.isOwned || $profile.isAdmin) && !$profile.isPublic">
            <UAlert
              class="max-w-sm"
              variant="soft"
              :actions="[
                {
                  label: 'Website',
                  variant: 'soft',
                  size: 'lg',
                  icon: 'i-lucide-monitor-smartphone',
                  onClick: () => go('#website'),
                },
                {
                  label: 'Unternehmensdaten',
                  variant: 'soft',
                  size: 'lg',
                  icon: 'i-heroicons-building-office-2',
                  onClick: () => go('#settings/company'),
                },
              ]"
            >
              <template #description>
                Ihre Website ist noch nicht veröffentlicht. Das können Sie unter
                <UIcon
                  name="i-lucide-monitor-smartphone"
                  class="inline-block size-5 align-middle"
                /> <strong>Website</strong> ändern. Zuvor müssen Sie Ihre Unternehmensdaten vollständig ausfüllen.
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
