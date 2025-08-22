<template>
  <div
    id="header"
    class="w-full flex flex-col items-center justify-center relative z-0 overflow-hidden"
    :class="{
      'min-h-[50vh]': $profile.settings.public.header.height === 'half',
      'h-screen': $profile.settings.public.header.height === 'full',
    }"
  >
    <!-- Background video -->
    <video
      class="absolute inset-0 z-0 w-full h-full object-cover object-center pointer-events-none"
      :src="$profile.settings.public.header.video"
      :poster="$profile.settings.public.header.image || undefined"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      aria-hidden="true"
    />
    <div
      class="absolute inset-0 z-10"
      :style="{
        backgroundColor: $profile.settings.public.header.imageOverlay.color || 'transparent',
        opacity: ($profile.settings.public.header.imageOverlay.opacity || 0) / 100,
      }"
    />
    <div
      class="@container w-full flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-24 px-6 relative z-20"
    >
      <div
        v-if="$profile.settings.public.company.logo"
      >
        <a href="/">
          <NuxtImg
            :src="$profile.settings.public.company.logo"
            alt="Logo"
            class="w-32 mb-4"
          />
        </a>
      </div>
      <a href="/">
        <h1
          class="text-center text-shadow-lg font-bold mb-4 leading-none opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.5s_forwards]"
          :style="{
            'color': $profile.settings.public.header.titleColor || 'black',
            'font-size': ($profile.settings.public.header.titleFontSize || '10') + 'cqw',
          }"
        >
          {{ $profile.settings.public.header.title }}
        </h1>
      </a>
      <p
        v-if="$profile.settings.public.header.description"
        class="text-center text-shadow-md mb-4 opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.8s_forwards]"
        :style="{
          'color': $profile.settings.public.header.descriptionColor || 'black',
          'font-size': ($profile.settings.public.header.descriptionFontSize || '6') + 'cqw',
        }"
      >
        {{ $profile.settings.public.header.description }}
      </p>
      <ProfileMainLinks />
    </div>
  </div>
</template>
