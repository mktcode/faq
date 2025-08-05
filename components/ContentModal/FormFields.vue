<script setup lang="ts">
const fields = defineModel('fields', {
  type: Array<{
    label: string;
    help?: string | null;
    name: string;
    type: string;
    required: boolean;
    options?: string[] | null;
    multiple: boolean;
  }>,
  default: () => [],
})

function addField() {
  fields.value.push({
    label: '',
    help: '',
    name: '',
    type: 'text',
    required: false,
    options: ['', ''],
    multiple: false,
  })
}

function removeField(index: number) {
  fields.value.splice(index, 1)
}

const fieldTypes = [{
  value: 'text',
  label: 'einzeiliger Text',
}, {
  value: 'textarea',
  label: 'mehrzeiliger Text',
}, {
  value: 'email',
  label: 'E-Mail',
}, {
  value: 'date',
  label: 'Datum',
}, {
  value: 'datetime',
  label: 'Datum & Uhrzeit',
}, {
  value: 'tel',
  label: 'Telefonnummer',
}, {
  value: 'select',
  label: 'Auswahl',
}, {
  value: 'checkbox',
  label: 'Häkchen setzen',
}]
</script>

<template>
  <div>
    <label class="block font-medium text-sm mb-1">
      Zusätzliche Formularfelder
    </label>
    <div class="flex flex-col gap-4">
      <TransitionGroup name="fade">
        <div
          v-for="(field, index) in fields"
          :key="index"
          :label="field.label"
          class="flex flex-col gap-2 border border-gray-200 p-2 rounded-lg"
        >
          <div class="flex gap-2">
            <UFormField
              :label="`Feld ${index + 1}`"
              class="flex-1"
            >
              <UInput
                v-model="field.label"
                placeholder="Bezeichnung"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Typ">
              <USelect
                v-model="field.type"
                :items="fieldTypes"
                class="w-full min-w-40"
              />
            </UFormField>
          </div>
          <UFormField label="Hilfstext (optional)">
            <UInput
              v-model="field.help"
              placeholder="Wie ist dieses Feld zu verstehen/auszufüllen?"
              class="w-full"
              size="sm"
            />
          </UFormField>
          <template v-if="field.options && field.type === 'select'">
            <label class="block font-medium text-sm">
              Auswahlmöglichkeiten
            </label>
            <div
              v-for="(option, index) in field.options"
              :key="option"
              class="flex items-center gap-2"
            >
              <UInput
                :model-value="option"
                @update:model-value="field.options[index] = $event"
                placeholder="Option"
                class="w-full"
                size="sm"
              />
              <UButton
                variant="soft"
                color="error"
                icon="i-heroicons-trash"
                size="sm"
                @click="field.options.splice(index, 1)"
              />
            </div>
            <UButton
              label="Option hinzufügen"
              variant="soft"
              color="primary"
              icon="i-heroicons-plus"
              @click="field.options.push('')"
            />
          </template>
          <div class="flex items-start justify-between gap-2">
            <div>
              <UCheckbox
                v-if="field.type === 'select'"
                v-model="field.multiple"
                label="Mehrfachauswahl"
              />
              <UCheckbox
                v-model="field.required"
                label="Pflichtfeld"
              />
            </div>
            <UButton
              label="Feld entfernen"
              variant="soft"
              color="error"
              icon="i-heroicons-trash"
              @click="() => removeField(index)"
            />
          </div>
        </div>
      </TransitionGroup>
      <UButton
        label="Feld hinzufügen"
        icon="i-heroicons-plus"
        variant="soft"
        color="primary"
        @click="addField"
      />
    </div>
  </div>
</template>
