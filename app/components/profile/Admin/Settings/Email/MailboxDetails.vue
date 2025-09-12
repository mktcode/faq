<script setup lang="ts">
defineProps<{
  mailbox: string
}>()

const open = ref(false)
</script>

<template>
  <UCollapsible
    v-model:open="open"
    class="flex flex-col gap-2"
    :ui="{
      root: 'border-b border-gray-200',
      content: 'flex flex-col gap-2 p-2',
    }"
  >
    <template #default>
      <div class="flex items-center">
        <UButton
          :label="`${mailbox}@${$profile.domain}`"
          class="w-full rounded-none p-4"
          variant="ghost"
          color="neutral"
          trailing-icon="i-heroicons-chevron-down"
          :ui="{
            trailingIcon: `ml-auto transition-transform ${open ? 'rotate-180' : ''}`,
          }"
        />
      </div>
    </template>

    <template #content>
      <UButton
        label="zum Postfach"
        trailing-icon="i-heroicons-arrow-top-right-on-square"
        to="https://login.mailbox.org/"
        target="_blank"
        :ui="{
          trailingIcon: 'ml-auto opacity-50',
        }"
      />
      <UAlert
        variant="soft"
      >
        <template #description>
          <table class="w-full">
            <tbody class="[&>tr>td:first-child]:font-bold">
              <tr>
                <td>Benutzername</td>
                <td class="text-right">{{ mailbox }}@{{ $profile.domain }}</td>
              </tr>
              <tr>
                <td>Passwort</td>
                <td class="text-right">
                  Ihr Passwort
                  <UButton
                    label="ändern"
                    size="sm"
                  />
                </td>
              </tr>
              <tr>
                <td>Mailserver</td>
                <td class="text-right">mailbox.org</td>
              </tr>
            </tbody>
          </table>
        </template>
      </UAlert>

      <UAlert
        title="Benötigen Sie Hilfe?"
        variant="soft"
        :actions="[
          {
            label: 'Support kontaktieren',
            icon: 'i-lucide-headset',
            to: '#support',
            size: 'lg',
          },
        ]"
      >
        <template #description>
          Möchten Sie z.B. ein externes E-Mail-Programm einrichten oder haben Sie sonstige Fragen?
        </template>
      </UAlert>
    </template>
  </UCollapsible>
</template>
