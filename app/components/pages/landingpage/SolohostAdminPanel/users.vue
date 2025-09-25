<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { User } from '~~/types/db'
import { h, resolveComponent } from 'vue'

const UButton = resolveComponent('UButton')

const { data: users } = await useFetch('/api/admin/users/all')

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
  <UPopover>
    <UButton
      icon="i-heroicons-users"
      label="Benutzer"
      color="neutral"
      variant="soft"
    />

    <template #content>
      <UTable
        v-if="users"
        v-model:expanded="userExpanded"
        :data="users"
        :columns="userColumns"
        class="flex-1"
        :ui="{
          tr: 'data-[expanded=true]:bg-elevated/50',
        }"
      >
      <template #expanded="{ row }">
        <pre class="max-h-[50vh] overflow-y-auto">{{ JSON.stringify(JSON.parse(row.original.settings), null, 2) }}</pre>
      </template>
      </UTable>
    </template>
  </UPopover>
</template>