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
      root: 'border border-primary-600/20 rounded-lg',
      content: 'flex flex-col gap-2 px-3 pb-3',
    }"
  >
    <template #default>
      <div class="flex items-center">
        <UButton
          :label="`${mailbox}@${$profile.domain}`"
          color="primary"
          variant="link"
          trailing-icon="i-heroicons-chevron-down"
          class="flex-1"
          :ui="{
            trailingIcon: `ml-auto transition-transform ${open ? 'rotate-180' : ''}`,
          }"
        />
        <UButton
          color="error"
          variant="soft"
          icon="i-heroicons-trash"
        />
      </div>
    </template>

    <template #content>
      <UButton
        label="Zum Webmail"
      />
      <p class="text-gray-500">
        Richten Sie Ihr E-Mail-Postfach in Ihrem bevorzugten E-Mail-Client ein, indem Sie die folgenden Einstellungen verwenden:
      </p>
      <table>
        <tbody class="[&>tr>td:first-child]:font-bold">
          <tr>
            <td>Benutzername</td>
            <td>{{ mailbox }}@{{ $profile.domain }}</td>
          </tr>
          <tr>
            <td>Passwort</td>
            <td>
              Ihr Passwort
              <UButton
                label="ändern"
                size="sm"
              />
            </td>
          </tr>
          <tr>
            <td>Mailserver</td>
            <td>m01.qboxmail.com</td>
          </tr>
        </tbody>
      </table>

      <UAlert
        title="Benötigen Sie Hilfe?"
        variant="soft"
        icon="i-lucide-headset"
      >
        <template #description>
          Sie können uns jederzeit unter <strong>support@solohost.de</strong> oder über den Live-Chat unten rechts auf Ihrer Website erreichen.
        </template>
      </UAlert>
    </template>
  </UCollapsible>
</template>
