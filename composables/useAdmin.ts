export default function useAdmin() {
  const router = useRouter()

  const showMainSettings = computed(() => router.currentRoute.value.hash.startsWith('#settings'))
  const showCompanySettings = computed(() => router.currentRoute.value.hash === '#settings/company')
  const showDomainSettings = computed(() => router.currentRoute.value.hash === '#settings/domain')
  const showEmailSettings = computed(() => router.currentRoute.value.hash === '#settings/email')
  const showSubscriptionSettings = computed(() => router.currentRoute.value.hash.startsWith('#settings/subscription'))
  const showSubscriptionVerification = computed(() => router.currentRoute.value.hash === '#settings/subscription/verification')

  const showWebsiteSettings = computed(() => router.currentRoute.value.hash.startsWith('#website'))
  const showDesignSettings = computed(() => router.currentRoute.value.hash === '#website/design')
  const showOfferingSettings = computed(() => router.currentRoute.value.hash === '#website/offering')
  const showContactFormSettings = computed(() => router.currentRoute.value.hash === '#website/contact-form')
  const showGallerySettings = computed(() => router.currentRoute.value.hash === '#website/gallery')
  const showFaqSettings = computed(() => router.currentRoute.value.hash === '#website/faq')
  const showDownloadsSettings = computed(() => router.currentRoute.value.hash === '#website/downloads')

  const showAssistant = computed(() => router.currentRoute.value.hash.startsWith('#assistant'))
  const showAssistantTips = computed(() => router.currentRoute.value.hash === '#assistant/tips')
  const showAssistantContextSettings = computed(() => router.currentRoute.value.hash === '#assistant/context')

  const showSupport = computed(() => router.currentRoute.value.hash.startsWith('#support'))
  const showSupportPhoneMail = computed(() => router.currentRoute.value.hash === '#support/phone-mail')
  const showSupportLiveChat = computed(() => router.currentRoute.value.hash.startsWith('#support/livechat'))
  const showSupportLiveChatConversation = computed(() => router.currentRoute.value.hash === '#support/livechat/conversation')
  const showSupportRemote = computed(() => router.currentRoute.value.hash === '#support/remote')

  function go(hash: string) {
    router.push({ hash })
  }

  return {
    showMainSettings,
    showCompanySettings,
    showDomainSettings,
    showEmailSettings,
    showSubscriptionSettings,
    showSubscriptionVerification,
    showWebsiteSettings,
    showDesignSettings,
    showOfferingSettings,
    showContactFormSettings,
    showGallerySettings,
    showFaqSettings,
    showDownloadsSettings,
    showAssistant,
    showAssistantTips,
    showAssistantContextSettings,
    showSupport,
    showSupportPhoneMail,
    showSupportLiveChat,
    showSupportLiveChatConversation,
    showSupportRemote,
    go,
  }
}
