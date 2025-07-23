<script setup lang="ts">
import type { Qanda } from '~/types/db'

const route = useRoute()
const emailVerified = !!route.query.emailVerified
const subscriptionSuccess = !!route.query.subscriptionSuccess

const { username } = defineProps<{
  username: string
}>()

const { me } = await useMe()

const { data: currentSettings, refresh: refreshSettings } = await useFetch(`/api/settings`, {
  query: {
    username,
  },
})

useHead({
  title: currentSettings.value?.title || 'Mein Gewerbeprofil',
  meta: [
    {
      name: 'description',
      content: currentSettings.value?.description || 'Mein Unternehmen auf einem Blick',
    },
  ],
})

const { data: qanda } = await useFetch<Qanda[]>(`/api/qanda`, {
  query: {
    username,
  },
})

const qandaAccordionItems = computed(() => {
  return qanda.value?.map(item => ({
    label: item.question,
    content: item.answer,
  })) || []
})

const appConfig = useAppConfig()
const font = computed(() => currentSettings.value?.font || 'roboto')
appConfig.ui.colors.primary = currentSettings.value?.color || 'sky'
appConfig.ui.button.defaultVariants.rounded = currentSettings.value?.rounded || 'md'
appConfig.ui.input.defaultVariants.rounded = currentSettings.value?.rounded || 'md'
appConfig.ui.select.defaultVariants.rounded = currentSettings.value?.rounded || 'md'
appConfig.ui.textarea.defaultVariants.rounded = currentSettings.value?.rounded || 'md'

const designRounded = useState('designRounded', () => currentSettings.value?.rounded || 'md')
</script>

<template>
  <FontWrapper
    :font="font"
    class="relative"
  >
    <ProfileDefaultNav
      :username="username"
    />
    <ProfileDefaultHeader
      :username="username"
      :current-settings="currentSettings"
    />
    <div
      v-if="currentSettings"
      class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 px-6"
    >
      <ProfileDefaultComponentViewer
        v-for="index in [0, 1]"
        :settings="currentSettings"
        :slot-index="index"
        :key="index"
      />

      <div
        v-if="currentSettings?.downloads?.length"
        class="my-6 w-full"
      >
        <ProfileDefaultDownloads :downloads="currentSettings?.downloads || []" />
      </div>

      <div class="my-6 w-full">
        <ProfileDefaultForm
          :username="username"
          :contact-phone="currentSettings?.company?.phone || ''"
        />
      </div>

      <div
        v-if="qandaAccordionItems.length"
        class="flex flex-col gap-4 w-full mt-6"
      >
        <h3 class="text-2xl font-semibold">
          Häufig gestellte Fragen
        </h3>
        <UAccordion
          :items="qandaAccordionItems"
          :ui="{
            root: 'w-full flex flex-col gap-2',
            header: `bg-primary-50 px-4 !py-0 hover:bg-primary-100 rounded-${designRounded}`,
            trigger: 'py-2',
            label: 'text-lg text-primary-950',
            body: 'text-lg text-gray-500 pt-2',
            item: '!border-0',
            trailingIcon: 'text-primary-500',
          }"
        >
          <template #body="{ item }">
            <div
              class="prose"
              v-html="item.content"
            />
          </template>
        </UAccordion>
      </div>

      <div class="w-full flex items-center justify-center gap-2 mt-12 text-sm">
        <ULink
          to="/impressum"
          class="text-gray-400"
        >
          Impressum
        </ULink>
        <ULink
          to="/datenschutz"
          class="text-gray-400"
        >
          Datenschutz
        </ULink>
      </div>
    </div>

    <div class="w-full mt-6 py-24 border-t border-gray-200">
      <CustomerRequests v-if="me" />
    </div>

    <EmailVerifiedModal
      v-if="emailVerified"
    />
    <SubscriptionSuccessModal
      v-if="subscriptionSuccess"
    />
    <SettingsModal
      v-if="me"
      @update="refreshSettings"
    />
    <DesignModal
      v-if="me"
      @update="refreshSettings"
    />
    <ContentModal
      v-if="me"
      @update="refreshSettings"
    />
    <LinksModal
      v-if="me"
      @update="refreshSettings"
    />
    <ClientOnly>
      <WelcomeModal />
    </ClientOnly>
  </FontWrapper>
</template>
