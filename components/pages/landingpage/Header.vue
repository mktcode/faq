<script setup lang="ts">
const { public: { appHost } } = useRuntimeConfig()
const { user } = useUserSession()
const { colorMode, toggleColorMode } = useColorMode()
</script>

<template>
  <header class="sticky top-0 z-50 backdrop-saturate-150 backdrop-blur bg-[linear-gradient(180deg,rgba(255,255,255,.9),rgba(255,255,255,.65)_60%,rgba(255,255,255,0))] dark:bg-[linear-gradient(180deg,rgba(11,16,32,.9),rgba(11,16,32,.75)_60%,rgba(11,16,32,0))]">
    <div class="mx-auto max-w-[1200px] flex items-center justify-between py-[14px]">
      <SolohostLogo />
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="opacity-50 hover:opacity-100 inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-[12px] font-semibold tracking-[.2px] text-slate-900 transition duration-200 dark:text-[#e7ecf4]"
          aria-label="Farbschema wechseln"
          :title="colorMode === 'dark' ? 'Tagmodus' : 'Nachtmodus'"
          @click="toggleColorMode"
        >
          <UIcon
            v-if="colorMode === 'dark'"
            name="i-heroicons-sun"
            size="20"
          />
          <UIcon
            v-else
            name="i-heroicons-moon"
            size="20"
          />
        </button>
        <a
          class="whitespace-nowrap inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-[12px] font-semibold tracking-[.2px] border border-slate-900/10 bg-white/10 text-slate-900 backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md transition duration-200 hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-[#e7ecf4]"
          :href="user ? `https://${user.userName}.${appHost}` : '/login'"
          aria-label="Anmelden"
        >
          <span>
            {{ user ? 'zur Website' : 'Anmelden' }}
          </span>
        </a>
      </div>
    </div>
  </header>
</template>
