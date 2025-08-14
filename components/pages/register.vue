<script setup lang="ts">
const appConfig = useAppConfig()
const { user } = useUserSession()
const { appHost } = useRuntimeConfig().public

if (user.value) {
  navigateTo(`https://${user.value.userName}.${appHost}`, { external: true })
}

appConfig.ui.colors.primary = 'sky'
</script>

<template>
  <div class="flex flex-col justify-between gap-12 max-w-xl mx-auto p-6">
    <SolihostLogo class="max-w-[150px] mb-12" />
    <div>
      <h1 class="text-5xl font-bold text-center mb-20">
        Alles klar,<br>legen wir los!
      </h1>
      <RegisterForm />
    </div>
    <div />
  </div>
</template>
