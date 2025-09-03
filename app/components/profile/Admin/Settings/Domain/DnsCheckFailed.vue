<script setup lang="ts">
defineEmits<{
  checkDns: []
}>()
defineProps<{
  isCheckingDns: boolean
}>()
</script>

<template>
  <UAlert
    title="Ihre Domain ist nicht korrekt konfiguriert."
    description="Bitte warten Sie einen Augenblick. Es kann manchmal ein paar Minuten dauern, bis die Einstellungen bei Ihrem Anbieter übernommen werden. Sollte das Problem weiterhin bestehen, überprüfen Sie bitte die DNS-Einstellungen nochmal oder kontaktieren Sie uns."
    color="error"
    variant="soft"
    :actions="[{
      label: 'DNS-Einstellungen überprüfen',
      onClick: () => $emit('checkDns'),
      color: 'error',
      loading: isCheckingDns,
    }]"
  />
</template>
