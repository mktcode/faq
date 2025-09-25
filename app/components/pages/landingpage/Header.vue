<script setup lang="ts">
const { public: { appHost } } = useRuntimeConfig()
const { user } = useUserSession()
const { colorMode, toggleColorMode } = useColorMode()

const { isSupportAvailable } = useSupportAvailability()
</script>

<template>
  <header class="sticky top-0 z-50 backdrop-saturate-150 backdrop-blur bg-[linear-gradient(180deg,rgba(255,255,255,.9),rgba(255,255,255,.65)_60%,rgba(255,255,255,0))] dark:bg-[linear-gradient(180deg,rgba(11,16,32,.9),rgba(11,16,32,.75)_60%,rgba(11,16,32,0))]">
    <div class="mx-auto w-[92vw] max-w-[1200px] py-[14px]">
      <div class="flex items-center justify-between">
        <SolohostLogo />
        <div class="flex-col sm:flex-row flex items-end gap-2">
          <div class="flex items-center gap-2">
            <UButton
              :icon="colorMode === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              variant="ghost"
              color="neutral"
              class="font-normal md:px-4 md:py-2 md:text-base"
              size="md"
              @click="toggleColorMode"
            />
            <UButton
              variant="ghost"
              color="neutral"
              class="font-normal md:px-4 md:py-2 md:text-base"
              size="md"
            >
              <template #default>
                <UChip
                  :color="isSupportAvailable ? 'success' : 'neutral'"
                  size="xl"
                  class="mx-2"
                  :class="{ 'opacity-20': !isSupportAvailable }"
                />
                {{ isSupportAvailable ? 'verfügbar' : 'nicht verfügbar' }}
              </template>
            </UButton>
          </div>
          <UButton
            :label="user ? 'zu Ihrer Website' : 'Anmelden'"
            trailing-icon="i-lucide-arrow-right"
            :href="user ? `https://${user.userName}.${appHost}` : '/login'"
            variant="ghost"
            color="neutral"
            class="font-normal md:px-4 md:py-2 md:text-base"
            size="md"
          />
        </div>
      </div>
    </div>
  </header>
</template>
