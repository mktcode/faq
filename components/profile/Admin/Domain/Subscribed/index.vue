<template>
  <ProfileAdminDomainSubscribedDetails v-if="$profile.domain" />
  <template v-else>
    <p class="text-gray-500">
      Ihre Website ist aktuell unter <strong>{{ $profile.username }}.solohost.de</strong> erreichbar.
      Wenn Sie bereits eine Domain besitzen, können Sie diese für Ihre Website bei uns nutzen.
      Ansonsten können Sie jetzt eine neue Domain registrieren, die dann auch automatisch richtig konfiguriert ist.
    </p>
    <ProfileAdminDomainSubscribedNewSetup />
    <ProfileAdminDomainSubscribedExistingSetup />
  </template>
</template>
