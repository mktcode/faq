<template>
  <ProfileAdminSettingsDomainSubscribedDetails v-if="$profile.domain" />
  <template v-else>
    <p class="text-gray-500">
      Wenn Sie bereits eine eigene Domain besitzen, können Sie diese für Ihre Website und E-Mail-Postfächer bei uns nutzen.
    </p>
    <ProfileAdminSettingsDomainSubscribedExistingSetup />
    <p class="text-gray-500">
      Alternativ können Sie eine neue Domain direkt über uns registrieren.
    </p>
    <ProfileAdminSettingsDomainSubscribedNewSetup />
  </template>
</template>
