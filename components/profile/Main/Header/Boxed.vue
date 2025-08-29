<template>
  <div class="max-w-xl mx-auto pt-4 px-4 sm:pt-8 sm:px-8 overflow-hidden">
    <ProfileMainHeaderVideo v-if="$profile.settings.public.header.video">
      <ProfileMainHeaderContent />
    </ProfileMainHeaderVideo>
    <ProfileMainHeaderImage v-else>
      <ProfileMainHeaderContent />
    </ProfileMainHeaderImage>
  </div>
</template>
