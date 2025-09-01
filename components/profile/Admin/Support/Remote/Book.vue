<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const { showSupportRemoteBook, go } = useAdmin()
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

const minDate = new CalendarDate(tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate())
</script>

<template>
  <USlideover
    :open="showSupportRemoteBook"
    side="right"
    :overlay="false"
    close-icon="i-heroicons-arrow-left"
    :close="{
      size: 'md',
      onClick: () => {
        go('#support/remote')
      }
    }"
    :ui="{
      wrapper: 'z-40',
      overlay: 'backdrop-blur-xs',
      footer: 'justify-between',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-laptop-minimal-check"
          class="inline-block size-6 opacity-50"
        />
        Fernwartung: Termin reservieren
      </h3>
    </template>

    <template #body>
      <UCalendar
        size="xl"
        :min-value="minDate"
      />
      <div class="flex items-end gap-2">
        <UFormField label="Uhrzeit">
          <USelect
            placeholder="Bitte wählen"
            class="mb-8"
            :items="[
              { label: '09:00', value: '09:00' },
              { label: '09:30', value: '09:30' },
              { label: '10:00', value: '10:00' },
              { label: '10:30', value: '10:30' },
              { label: '11:00', value: '11:00' },
              { label: '11:30', value: '11:30' },
              { label: '12:00', value: '12:00' },
              { label: '12:30', value: '12:30' },
              { label: '13:00', value: '13:00' },
              { label: '13:30', value: '13:30' },
              { label: '14:00', value: '14:00' },
              { label: '14:30', value: '14:30' },
              { label: '15:00', value: '15:00' },
              { label: '15:30', value: '15:30' },
              { label: '16:00', value: '16:00' },
              { label: '16:30', value: '16:30' },
            ]"
          />
        </UFormField>
        <UButton
          label="Termin reservieren"
          class="mb-8"
        />
      </div>
    </template>
  </USlideover>
</template>
