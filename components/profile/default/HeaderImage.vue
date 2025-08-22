<template>
  <div
    id="header"
    :style="{ backgroundImage: $profile.settings.header.image ? `url(${$profile.settings.header.image})` : 'none' }"
    class="w-full flex flex-col items-center justify-center bg-cover bg-center relative z-0"
    :class="{
      'min-h-[50vh]': $profile.settings.header.height === 'half',
      'h-screen': $profile.settings.header.height === 'full',
    }"
  >
    <div
      class="absolute inset-0 z-0"
      :style="{
        backgroundColor: $profile.settings.header.imageOverlay.color || 'transparent',
        opacity: ($profile.settings.header.imageOverlay.opacity || 0) / 100,
      }"
    />
    <div
      class="@container w-full flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-24 px-6 relative z-10"
    >
      <div
        v-if="$profile.settings.company.logo"
      >
        <a href="/">
          <NuxtImg
            :src="$profile.settings.company.logo"
            alt="Logo"
            class="w-32 mb-4"
          />
        </a>
      </div>
      <a href="/">
        <h1
          class="text-center text-shadow-lg font-bold mb-4 leading-none opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.5s_forwards]"
          :style="{
            'color': $profile.settings.header.titleColor || 'black',
            'font-size': ($profile.settings.header.titleFontSize || '10') + 'cqw',
          }"
        >
          {{ $profile.settings.header.title }}
        </h1>
      </a>
      <p
        v-if="$profile.settings.header.description"
        class="text-center text-shadow-md mb-4 opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.8s_forwards]"
        :style="{
          'color': $profile.settings.header.descriptionColor || 'black',
          'font-size': ($profile.settings.header.descriptionFontSize || '6') + 'cqw',
        }"
      >
        {{ $profile.settings.header.description }}
      </p>
      <ProfileDefaultLinks />
    </div>
  </div>
</template>
