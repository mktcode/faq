<template>
  <div
    id="header"
    class="w-full flex flex-col items-center justify-center relative z-0 overflow-hidden"
    :class="{
      'rounded-none': $profile.settings.public.header.height === 'boxed' && $profile.settings.public.design.rounded === 'none',
      'rounded-md': $profile.settings.public.header.height === 'boxed' && $profile.settings.public.design.rounded === 'md',
      'rounded-3xl': $profile.settings.public.header.height === 'boxed' && $profile.settings.public.design.rounded === 'xl',
    }"
  >
    <slot />
  </div>
</template>
