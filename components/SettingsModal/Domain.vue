<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'

const { appIp } = useRuntimeConfig().public
const { me, refreshMe } = await useMe()
const emit = defineEmits(['goToSubscription'])

const existingDomainSetupOpen = ref(false)
const existingDomain = ref('')
const isACorrect = ref(false)
const hasBeenChecked = ref(false)
const domainConnectedSuccessfully = ref(false)

async function checkDns() {
  existingDomain.value = existingDomain.value.replace(/^https?:\/\//, '').replace(/^www\./, '')
  const result = await $fetch('/api/domain/checkDns', {
    method: 'POST',
    body: { domain: existingDomain.value },
  })

  hasBeenChecked.value = true
  isACorrect.value = result.isACorrect
}

async function updateDomain() {
  const { success } = await $fetch('/api/user/updateDomain', {
    method: 'POST',
    body: { domain: existingDomain.value },
  })

  if (success) {
    await refreshMe()
    domainConnectedSuccessfully.value = true
    existingDomainSetupOpen.value = false
    existingDomain.value = ''
  }
}

watchDebounced(existingDomain, checkDns, { debounce: 750 })
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <template v-if="me?.isSubscribed">
      <p class="text-gray-600">
        Domaineinstellungen...
      </p>
    </template>
    <template v-else>
      <Transition name="fade">
        <UAlert
          v-if="domainConnectedSuccessfully"
          title="Domain erfolgreich verbunden!"
          icon="i-heroicons-check"
          :description="`Sie können Ihre Website jetzt über ${me?.domain} erreichen. Ihre bisherige Subdomain ${ me?.userName }.solihost.de leitet nun dorthin weiter.`"
          color="primary"
          close
          @update:open="domainConnectedSuccessfully = false"
          :ui="{
            close: 'text-primary-100 hover:text-primary-50 active:text-primary-200',
          }"
        />
      </Transition>
      <p
        v-if="me?.domain"
        class="text-gray-500"
      >
        Ihre Website ist unter <strong>{{ me?.domain }}</strong> erreichbar. Benötigen Sie noch eine passende E-Mail-Adresse,
        z.B. <strong>info@{{ me?.domain }}</strong>?
      </p>
      <p
        v-else
        class="text-gray-500"
      >
        Ihre Website ist aktuell unter <strong>{{ me?.userName }}.solihost.de</strong> erreichbar.
        Eine eigene Domain und ein E-Mail-Postfach sind in unserem <strong>Abonnement</strong> inklusive.
        Wenn Sie bereits eine Domain besitzen, können Sie diese für Ihre Website bei uns nutzen.
      </p>

      <UButton
        :label="me?.domain ? `Abonnieren und E-Mail-Postfach anlegen` : `Abonnieren und neue Domain registrieren`"
        trailing-icon="i-heroicons-rocket-launch"
        color="primary"
        :ui="{
          trailingIcon: 'ml-auto',
        }"
        @click="emit('goToSubscription')"
      />
      <UCollapsible
        v-model:open="existingDomainSetupOpen"
        class="flex flex-col gap-2"
        :ui="{
          root: 'border border-primary-500 rounded-lg',
          content: 'flex flex-col gap-2 px-3 pb-3',
        }"
      >
        <UButton
          :label="me?.domain ? 'Domain ändern' : 'Existierende Domain verbinden'"
          color="primary"
          variant="link"
          trailing-icon="i-heroicons-chevron-down"
          :ui="{
            trailingIcon: `ml-auto transition-transform ${existingDomainSetupOpen ? 'rotate-180' : ''}`,
          }"
        />

        <template #content>
          <p class="text-gray-500">
            Dazu gehen Sie zu Ihrem Domain-Anbieter und suchen eine Option wie "DNS-Einstellungen" oder "Records bearbeiten".
          </p>

          <p class="text-gray-500">
            Dort legen Sie einen Eintrag vom <strong>Typ A</strong> mit dem Wert <strong>{{ appIp }}</strong> an.
            Wenn Sie das getan haben, geben Sie hier Ihre Domain ein.
          </p>

          <UInput
            v-model="existingDomain"
            placeholder="ihre-domain.de"
            class="w-full"
            size="xxl"
          />

          <UButton
            v-if="hasBeenChecked && isACorrect"
            label="Domain verbinden"
            @click="updateDomain"
          />
          <UAlert
            v-else-if="hasBeenChecked && !isACorrect"
            title="Ihre Domain ist nicht korrekt konfiguriert."
            color="warning"
            variant="outline"
          />

          <UAlert
            title="Benötigen Sie Hilfe?"
            variant="soft"
            icon="i-lucide-headset"
          >
            <template #description>
              Sie können uns jederzeit unter <strong>support@solihost.de</strong> oder telefonisch unter <strong>0176 70 86 46 27</strong> erreichen.
            </template>
          </UAlert>
        </template>
      </UCollapsible>
    </template>
  </div>
</template>
