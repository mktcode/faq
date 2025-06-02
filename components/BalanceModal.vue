<script setup lang="ts">
const showModal = defineModel('show', {
  default: true,
  type: Boolean,
})

const { data: me, refresh: refreshUser } = await useFetch('/api/user/me')

const showTopupManualModal = ref(false)
const showTopupOnlineModal = ref(false)
const isUpdatingUserBalance = ref(false)

async function updateUserBalance() {
  isUpdatingUserBalance.value = true
  await $fetch('/api/user/updateBalance', { method: 'POST' })
  await refreshUser()
  isUpdatingUserBalance.value = false
}

onMounted(() => {
  updateUserBalance()
})
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UAlert
          v-if="me && me.balance < 0"
          color="error"
        >
          <template #description>
            <div class="flex flex-col gap-2">
              <div class="text-lg font-bold">
                Ihr Guthaben ist negativ!
              </div>
              Sie können Solihost erst wieder nutzen, wenn Sie Ihr Guthaben aufgeladen haben.
              Ihre Website ist weiterhin erreichbar und Sie empfangen weiterhin E-Mails.
              Gelöscht werden Ihre Inhalte erst, wenn Sie 3 Monate lang kein Guthaben aufladen.
            </div>
          </template>
        </UAlert>
        <div class="flex gap-4 items-start justify-between w-full">
          <div>
            <div class="text-base text-sky-600 font-bold leading-none">
              Ihr Guthaben
            </div>
            <div class="text-5xl font-bold text-sky-950 mb-4">
              {{ formatPrice(me?.balance || 0) }}
            </div>
            <div class="text-sm text-sky-600 font-bold leading-none">
              Ihr Preis
            </div>
            <div class="text-2xl font-bold text-sky-950 mb-1">
              {{ formatPrice(me?.balance || 0) }}
            </div>
            <div class="text-sm text-gray-400 leading-tight">
              <div>1 € Basispreis</div>
              <div>+0,50 € für 5 GB extra Mail-Speicher</div>
              <div>5 € für professionelle Website</div>
              <div>1 € für E-Rechnungen</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-base text-gray-400 font-bold leading-none mt-auto">
              Reicht für:
            </div>
            <div class="text-lg text-gray-800 font-bold mb-2">
              0 Monate
            </div>
            <div class="text-base text-gray-400 font-bold leading-none mt-auto">
              Nächste Abbuchung:
            </div>
            <div class="text-lg text-gray-800 font-bold">
              {{ new Date().toLocaleDateString() }}
            </div>
          </div>
        </div>
        <div class="w-full flex gap-2 justify-between">
          <UButton
            label="Per Überweisung"
            icon="i-heroicons-document-text"
            variant="soft"
            class="flex-1"
            @click="showTopupManualModal = true"
          />
          <UButton
            icon="i-heroicons-cursor-arrow-rays"
            label="Online"
            class="flex-1"
            variant="soft"
            @click="showTopupOnlineModal = true"
          />
        </div>
        <UButton
          icon="i-heroicons-arrows-up-down"
          label="Buchungen"
          class="flex-1"
          variant="ghost"
          trailing-icon="i-heroicons-chevron-down"
          :ui="{
            trailingIcon: 'ml-auto',
          }"
        />
      </div>

      <TopupManualModal v-model:open="showTopupManualModal" />
      <ClientOnly>
        <TopupOnlineModal
          v-model:open="showTopupOnlineModal"
          :price="15"
        />
      </ClientOnly>
    </template>
  </UModal>
</template>
