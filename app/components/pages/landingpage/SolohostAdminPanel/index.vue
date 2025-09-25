<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { User } from '~~/types/db'
import { h, resolveComponent } from 'vue'

const UButton = resolveComponent('UButton')

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

const userExpanded = ref({ 1: false })
const userColumns: TableColumn<User>[] = [
  {
    id: 'expand',
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: 'i-lucide-chevron-down',
        square: true,
        'aria-label': 'Expand',
        ui: {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-200 rotate-180' : ''
          ]
        },
        onClick: () => row.toggleExpanded()
      })
  },
  {
    accessorKey: 'id',
    header: '#',
  },
  {
    accessorKey: 'userName',
    header: 'Benutzername',
  },
  {
    accessorKey: 'email',
    header: 'E-Mail',
  },
  {
    accessorKey: 'plan',
    header: 'Paket',
    cell: ({ row }) => row.getValue('plan') || 'Kein Paket'
  },
  {
    accessorKey: 'lastPaidAt',
    header: 'Letzte Zahlung',
    cell: ({ row }) => new Date(row.getValue('lastPaidAt')).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  }
]
</script>

<template>
  <div class="p-4">
    <div class="w-[92vw] max-w-[1200px] mx-auto flex items-center gap-2">
      <PagesLandingpageSolohostAdminPanelSupportBooking />
      <PagesLandingpageSolohostAdminPanelUsers />
    </div>
  </div>
</template>