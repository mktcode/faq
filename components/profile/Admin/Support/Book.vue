<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'

const { showSupportBook, go } = useAdmin()

const theDayAfterTomorrow = new Date()
theDayAfterTomorrow.setDate(theDayAfterTomorrow.getDate() + 2)
const theDayInThreeMonths = new Date()
theDayInThreeMonths.setMonth(theDayInThreeMonths.getMonth() + 3)
const minDate = new CalendarDate(theDayAfterTomorrow.getFullYear(), theDayAfterTomorrow.getMonth() + 1, theDayAfterTomorrow.getDate())
const maxDate = new CalendarDate(theDayInThreeMonths.getFullYear(), theDayInThreeMonths.getMonth() + 1, theDayInThreeMonths.getDate())

const selectedDate = ref<CalendarDate>()
const selectedTime = ref<string>()
const selectedRemote = ref(false)

const { data: supportBookings } = await useFetch('/api/supportBookings')
const { data: userSupportBookings } = await useFetch(`/api/user/supportBookings`)

function isDateDisabled(date: DateValue) {
  const dateObj = date.toDate('UTC')

  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6

  return isWeekend
}

function isDateUnavailable(date: DateValue) {
  const isFree = supportBookings.value?.some((booking) => {
    const bookingDate = new Date(booking.date)
    return (
      bookingDate.getFullYear() === date.year &&
      bookingDate.getMonth() + 1 === date.month &&
      bookingDate.getDate() === date.day
    )
  }) ?? false

  return isFree
}
</script>

<template>
  <USlideover
    :open="showSupportBook"
    side="right"
    :overlay="false"
    close-icon="i-heroicons-arrow-left"
    :close="{
      size: 'md',
      onClick: () => {
        go('#support')
      },
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
          name="i-lucide-calendar-check"
          class="inline-block size-6 opacity-50"
        />
        Termin reservieren
      </h3>
    </template>

    <template #body>
      <div class="flex flex-col gap-2 mb-4">
        <div
          v-for="booking in userSupportBookings"
          :key="booking.id"
          class="flex items-start justify-between gap-2 bg-primary-100 rounded-lg p-4"
        >
          <div class="text-primary-900">
            <div class="opacity-50 text-xs">
              Ihr Termin:
            </div>
            <div class="font-semibold">
              Am {{ new Date(booking.date).toLocaleDateString('de-DE') }}
            </div>
            <div class="font-semibold opacity-50 text-sm">
              um {{ new Date(booking.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) }} Uhr
            </div>
          </div>
          <UButton
            label="absagen"
          />
        </div>
      </div>
      <UCalendar
        v-model="selectedDate"
        size="xl"
        :min-value="minDate"
        :max-value="maxDate"
        :is-date-disabled="isDateDisabled"
        :is-date-unavailable="isDateUnavailable"
        :ui="{
          cellTrigger: 'text-xl border border-gray-200 font-bold data-disabled:opacity-20 data-disabled:!cursor-default data-disabled:hover:bg-transparent data-unavailable:font-light data-unavailable:opacity-50',
        }"
      />
      <UFormField label="Uhrzeit" class="mt-8">
        <USelect
          v-model="selectedTime"
          placeholder="Bitte wählen"
          class="w-full"
          size="xl"
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
            { label: '17:00', value: '17:00' },
            { label: '17:30', value: '17:30' },
            { label: '18:00', value: '18:00' },
            { label: '18:30', value: '18:30' },
            { label: '19:00', value: '19:00' },
          ]"
        />
      </UFormField>
      <USwitch
        v-model="selectedRemote"
        label="Fernwartung gewünscht"
        class="mt-4"
      />
      <UButton
        trailing-icon="i-heroicons-check"
        class="mt-4"
        block
        :disabled="!selectedDate || !selectedTime"
        :ui="{
          leadingIcon: 'mr-auto',
        }"
      >
        <div class="flex flex-col items-start">
          <div>
            Termin reservieren
          </div>
          <div
            v-if="selectedDate && selectedTime"
            class="opacity-50"
          >
            am {{ selectedDate?.toDate('UTC').toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }) }} um
            {{ selectedTime }}
          </div>
        </div>
      </UButton>
    </template>
  </USlideover>
</template>
