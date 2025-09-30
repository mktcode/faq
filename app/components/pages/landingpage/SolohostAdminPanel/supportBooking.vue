<script setup lang="ts">
const toast = useToast()
const { data: users } = await useFetch('/api/admin/users/all')
const { data: nextSupportBookings, refresh: refreshNextSupportBookings } = await useFetch('/api/admin/supportBookings/next')

const supportUserId = ref<number | null>(null)
const supportDateTime = ref<string | null>(null)
const supportDay = computed(() => supportDateTime.value ? supportDateTime.value.split('T')[0] : null)
const supportTime = computed(() => supportDateTime.value ? supportDateTime.value.split('T')[1] : null)
const supportNotes = ref<string>("")
const isSavingSupportBooking = ref(false)

async function saveSupportDateTime() {
  if (isSavingSupportBooking.value) return
  if (!supportDay.value || !supportTime.value) {
    alert('Bitte Datum/Uhrzeit auswählen.')
    return
  }
  isSavingSupportBooking.value = true
  try {
    await $fetch('/api/admin/supportBookings', {
      method: 'POST',
      body: {
        userId: supportUserId.value,
        day: supportDay.value,
        time: supportTime.value,
        notes: supportNotes.value
      }
    })
    refreshNextSupportBookings()
  } catch (error) {
    toast.add({
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
      title: 'Fehler',
      description: 'Fehler beim Speichern des Support-Termins.',
      progress: false,
    })
  } finally {
    isSavingSupportBooking.value = false
  }
}
</script>

<template>
  <UPopover :ui="{ content: 'p-2 flex flex-col gap-2' }">
    <UButton
      icon="i-heroicons-calendar"
      label="Termin eintragen"
      color="neutral"
      variant="soft"
    />

    <template #content>
      <USelect
        v-model="supportUserId"
        :items="[
          { label: 'Kein Benutzer', value: null },
          ...(users || []).map(user => ({ label: user.userName, value: user.id }))
        ]"
        label="Benutzer"
        placeholder="Benutzer auswählen"
      />
      <UInput
        type="datetime-local"
        v-model="supportDateTime"
        label="Support-Termin"
      />
      <UTextarea
        v-model="supportNotes"
        label="Notizen"
        placeholder="Notizen zum Termin"
        :rows="3"
      />
      <UButton
        label="Termin Speichern"
        color="primary"
        :loading="isSavingSupportBooking"
        @click="saveSupportDateTime"
      />
      <div>
        <h3 class="font-bold mb-2">Nächste Termine</h3>
        <div v-for="booking in nextSupportBookings" :key="booking.id" class="flex flex-col">
          <div class="font-semibold">{{ new Date(booking.date).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) }}</div>
          <div
            v-if="booking.userId"
            class="text-sm text-gray-500"
          >
            {{ booking.userName }} (#{{ booking.userId }})
          </div>
          <div v-else class="text-sm text-gray-500">Kein Benutzer</div>
          <div class="text-sm text-gray-500">{{ booking.notes }}</div>
        </div>
        <p v-if="!nextSupportBookings || nextSupportBookings.length === 0">Keine nächsten Termine.</p>
      </div>
    </template>
  </UPopover>
</template>