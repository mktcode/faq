<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const { username } = defineProps<{
  username: string
}>()

const { public: { appHost } } = useRuntimeConfig()

const { me } = await useMe()
const myLastUsername = useLocalStorage('myLastUsername', () => me.value?.userName || null)
const onOwnProfile = computed(() => username === myLastUsername.value)

const showSettingsModal = useState('showSettingsModal', () => false)
</script>

<template>
  <div
    class="flex flex-row md:items-center md:justify-between p-4 absolute z-10 w-full gap-2"
  >
    <div class="flex flex-col md:flex-row gap-2">
      <UButton
        v-if="me && !onOwnProfile"
        :to="`https://${me.userName}.${appHost}`"
        label="Eigenes Profil"
        icon="i-heroicons-user-circle"
        variant="ghost"
        size="md"
      />

      <UButton
        v-if="!me && onOwnProfile"
        :to="`https://${appHost}/login`"
        label="Anmelden"
        icon="i-heroicons-arrow-right-on-rectangle"
        size="md"
      />

      <UButton
        v-if="me && onOwnProfile"
        label="Einstellungen"
        icon="i-heroicons-cog-6-tooth"
        size="md"
        @click="showSettingsModal = true"
      />
    </div>
  </div>
</template>
