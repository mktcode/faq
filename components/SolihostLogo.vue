<script setup lang="ts">
const { beta = false } = defineProps<{
  beta?: boolean
}>()
</script>

<template>
  <div class="@container flex flex-col gap-[0.2cqw] mx-auto w-full">
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 text-white font-bold text-2xl rounded-[13px] bg-[radial-gradient(100%_100%_at_30%_20%,#58d0ff_0%,#0ea5e9_40%,#04669e_100%)] grid place-items-center shadow-[0_10px_18px_rgba(14,165,233,.35)]"
        aria-hidden="true"
      >
        S
      </div>
      <span class="font-extrabold tracking-[.2px]">Solihost</span>
    </div>
  </div>
</template>
